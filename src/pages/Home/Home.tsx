import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopNav from '../../components/Layout/TopNav';
import Footer from '../../components/Layout/Footer';
import Starfield from '../../components/Starfield/Starfield';
import BookCover from '../../components/BookCover/BookCover';
import SectionHeading from '../../components/SectionHeading/SectionHeading';
import Stars from '../../components/Stars/Stars';
import Flag from '../../components/Flag/Flag';
import { ToneKey } from '../../types/publication';
import useApi from '../../hooks/useApi';
import { getStats } from '../../api/stats';
import { getPublications } from '../../api/publications';
import { getReviews } from '../../api/reviews';

const HERO_POSITIONS: { rotation: number; top: number; left: number }[] = [
  { rotation: -4, top: 20, left: 40 },
  { rotation: 2, top: 60, left: 120 },
  { rotation: 3, top: 10, left: 220 },
  { rotation: -6, top: 80, left: 300 },
];

const FEATURE_CARDS = [
  {
    num: '01',
    kicker: 'Desde el Amanecer Jedi hasta la Nueva República',
    title: 'Timeline Cronológico',
    body: 'Explorá más de 25.000 años de historia galáctica ordenados por era. Filtrá por Canon o Leyendas y encontrá exactamente dónde empieza tu próxima lectura.',
    cta: 'Explorar timeline',
    path: '/timeline',
  },
  {
    num: '02',
    kicker: 'Series, trilogías y sagas completas',
    title: 'Colecciones',
    body: 'Seguí las sagas más épicas del universo expandido en el orden correcto. Desde la trilogía de Thrawn hasta la Alta República.',
    cta: 'Ver colecciones',
    path: '/colecciones',
  },
  {
    num: '03',
    kicker: 'Opiniones honestas de la galaxia',
    title: 'Reseñas',
    body: 'Reseñas detalladas de cada título. Qué funciona, qué no, y cuándo leerlo para máximo impacto narrativo.',
    cta: 'Leer reseñas',
    path: '/resenas',
  },
];

const deriveTone = (id: number): ToneKey =>
  String.fromCharCode(65 + (id % 8)) as ToneKey;

