import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopNav from '../../components/Layout/TopNav';
import Footer from '../../components/Layout/Footer';
import BookCover from '../../components/BookCover/BookCover';
import Flag from '../../components/Flag/Flag';
import useApi from '../../hooks/useApi';
import { getCollection } from '../../api/collections';
import { ToneKey } from '../../types/publication';
import { Publication } from '../../types/publication';

const TONE_KEYS: ToneKey[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const TONE_SET = new Set<string>(TONE_KEYS);
const deriveTone = (id: number, offset = 0): ToneKey => TONE_KEYS[(id * 3 + offset) % 8];
const safeTone = (raw: string | undefined, id: number, offset: number): ToneKey =>
  raw && TONE_SET.has(raw) ? (raw as ToneKey) : deriveTone(id, offset);

const CollectionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: col, loading, error } = useApi(() => getCollection(Number(id)), [id]);

  const kind: 'canon' | 'legends' = col?.is_canon ? 'canon' : 'legends';
  const accentColor = kind === 'canon' ? '#4B8FD9' : '#C25555';

  const coverTiles = col
    ? [0, 1, 2].map((i) => ({ tone: safeTone(col.cover_tone, col.id, i) }))
    : [];

  const publications: Publication[] = col?.publications ?? [];

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', display: 'flex', flexDirection: 'column' }}>
      <TopNav active="Colecciones" />

      <div style={{ flex: 1, padding: '40px 56px 64px' }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: 32 }}>
          <button
            onClick={() => navigate('/colecciones')}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              color: '#9C9788',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#C9A84C')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#9C9788')}
          >
            <span style={{ fontSize: 16, lineHeight: 1 }}>←</span>
            Colecciones
          </button>
        </div>

        {/* Loading */}
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

        {/* Error */}
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
            Error al cargar la colección.
          </div>
        )}

        {/* Content */}
        {!loading && !error && col && (
          <>
            {/* Header */}
            <div style={{ marginBottom: 48 }}>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 12,
                  color: '#C9A84C',
                  letterSpacing: '0.1em',
                  marginBottom: 10,
                }}
              >
                // {col.era ?? 'colección'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                <h1
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontWeight: 600,
                    fontSize: 52,
                    textTransform: 'uppercase',
                    color: '#F2EEDF',
                    letterSpacing: '-0.01em',
                    lineHeight: 1,
                  }}
                >
                  {col.name}
                </h1>
                <Flag kind={kind} size="sm" />
              </div>
              {col.author && (
                <div
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 15,
                    color: '#9C9788',
                    marginTop: 10,
                  }}
                >
                  {col.author}
                </div>
              )}
            </div>

            {/* Two-column body */}
            <div style={{ display: 'flex', gap: 48, alignItems: 'flex-start' }}>
              {/* Left: cover + metadata */}
              <div style={{ width: 260, flexShrink: 0 }}>
                {/* Stacked covers */}
                <div
                  style={{
                    position: 'relative',
                    height: 260,
                    background: '#14141C',
                    borderRadius: 10,
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 24,
                    border: `1px solid ${accentColor}30`,
                  }}
                >
                  {coverTiles.map((tile, i) => (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        transform: `rotate(${[-8, 0, 8][i]}deg) translateX(${[-40, 0, 40][i]}px)`,
                        zIndex: 3 - i,
                        opacity: 1 - i * 0.05,
                      }}
                    >
                      <BookCover
                        title={col.name}
                        tone={tile.tone}
                        kind={kind}
                        w={130}
                        ratio={1.5}
                        badge={false}
                      />
                    </div>
                  ))}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 100,
                      background: 'linear-gradient(0deg, #14141C, transparent)',
                    }}
                  />
                </div>

                {/* Metadata card */}
                <div
                  style={{
                    background: '#14141C',
                    border: '1px solid rgba(201,168,76,0.1)',
                    borderRadius: 10,
                    padding: '20px 24px',
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 10,
                      color: '#C9A84C',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      marginBottom: 16,
                    }}
                  >
                    // ficha
                  </div>
                  {[
                    { label: 'Canon', value: col.is_canon ? 'Canon' : 'Leyendas' },
                    { label: 'Era', value: col.era },
                    { label: 'Autor', value: col.author },
                    { label: 'Publicaciones', value: publications.length > 0 ? String(publications.length) : undefined },
                  ]
                    .filter((row) => row.value)
                    .map((row) => (
                      <div
                        key={row.label}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'baseline',
                          marginBottom: 10,
                          gap: 12,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: 12,
                            color: '#5C5A52',
                            flexShrink: 0,
                          }}
                        >
                          {row.label}
                        </span>
                        <span
                          style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: 13,
                            color: '#9C9788',
                            textAlign: 'right',
                          }}
                        >
                          {row.value}
                        </span>
                      </div>
                    ))}
                </div>

                {/* Description */}
                {col.description && (
                  <div
                    style={{
                      marginTop: 20,
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 14,
                      color: '#9C9788',
                      lineHeight: 1.65,
                    }}
                  >
                    {col.description}
                  </div>
                )}
              </div>

              {/* Right: publications grid */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11,
                    color: '#C9A84C',
                    letterSpacing: '0.1em',
                    marginBottom: 24,
                  }}
                >
                  // publicaciones en esta colección
                </div>

                {publications.length === 0 ? (
                  <div
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 15,
                      color: '#5C5A52',
                      padding: '40px 0',
                    }}
                  >
                    No hay publicaciones registradas en esta colección.
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                      gap: 20,
                    }}
                  >
                    {publications.map((pub) => (
                      <PubCard key={pub.id} pub={pub} collectionKind={kind} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

const PubCard: React.FC<{ pub: Publication; collectionKind: 'canon' | 'legends' }> = ({
  pub,
  collectionKind,
}) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const kind: 'canon' | 'legends' = pub.is_canon ? 'canon' : 'legends';
  const tone = deriveTone(pub.id);
  const borderColor = kind === 'canon' ? '#4B8FD9' : '#C25555';

  return (
    <div
      onClick={() => navigate(`/publicaciones/${pub.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#14141C',
        border: `1px solid ${hovered ? borderColor + '50' : 'rgba(201,168,76,0.1)'}`,
        borderRadius: 8,
        overflow: 'hidden',
        cursor: 'pointer',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hovered ? `0 8px 28px rgba(0,0,0,0.45), 0 0 0 1px ${borderColor}30` : 'none',
        transition: 'all 0.22s ease',
      }}
    >
      {/* Cover */}
      <div
        style={{
          background: '#1C1C26',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 0 16px',
        }}
      >
        <BookCover title={pub.title} tone={tone} kind={kind} w={100} ratio={1.5} badge={false} imageUrl={pub.cover_urls?.[0] || undefined} />
      </div>

      {/* Info */}
      <div style={{ padding: '12px 14px 16px' }}>
        <h3
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontWeight: 600,
            fontSize: 14,
            textTransform: 'uppercase',
            color: '#F2EEDF',
            lineHeight: 1.2,
            marginBottom: 4,
            letterSpacing: '0.02em',
          }}
        >
          {pub.title}
        </h3>
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            color: '#9C9788',
            marginBottom: 2,
          }}
        >
          {pub.author}
        </div>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            color: '#5C5A52',
            letterSpacing: '0.06em',
          }}
        >
          {pub.year}
        </div>
      </div>
    </div>
  );
};

export default CollectionDetail;
