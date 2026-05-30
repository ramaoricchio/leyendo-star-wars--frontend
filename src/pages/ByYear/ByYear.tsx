import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNav from '../../components/Layout/TopNav';
import Footer from '../../components/Layout/Footer';
import BookCover from '../../components/BookCover/BookCover';
import Flag from '../../components/Flag/Flag';
import { ToneKey, Publication } from '../../types/publication';
import useApi from '../../hooks/useApi';
import { getPublications } from '../../api/publications';

type CanonFilter = 'canon' | 'legends' | 'ambos';

const TONE_KEYS: ToneKey[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const deriveTone = (id: number): ToneKey => TONE_KEYS[id % 8];

const DECADES = [1977, 1980, 1990, 2000, 2010, 2020, 2026];

const ByYear: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<CanonFilter>('ambos');

  const { data, loading, error } = useApi(() => getPublications({ per_page: 200 }));
  const publications: Publication[] = data?.items ?? [];

  const filtered = publications.filter((p) => {
    if (filter === 'ambos') return true;
    return filter === 'canon' ? p.is_canon : !p.is_canon;
  });

  const yearMap = filtered.reduce<Record<number, Publication[]>>((acc, pub) => {
    const year = pub.year ?? 0;
    if (!acc[year]) acc[year] = [];
    acc[year].push(pub);
    return acc;
  }, {});

  const sortedYears = Object.keys(yearMap)
    .map(Number)
    .filter((y) => y > 0)
    .sort((a, b) => b - a);

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', display: 'flex', flexDirection: 'column' }}>
      <TopNav active="Por año" />

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
          // año de publicación real
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
            Por año
          </h1>
          {/* Canon filter pills */}
          <div style={{ display: 'flex', gap: 8 }}>
            {(['ambos', 'canon', 'legends'] as CanonFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  background: filter === f ? '#C9A84C' : 'rgba(201,168,76,0.08)',
                  border: `1px solid ${filter === f ? '#C9A84C' : 'rgba(201,168,76,0.2)'}`,
                  borderRadius: 20,
                  color: filter === f ? '#0A0A0F' : '#9C9788',
                  fontFamily: "'Oswald', sans-serif",
                  fontWeight: 500,
                  fontSize: 13,
                  padding: '6px 18px',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                {f === 'ambos' ? 'Ambos' : f === 'canon' ? 'Canon' : 'Leyendas'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Decades bar */}
      <div
        style={{
          padding: '24px 56px',
          borderBottom: '1px solid rgba(201,168,76,0.08)',
          display: 'flex',
          gap: 0,
          alignItems: 'center',
          overflowX: 'auto',
        }}
      >
        {DECADES.map((decade, i) => (
          <React.Fragment key={decade}>
            <button
              style={{
                background: 'none',
                border: 'none',
                color: '#5C5A52',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                cursor: 'pointer',
                padding: '4px 12px',
                letterSpacing: '0.06em',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => (e.target as HTMLButtonElement).style.color = '#C9A84C'}
              onMouseLeave={(e) => (e.target as HTMLButtonElement).style.color = '#5C5A52'}
              onClick={() => {
                const nextDecade = DECADES[i + 1] ?? Infinity;
                const target =
                  sortedYears.find((y) => y >= decade && y < nextDecade) ??
                  sortedYears.reduce((closest, y) =>
                    Math.abs(y - decade) < Math.abs(closest - decade) ? y : closest
                  );
                if (target !== undefined) {
                  document.getElementById(`year-${target}`)?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              {decade}
            </button>
            {i < DECADES.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: 2,
                  background: 'linear-gradient(90deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05))',
                  minWidth: 20,
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Year groups */}
      <div style={{ padding: '48px 56px', flex: 1 }}>
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
            Error al cargar las publicaciones.
          </div>
        )}
        {!loading && !error && sortedYears.map((year) => {
          const books = yearMap[year];
          return (
            <div
              key={year}
              id={`year-${year}`}
              style={{
                marginBottom: 64,
                display: 'flex',
                gap: 48,
                alignItems: 'flex-start',
              }}
            >
              {/* Year label */}
              <div style={{ flexShrink: 0, width: 160 }}>
                <div
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontWeight: 600,
                    fontSize: 64,
                    color: '#C9A84C',
                    lineHeight: 1,
                  }}
                >
                  {year}
                </div>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11,
                    color: '#5C5A52',
                    letterSpacing: '0.08em',
                    marginTop: 8,
                  }}
                >
                  {books.length} títulos
                </div>
                <div
                  style={{
                    width: 40,
                    height: 1,
                    background: 'rgba(201,168,76,0.3)',
                    marginTop: 16,
                  }}
                />
              </div>

              {/* Books grid */}
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  gap: 16,
                  flexWrap: 'wrap',
                  alignItems: 'flex-start',
                }}
              >
                {books.map((pub) => {
                  const kind: 'canon' | 'legends' = pub.is_canon ? 'canon' : 'legends';
                  return (
                    <div
                      key={pub.id}
                      onClick={() => navigate(`/publicaciones/${pub.id}`)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                        cursor: 'pointer',
                        width: 110,
                      }}
                    >
                      <BookCover
                        title={pub.title}
                        author={pub.author}
                        tone={deriveTone(pub.id)}
                        kind={kind}
                        w={110}
                        ratio={1.5}
                        imageUrl={pub.cover_urls?.[0] || undefined}
                      />
                      <Flag kind={kind} size="sm" />
                      <div
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 12,
                          color: '#9C9788',
                          lineHeight: 1.3,
                        }}
                      >
                        {pub.title}
                      </div>
                      <div
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 11,
                          color: '#5C5A52',
                        }}
                      >
                        {pub.author}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        {!loading && !error && sortedYears.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '80px 0',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 16,
              color: '#5C5A52',
            }}
          >
            No hay publicaciones disponibles.
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ByYear;