const formatDate = (iso: string): string => {
  const d = new Date(iso);
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { data: statsData } = useApi(getStats);
  const { data: pubsData } = useApi(() => getPublications({ per_page: 4 }));
  const { data: reviewsData } = useApi(() => getReviews({ per_page: 6 }));

  const heroBooks = pubsData?.items ?? [];
  const recentReviews = (reviewsData?.items ?? [])
    .filter((r) => r.is_active !== false)
    .slice(0, 3);

  const STATS = [
    { value: statsData?.publications_count ?? '—', label: 'Títulos indexados' },
    { value: statsData?.eras_count ?? '—', label: 'Eras cronológicas' },
    { value: statsData?.reviews_count ?? '—', label: 'Reseñas publicadas' },
    { value: statsData?.collections_count ?? '—', label: 'Colecciones' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', display: 'flex', flexDirection: 'column' }}>
      <TopNav active="Home" />

      {/* HERO */}
      <section
        style={{
          position: 'relative',
          minHeight: '88vh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          padding: '0 56px',
        }}
      >
        <Starfield density={1.2} />
        {/* Gold line bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 1,
            background: 'rgba(201,168,76,0.18)',
          }}
        />
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 1328,
            margin: '0 auto',
            width: '100%',
            display: 'grid',
            gridTemplateColumns: '1fr 520px',
            gap: 80,
            alignItems: 'center',
            paddingTop: 80,
            paddingBottom: 80,
          }}
        >
          {/* Left: Text */}
          <div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                color: '#C9A84C',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: 24,
              }}
            >
              // guía de lectura cronológica
            </div>
            <h1
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontWeight: 600,
                fontSize: 86,
                textTransform: 'uppercase',
                lineHeight: 0.95,
                color: '#F2EEDF',
                letterSpacing: '-0.02em',
                marginBottom: 32,
              }}
            >
              Una galaxia<br />
              <span style={{ color: '#C9A84C' }}>se lee mejor</span><br />
              en orden
            </h1>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 18,
                color: '#9C9788',
                lineHeight: 1.65,
                maxWidth: 480,
                marginBottom: 40,
              }}
            >
              {statsData?.publications_count ?? '—'} títulos del universo expandido ordenados cronológicamente. Canon y Leyendas. Novelas, cómics, audiolibros y antologías.
            </p>
            <div style={{ display: 'flex', gap: 16 }}>
              <button
                onClick={() => navigate('/timeline')}
                style={{
                  background: 'linear-gradient(135deg, #C9A84C, #8E7635)',
                  border: 'none',
                  borderRadius: 6,
                  color: '#0A0A0F',
                  fontFamily: "'Oswald', sans-serif",
                  fontWeight: 600,
                  fontSize: 14,
                  padding: '14px 28px',
                  cursor: 'pointer',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                Explorar el timeline →
              </button>
              <button
                onClick={() => navigate('/resenas')}
                style={{
                  background: 'none',
                  border: '1px solid rgba(242,238,223,0.25)',
                  borderRadius: 6,
                  color: '#F2EEDF',
                  fontFamily: "'Oswald', sans-serif",
                  fontWeight: 500,
                  fontSize: 14,
                  padding: '14px 28px',
                  cursor: 'pointer',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                Últimas reseñas
              </button>
            </div>
            {/* Stats strip */}
            <div
              style={{
                display: 'flex',
                gap: 40,
                marginTop: 56,
                paddingTop: 32,
                borderTop: '1px solid rgba(201,168,76,0.15)',
              }}
            >
              {STATS.map((s) => (
                <div key={s.label}>
                  <div
                    style={{
                      fontFamily: "'Oswald', sans-serif",
                      fontWeight: 600,
                      fontSize: 36,
                      color: '#C9A84C',
                      lineHeight: 1,
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 12,
                      color: '#5C5A52',
                      marginTop: 4,
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Book covers composition */}
          <div style={{ position: 'relative', height: 480 }}>
            {heroBooks.slice(0, 4).map((pub, i) => (
              <div
                key={pub.id}
                onClick={() => navigate(`/publicaciones/${pub.id}`)}
                style={{
                  position: 'absolute',
                  top: HERO_POSITIONS[i].top,
                  left: HERO_POSITIONS[i].left,
                  transform: `rotate(${HERO_POSITIONS[i].rotation}deg)`,
                  transition: 'transform 0.3s',
                  cursor: 'pointer',
                }}
              >
                <BookCover
                  title={pub.title}
                  author={pub.author}
                  tone={deriveTone(pub.id)}
                  kind={pub.is_canon ? 'canon' : 'legends'}
                  w={140}
                  ratio={1.5}
                  imageUrl={pub.cover_urls?.[0] || undefined}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section
        style={{
          padding: '80px 56px',
          maxWidth: 1440,
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {FEATURE_CARDS.map((card) => (
            <div
              key={card.num}
              style={{
                background: '#14141C',
                border: '1px solid rgba(201,168,76,0.12)',
                borderRadius: 12,
                padding: '36px 32px',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'border-color 0.2s, transform 0.2s',
              }}
              onClick={() => navigate(card.path)}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(201,168,76,0.3)';
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(201,168,76,0.12)';
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
              }}
            >
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 48,
                  color: 'rgba(201,168,76,0.08)',
                  fontWeight: 400,
                  position: 'absolute',
                  top: 20,
                  right: 24,
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                }}
              >
                {card.num}
              </div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  color: '#5C5A52',
                  letterSpacing: '0.06em',
                  marginBottom: 12,
                }}
              >
                {card.kicker}
              </div>
              <h3
                style={{
                  fontFamily: "'Oswald', sans-serif",
                  fontWeight: 600,
                  fontSize: 28,
                  textTransform: 'uppercase',
                  color: '#F2EEDF',
                  marginBottom: 16,
                  letterSpacing: '0.02em',
                }}
              >
                {card.title}
              </h3>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  color: '#9C9788',
                  lineHeight: 1.6,
                  marginBottom: 28,
                }}
              >
                {card.body}
              </p>
              <span
                style={{
                  color: '#C9A84C',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                {card.cta} →
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Reviews */}
      <section
        style={{
          padding: '0 56px 80px',
          maxWidth: 1440,
          margin: '0 auto',
          width: '100%',
        }}
      >
        <SectionHeading
          kicker="últimas publicadas"
          title="Reseñas recientes"
          action="Ver todas"
          onAction={() => navigate('/resenas')}
        />
        {recentReviews.length === 0 ? (
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              color: '#5C5A52',
              padding: '24px 0',
            }}
          >
            Todavía no hay reseñas publicadas.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {recentReviews.map((review) => {
              const pub = review.publication!;
              const kind: 'canon' | 'legends' = pub.is_canon ? 'canon' : 'legends';
              return (
                <div
                  key={review.id}
                  onClick={() => navigate(`/resenas/${review.id}`)}
                  style={{
                    background: '#14141C',
                    border: '1px solid rgba(201,168,76,0.1)',
                    borderRadius: 10,
                    padding: 24,
                    display: 'flex',
                    gap: 20,
                    cursor: 'pointer',
                    transition: 'border-color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(201,168,76,0.25)'}
                  onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(201,168,76,0.1)'}
                >
                  <BookCover
                    title={pub.title}
                    author={pub.author}
                    tone={deriveTone(pub.id)}
                    kind={kind}
                    w={72}
                    ratio={1.5}
                    imageUrl={pub.cover_urls?.[0] || undefined}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Flag kind={kind} size="sm" />
                    <h4
                      style={{
                        fontFamily: "'Oswald', sans-serif",
                        fontWeight: 500,
                        fontSize: 16,
                        textTransform: 'uppercase',
                        color: '#F2EEDF',
                        marginTop: 8,
                        marginBottom: 4,
                        lineHeight: 1.1,
                      }}
                    >
                      {pub.title}
                    </h4>
                    <div
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 12,
                        color: '#5C5A52',
                        marginBottom: 10,
                      }}
                    >
                      {pub.author}
                    </div>
                    <Stars value={review.score} />
                    {review.excerpt && (
                      <p
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 13,
                          color: '#9C9788',
                          lineHeight: 1.5,
                          marginTop: 10,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {review.excerpt}
                      </p>
                    )}
                    <div
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 11,
                        color: '#5C5A52',
                        marginTop: 12,
                      }}
                    >
                      {formatDate(review.date)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Home;
