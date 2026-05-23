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

const STATS = [
  { value: '437', label: 'Títulos indexados' },
  { value: '12', label: 'Eras cronológicas' },
  { value: '89', label: 'Reseñas publicadas' },
  { value: '142', label: 'Colecciones' },
];

const HERO_BOOKS: { title: string; author: string; tone: ToneKey; kind: 'canon' | 'legends'; rotation: number; top: number; left: number }[] = [
  { title: 'Amanecer del Jedi', author: 'John Ostrander', tone: 'A', kind: 'legends', rotation: -4, top: 20, left: 40 },
  { title: 'Alta República', author: 'Claudia Gray', tone: 'E', kind: 'canon', rotation: 2, top: 60, left: 120 },
  { title: 'Darth Plagueis', author: 'James Luceno', tone: 'D', kind: 'legends', rotation: 3, top: 10, left: 220 },
  { title: 'Thrawn', author: 'Timothy Zahn', tone: 'C', kind: 'canon', rotation: -6, top: 80, left: 300 },
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

const RECENT_REVIEWS = [
  { title: 'La Alta República: Luz de los Jedi', author: 'Charles Soule', score: 4.5, tone: 'E' as ToneKey, kind: 'canon' as const, excerpt: 'Un comienzo épico para la era más luminosa de los Jedi. Soule construye un universo vivo y amenazante.', date: '12 may 2026' },
  { title: 'Thrawn', author: 'Timothy Zahn', score: 5, tone: 'C' as ToneKey, kind: 'canon' as const, excerpt: 'El regreso del gran almirante es tan brillante como uno esperaba. Imprescindible.', date: '3 may 2026' },
  { title: 'Darth Plagueis', author: 'James Luceno', score: 4, tone: 'D' as ToneKey, kind: 'legends' as const, excerpt: 'El origen del Sith más poderoso, narrado con una densidad política que pocos libros de SW alcanzan.', date: '28 abr 2026' },
];

const Home: React.FC = () => {
  const navigate = useNavigate();

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
              437 títulos del universo expandido ordenados cronológicamente. Canon y Leyendas. Novelas, cómics, audiolibros y antologías.
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
            {HERO_BOOKS.map((book, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: book.top,
                  left: book.left,
                  transform: `rotate(${book.rotation}deg)`,
                  transition: 'transform 0.3s',
                }}
              >
                <BookCover
                  title={book.title}
                  author={book.author}
                  tone={book.tone}
                  kind={book.kind}
                  w={140}
                  ratio={1.5}
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {RECENT_REVIEWS.map((r, i) => (
            <div
              key={i}
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
              <BookCover title={r.title} author={r.author} tone={r.tone} kind={r.kind} w={72} ratio={1.5} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <Flag kind={r.kind} size="sm" />
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
                  {r.title}
                </h4>
                <div
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 12,
                    color: '#5C5A52',
                    marginBottom: 10,
                  }}
                >
                  {r.author}
                </div>
                <Stars value={r.score} />
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
                  {r.excerpt}
                </p>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11,
                    color: '#5C5A52',
                    marginTop: 12,
                  }}
                >
                  {r.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
