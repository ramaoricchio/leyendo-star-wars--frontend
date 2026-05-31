import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNav from '../../components/Layout/TopNav';
import Footer from '../../components/Layout/Footer';
import BookCover from '../../components/BookCover/BookCover';
import Flag from '../../components/Flag/Flag';
import { ToneKey } from '../../types/publication';
import { Collection } from '../../types/collection';
import useApi from '../../hooks/useApi';
import { getCollections } from '../../api/collections';

type FilterType = 'todas' | 'canon' | 'legends';

const TONE_KEYS: ToneKey[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const TONE_SET = new Set<string>(TONE_KEYS);
const deriveTone = (id: number, offset = 0): ToneKey => TONE_KEYS[(id * 3 + offset) % 8];
const safeTone = (raw: string | undefined, id: number, offset: number): ToneKey =>
  raw && TONE_SET.has(raw) ? (raw as ToneKey) : deriveTone(id, offset);

const Collections: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>('todas');

  const { data, loading, error } = useApi(() => getCollections({ per_page: 100 }));
  const collections: Collection[] = data?.items ?? [];

  const filtered = collections.filter((c) => {
    if (filter === 'todas') return true;
    const kind = c.is_canon ? 'canon' : 'legends';
    return kind === filter;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', display: 'flex', flexDirection: 'column' }}>
      <TopNav active="Colecciones" />

      {/* Header */}
      <div style={{ padding: '56px 56px 32px', borderBottom: '1px solid rgba(201,168,76,0.12)' }}>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            color: '#C9A84C',
            letterSpacing: '0.1em',
            marginBottom: 12,
          }}
        >
          // series, trilogías y sagas
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <h1
            style={{
              fontFamily: "'Oswald', sans-serif",
              fontWeight: 600,
              fontSize: 56,
              textTransform: 'uppercase',
              color: '#F2EEDF',
              letterSpacing: '-0.01em',
              lineHeight: 1,
            }}
          >
            Colecciones
          </h1>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, background: '#14141C', borderRadius: 8, padding: 4 }}>
            {(['todas', 'canon', 'legends'] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  background: filter === f ? '#1C1C26' : 'none',
                  border: 'none',
                  borderRadius: 6,
                  color: filter === f ? '#F2EEDF' : '#9C9788',
                  fontFamily: "'Oswald', sans-serif",
                  fontWeight: 500,
                  fontSize: 13,
                  padding: '8px 20px',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  transition: 'all 0.2s',
                }}
              >
                {f === 'todas' ? 'Todas' : f === 'canon' ? 'Canon' : 'Leyendas'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div style={{ flex: 1, padding: '48px 56px 64px' }}>
        {loading && (
          <div
            style={{
              textAlign: 'center',
              padding: '80px 0',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13,
              color: '#5C5A52',
              letterSpacing: '0.06em',
            }}
          >
            Cargando…
          </div>
        )}
        {error && (
          <div
            style={{
              textAlign: 'center',
              padding: '80px 0',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              color: '#C25555',
            }}
          >
            Error al cargar las colecciones.
          </div>
        )}
        {!loading && !error && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 24,
            }}
          >
            {filtered.map((col) => (
              <CollectionCard key={col.id} col={col} />
            ))}
            {filtered.length === 0 && (
              <div
                style={{
                  gridColumn: '1 / -1',
                  textAlign: 'center',
                  padding: '80px 0',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 16,
                  color: '#5C5A52',
                }}
              >
                No hay colecciones disponibles.
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

const CollectionCard: React.FC<{ col: Collection }> = ({ col }) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const kind: 'canon' | 'legends' = col.is_canon ? 'canon' : 'legends';
  const borderColor = kind === 'canon' ? '#4B8FD9' : '#C25555';

  const featuredUrls = col.featured_cover_urls ?? [];

  return (
    <div
      style={{
        background: '#14141C',
        border: `1px solid ${hovered ? borderColor + '50' : 'rgba(201,168,76,0.1)'}`,
        borderRadius: 10,
        overflow: 'hidden',
        cursor: 'pointer',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? `0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px ${borderColor}30` : 'none',
        transition: 'all 0.25s ease',
      }}
      onClick={() => navigate(`/colecciones/${col.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Cover area */}
      <div
        style={{
          position: 'relative',
          height: 180,
          background: '#1C1C26',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Stacked covers */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              transform: `rotate(${[-8, 0, 8][i]}deg) translateX(${[-30, 0, 30][i]}px)`,
              zIndex: 3 - i,
              opacity: 1 - i * 0.05,
            }}
          >
            <BookCover
              title={col.name}
              tone={safeTone(col.cover_tone, col.id, i)}
              kind={kind}
              w={90}
              ratio={1.5}
              badge={false}
              imageUrl={featuredUrls[i] || undefined}
            />
          </div>
        ))}
        {/* Gradient fade */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 80,
            background: 'linear-gradient(0deg, #14141C, transparent)',
          }}
        />
      </div>

      {/* Info area */}
      <div style={{ padding: '16px 20px 20px' }}>
        <div style={{ marginBottom: 10 }}>
          <Flag kind={kind} size="sm" />
        </div>
        <h3
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontWeight: 600,
            fontSize: 18,
            textTransform: 'uppercase',
            color: '#F2EEDF',
            lineHeight: 1.1,
            marginBottom: 6,
            letterSpacing: '0.02em',
          }}
        >
          {col.name}
        </h3>
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            color: '#9C9788',
            marginBottom: 4,
          }}
        >
          {col.author ?? ''}
        </div>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: '#5C5A52',
            letterSpacing: '0.06em',
          }}
        >
          {col.era ?? ''}
        </div>
      </div>
    </div>
  );
};

export default Collections;
