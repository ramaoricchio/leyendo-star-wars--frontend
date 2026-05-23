import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNav from '../../components/Layout/TopNav';
import Footer from '../../components/Layout/Footer';
import BookCover from '../../components/BookCover/BookCover';
import Flag from '../../components/Flag/Flag';
import Stars from '../../components/Stars/Stars';

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
    {/* Thumbnail gradient */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, rgba(20,20,28,0.8) 0%, rgba(40,30,20,0.4) 100%)',
      }}
    />
    {/* Play button */}
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
    {/* Duration pill */}
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
    {/* Info bottom */}
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

const MOCK_PUB = {
  title: 'Thrawn',
  author: 'Timothy Zahn',
  year: 2017,
  era: 'Reinado del Imperio',
  kind: 'canon' as const,
  pubType: 'Novela',
  publisher: 'Del Rey Books',
  isbn: '978-0-345-51152-9',
  pages: 448,
  description: 'El Imperio Galáctico ha tomado control de la galaxia. En las confines del espacio exterior, un enigmático comandante azul emerge de las sombras. Mitth\'raw\'nuruodo —conocido como Thrawn— se alza desde las filas más bajas hasta convertirse en el Gran Almirante más brillante del Imperio. Su ascenso marca el comienzo de una era de estrategia militar sin igual.',
  excerpt: 'Una novela magistral que revela el origen del personaje más querido del universo expandido. Zahn no solo reintroduce a Thrawn en el canon oficial: lo reinventa y lo eleva. La política imperial vista desde adentro, la psicología de guerra y las relaciones de poder hacen de este libro imprescindible.',
  score: 5,
  collection: { name: 'Thrawn (Canon)', position: 1, total: 4 },
  altCovers: ['C', 'E', 'G'] as const,
  tone: 'C' as const,
};

const VIDEOS = [
  { title: 'Thrawn: La historia completa del Gran Almirante | Análisis', channel: 'Jedi Archive', duration: '42:18', views: '284K vistas', featured: true },
  { title: 'Ranking de libros de Thrawn de peor a mejor', channel: 'Leyendo SW', duration: '18:05', views: '67K vistas' },
  { title: 'Por qué Thrawn es el mejor villano de Star Wars', channel: 'HoloNet Talks', duration: '22:30', views: '143K vistas' },
];

const NEXT_BOOKS = [
  { title: 'Thrawn: Alianzas', tone: 'E' as const, kind: 'canon' as const },
  { title: 'Thrawn: Traición', tone: 'G' as const, kind: 'canon' as const },
];

const PublicationDetail: React.FC = () => {
  const navigate = useNavigate();
  const [activeAlt, setActiveAlt] = useState(0);

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
          <span
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/colecciones')}
          >
            colecciones
          </span>
          <span>›</span>
          <span>{MOCK_PUB.collection.name}</span>
          <span>›</span>
          <span style={{ color: '#9C9788' }}>{MOCK_PUB.title}</span>
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
              title={MOCK_PUB.title}
              author={MOCK_PUB.author}
              tone={MOCK_PUB.tone}
              kind={MOCK_PUB.kind}
              w={240}
              ratio={1.5}
            />
            {/* Alt covers */}
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              {MOCK_PUB.altCovers.map((tone, i) => (
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
                    title={MOCK_PUB.title}
                    tone={tone}
                    kind={MOCK_PUB.kind}
                    w={56}
                    ratio={1.5}
                    badge={false}
                  />
                </div>
              ))}
            </div>
            {/* Buy box */}
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
              {[
                { name: 'Amazon', url: '#' },
                { name: 'Mercado Libre', url: '#' },
                { name: 'Buscalibre', url: '#' },
              ].map((link) => (
                <a
                  key={link.name}
                  href={link.url}
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
                  {link.name}
                  <span style={{ color: '#C9A84C', fontSize: 16 }}>→</span>
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Meta + synopsis + review excerpt */}
          <div>
            <Flag kind={MOCK_PUB.kind} />
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
              {MOCK_PUB.title}
            </h1>
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 18,
                color: '#9C9788',
                marginBottom: 24,
              }}
            >
              {MOCK_PUB.author} · {MOCK_PUB.year}
            </div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
              {[MOCK_PUB.pubType, MOCK_PUB.era, MOCK_PUB.publisher].map((tag) => (
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
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 16,
                color: '#9C9788',
                lineHeight: 1.7,
                marginBottom: 36,
              }}
            >
              {MOCK_PUB.description}
            </p>
            {/* Review excerpt */}
            <div
              style={{
                background: 'rgba(201,168,76,0.05)',
                border: '1px solid rgba(201,168,76,0.18)',
                borderRadius: 8,
                padding: 24,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <Stars value={MOCK_PUB.score} />
                <span
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontWeight: 600,
                    fontSize: 24,
                    color: '#C9A84C',
                  }}
                >
                  {MOCK_PUB.score}/5
                </span>
              </div>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 15,
                  color: '#9C9788',
                  lineHeight: 1.65,
                  fontStyle: 'italic',
                }}
              >
                "{MOCK_PUB.excerpt}"
              </p>
            </div>
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
                { label: 'Tipo', value: MOCK_PUB.pubType },
                { label: 'Año', value: MOCK_PUB.year.toString() },
                { label: 'Editorial', value: MOCK_PUB.publisher },
                { label: 'ISBN', value: MOCK_PUB.isbn },
                { label: 'Páginas', value: MOCK_PUB.pages.toString() },
                { label: 'Era', value: MOCK_PUB.era },
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
                    }}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Next in collection */}
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
                Siguiente en {MOCK_PUB.collection.name}
              </div>
              {NEXT_BOOKS.map((book, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    gap: 12,
                    alignItems: 'center',
                    marginBottom: i < NEXT_BOOKS.length - 1 ? 12 : 0,
                    cursor: 'pointer',
                    padding: 8,
                    borderRadius: 6,
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.04)'}
                  onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
                >
                  <BookCover title={book.title} tone={book.tone} kind={book.kind} w={48} ratio={1.5} badge={false} />
                  <div>
                    <div
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 10,
                        color: '#5C5A52',
                        marginBottom: 4,
                      }}
                    >
                      vol. {MOCK_PUB.collection.position + i + 1}
                    </div>
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
                  </div>
                </div>
              ))}
            </div>
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
