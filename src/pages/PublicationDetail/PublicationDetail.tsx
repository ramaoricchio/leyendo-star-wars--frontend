import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TopNav from '../../components/Layout/TopNav';
import Footer from '../../components/Layout/Footer';
import BookCover from '../../components/BookCover/BookCover';
import Flag from '../../components/Flag/Flag';
import useApi from '../../hooks/useApi';
import { getPublication, getPublications } from '../../api/publications';
import { Publication, ToneKey } from '../../types/publication';

// VideoCard local component
interface VideoCardProps {
  title: string;
  channel: string;
  duration: string;
  views: string;
  featured?: boolean;
  tone?: string;
}

const VideoCard: React.FC<VideoCardProps> = ({ title, channel, duration, views, featured = false, tone = '#1C1C26' }) => (
  <div
    style={{
      background: tone,
      borderRadius: 8,
      overflow: 'hidden',
      position: 'relative',
      cursor: 'pointer',
      border: '1px solid rgba(201,168,76,0.1)',
      height: featured ? 220 : 160,
    }}
  >
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, rgba(20,20,28,0.8) 0%, rgba(40,30,20,0.4) 100%)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: featured ? 56 : 40,
        height: featured ? 56 : 40,
        background: 'rgba(201,168,76,0.9)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: 0,
          height: 0,
          borderTop: `${featured ? 9 : 6}px solid transparent`,
          borderBottom: `${featured ? 9 : 6}px solid transparent`,
          borderLeft: `${featured ? 14 : 10}px solid #0A0A0F`,
          marginLeft: 3,
        }}
      />
    </div>
    <div
      style={{
        position: 'absolute',
        bottom: 40,
        right: 10,
        background: 'rgba(0,0,0,0.7)',
        borderRadius: 3,
        padding: '2px 6px',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11,
        color: '#F2EEDF',
      }}
    >
      {duration}
    </div>
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '8px 12px',
        background: 'linear-gradient(0deg, rgba(0,0,0,0.9), transparent)',
      }}
    >
      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 500,
          fontSize: featured ? 14 : 12,
          color: '#F2EEDF',
          lineHeight: 1.3,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 11,
          color: '#9C9788',
          marginTop: 2,
        }}
      >
        {channel} · {views}
      </div>
    </div>
  </div>
);

const VIDEOS = [
  { title: 'Star Wars: La historia completa | Análisis', channel: 'Jedi Archive', duration: '42:18', views: '284K vistas', featured: true },
  { title: 'Ranking de libros de Star Wars de peor a mejor', channel: 'Leyendo SW', duration: '18:05', views: '67K vistas' },
  { title: 'Por qué leer el universo expandido', channel: 'HoloNet Talks', duration: '22:30', views: '143K vistas' },
];

const deriveTone = (id: number): ToneKey =>
  String.fromCharCode(65 + (id % 8)) as ToneKey;

const altTones = (id: number): ToneKey[] => [
  String.fromCharCode(65 + ((id + 1) % 8)) as ToneKey,
  String.fromCharCode(65 + ((id + 3) % 8)) as ToneKey,
  String.fromCharCode(65 + ((id + 5) % 8)) as ToneKey,
];

const PublicationDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const pubId = Number(id);
  const [activeAlt, setActiveAlt] = useState(0);
  const [collectionBooks, setCollectionBooks] = useState<Publication[]>([]);

  const { data: pub, loading, error } = useApi(() => getPublication(pubId));

  useEffect(() => {
    if (!pub?.collection_id) return;
    getPublications({ collection_id: pub.collection_id, per_page: 10 })
      .then((result) => {
        setCollectionBooks(result.items.filter((b) => b.id !== pub.id).slice(0, 2));
      })
      .catch(() => setCollectionBooks([]));
  }, [pub?.collection_id, pub?.id]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0A0F', display: 'flex', flexDirection: 'column' }}>
        <TopNav />
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13,
            color: '#5C5A52',
            letterSpacing: '0.06em',
          }}
        >
          Cargando…
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !pub) {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0A0F', display: 'flex', flexDirection: 'column' }}>
        <TopNav />
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 16,
            color: '#C25555',
          }}
        >
          No se encontró la publicación.
        </div>
        <Footer />
      </div>
    );
  }

  const kind: 'canon' | 'legends' = pub.is_canon ? 'canon' : 'legends';
  const tone = deriveTone(pub.id);
  const alts = altTones(pub.id);
  const activeTone = activeAlt === 0 ? tone : alts[activeAlt - 1];
  const buyLinks = pub.buy_links ? Object.entries(pub.buy_links) : [];

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', display: 'flex', flexDirection: 'column' }}>
      <TopNav />

      <div style={{ padding: '24px 56px 0', maxWidth: 1440, margin: '0 auto', width: '100%' }}>
        {/* Breadcrumb */}
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: '#5C5A52',
            letterSpacing: '0.08em',
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            marginBottom: 32,
          }}
        >
          <span
            style={{ cursor: 'pointer', color: '#C9A84C' }}
            onClick={() => navigate('/')}
          >
            inicio
          </span>
          <span>›</span>
          {pub.collection_id ? (
            <span
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/colecciones')}
            >
              colecciones
            </span>
          ) : (
            <span
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/timeline')}
            >
              timeline
            </span>
          )}
          <span>›</span>
          <span style={{ color: '#9C9788' }}>{pub.title}</span>
        </div>

        {/* Main grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '280px 1fr 280px',
            gap: 48,
            alignItems: 'start',
            marginBottom: 64,
          }}
        >
          {/* Col 1: Cover + alt covers + buy */}
          <div>
            <BookCover
              title={pub.title}
              author={pub.author}
              tone={activeTone}
              kind={kind}
              w={240}
              ratio={1.5}
            />
            {/* Alt covers */}
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              {[tone, ...alts].map((t, i) => (
                <div
                  key={i}
                  onClick={() => setActiveAlt(i)}
                  style={{
                    cursor: 'pointer',
                    border: `2px solid ${activeAlt === i ? '#C9A84C' : 'transparent'}`,
                    borderRadius: 4,
                    overflow: 'hidden',
                  }}
                >
                  <BookCover
                    title={pub.title}
                    tone={t}
                    kind={kind}
                    w={56}
                    ratio={1.5}
                    badge={false}
                  />
                </div>
              ))}
            </div>
            {/* Buy box */}
            {buyLinks.length > 0 && (
              <div
                style={{
                  background: '#14141C',
                  border: '1px solid rgba(201,168,76,0.15)',
                  borderRadius: 8,
                  padding: 20,
                  marginTop: 24,
                }}
              >
                <div
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontWeight: 500,
                    fontSize: 13,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: '#9C9788',
                    marginBottom: 12,
                  }}
                >
                  Conseguir libro
                </div>
                {buyLinks.map(([name, url]) => (
                  <a
                    key={name}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 0',
                      borderBottom: '1px solid rgba(255,255,255,0.06)',
                      color: '#9C9788',
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 14,
                      textDecoration: 'none',
                    }}
                  >
                    {name}
                    <span style={{ color: '#C9A84C', fontSize: 16 }}>→</span>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Col 2: Meta + synopsis */}
          <div>
            <Flag kind={kind} />
            <h1
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontWeight: 600,
                fontSize: 52,
                textTransform: 'uppercase',
                color: '#F2EEDF',
                letterSpacing: '-0.01em',
                lineHeight: 1,
                marginTop: 16,
                marginBottom: 8,
              }}
            >
              {pub.title}
            </h1>
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 18,
                color: '#9C9788',
                marginBottom: 24,
              }}
            >
              {pub.author} · {pub.year}
            </div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
              {[pub.pub_type, pub.era, pub.publisher].filter(Boolean).map((tag) => (
                <span
                  key={tag}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 4,
                    padding: '4px 12px',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11,
                    color: '#9C9788',
                    letterSpacing: '0.06em',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
            {pub.description && (
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 16,
                  color: '#9C9788',
                  lineHeight: 1.7,
                  marginBottom: 36,
                }}
              >
                {pub.description}
              </p>
            )}
          </div>

          {/* Col 3: Ficha técnica + siguiente en colección */}
          <div>
            <div
              style={{
                background: '#14141C',
                border: '1px solid rgba(201,168,76,0.1)',
                borderRadius: 8,
                padding: 24,
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  fontFamily: "'Oswald', sans-serif",
                  fontWeight: 500,
                  fontSize: 14,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#5C5A52',
                  marginBottom: 20,
                }}
              >
                Ficha técnica
              </div>
              {[
                { label: 'Tipo', value: pub.pub_type },
                { label: 'Año', value: pub.year.toString() },
                { label: 'Editorial', value: pub.publisher ?? '—' },
                { label: 'ISBN', value: pub.isbn ?? '—' },
                { label: 'Era', value: pub.era },
              ].map((row) => (
                <div
                  key={row.label}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingBottom: 12,
                    marginBottom: 12,
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 13,
                      color: '#5C5A52',
                    }}
                  >
                    {row.label}
                  </span>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 12,
                      color: '#9C9788',
                      textAlign: 'right',
                      maxWidth: 160,
                      wordBreak: 'break-word',
                    }}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Next in collection */}
            {pub.collection_id && collectionBooks.length > 0 && (
              <div
                style={{
                  background: '#14141C',
                  border: '1px solid rgba(201,168,76,0.1)',
                  borderRadius: 8,
                  padding: 20,
                }}
              >
                <div
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontWeight: 500,
                    fontSize: 12,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: '#5C5A52',
                    marginBottom: 16,
                  }}
                >
                  Otros en esta colección
                </div>
                {collectionBooks.map((book, i) => (
                  <div
                    key={book.id}
                    onClick={() => navigate(`/publicaciones/${book.id}`)}
                    style={{
                      display: 'flex',
                      gap: 12,
                      alignItems: 'center',
                      marginBottom: i < collectionBooks.length - 1 ? 12 : 0,
                      cursor: 'pointer',
                      padding: 8,
                      borderRadius: 6,
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.04)'}
                    onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
                  >
                    <BookCover
                      title={book.title}
                      tone={deriveTone(book.id)}
                      kind={book.is_canon ? 'canon' : 'legends'}
                      w={48}
                      ratio={1.5}
                      badge={false}
                    />
                    <div>
                      <div
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 13,
                          color: '#9C9788',
                          lineHeight: 1.3,
                        }}
                      >
                        {book.title}
                      </div>
                      <div
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 11,
                          color: '#5C5A52',
                          marginTop: 3,
                        }}
                      >
                        {book.author}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Videos section */}
        <div style={{ marginBottom: 64 }}>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              color: '#C9A84C',
              letterSpacing: '0.1em',
              marginBottom: 8,
            }}
          >
            // contenido relacionado
          </div>
          <h2
            style={{
              fontFamily: "'Oswald', sans-serif",
              fontWeight: 600,
              fontSize: 28,
              textTransform: 'uppercase',
              color: '#F2EEDF',
              marginBottom: 24,
              letterSpacing: '0.02em',
            }}
          >
            Videos
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <div style={{ gridColumn: '1 / 2' }}>
              <VideoCard {...VIDEOS[0]} featured={true} tone="#2a1a3e" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <VideoCard {...VIDEOS[1]} tone="#1a3a3e" />
              <VideoCard {...VIDEOS[2]} tone="#1a2a3a" />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PublicationDetail;
