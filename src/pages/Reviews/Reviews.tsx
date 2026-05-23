import React, { useState } from 'react';
import TopNav from '../../components/Layout/TopNav';
import Footer from '../../components/Layout/Footer';
import BookCover from '../../components/BookCover/BookCover';
import Flag from '../../components/Flag/Flag';
import Stars from '../../components/Stars/Stars';
import { ToneKey } from '../../types/publication';

interface ReviewItem {
  id: number;
  title: string;
  author: string;
  tone: ToneKey;
  kind: 'canon' | 'legends';
  score: number;
  date: string;
  pubType: string;
  excerpt: string;
  featured?: boolean;
}

const REVIEWS: ReviewItem[] = [
  {
    id: 1,
    title: 'La Alta República: Luz de los Jedi',
    author: 'Charles Soule',
    tone: 'E',
    kind: 'canon',
    score: 4.5,
    date: '12 may 2026',
    pubType: 'Novela',
    excerpt: 'Un comienzo épico para la era más luminosa de los Jedi. Soule construye un universo vivo y amenazante con una maestría narrativa que pocas novelas de Star Wars logran. La Gran Catástrofe es uno de los eventos más visuales e impactantes de todo el canon.',
    featured: true,
  },
  {
    id: 2,
    title: 'Thrawn',
    author: 'Timothy Zahn',
    tone: 'C',
    kind: 'canon',
    score: 5,
    date: '3 may 2026',
    pubType: 'Novela',
    excerpt: 'El regreso del Gran Almirante es tan brillante como uno esperaba. Zahn reinventa al personaje para el canon y lo hace con una elegancia narrativa impecable. Imprescindible para cualquier fan.',
  },
  {
    id: 3,
    title: 'Darth Plagueis',
    author: 'James Luceno',
    tone: 'D',
    kind: 'legends',
    score: 4,
    date: '28 abr 2026',
    pubType: 'Novela',
    excerpt: 'El origen del Sith más poderoso, narrado con una densidad política que pocos libros de Star Wars alcanzan. Luceno construye la conspiración Sith con precisión de relojero.',
  },
  {
    id: 4,
    title: 'Kenobi',
    author: 'John Jackson Miller',
    tone: 'B',
    kind: 'legends',
    score: 4.5,
    date: '15 abr 2026',
    pubType: 'Novela',
    excerpt: 'El mejor retrato de Obi-Wan Kenobi jamás escrito. Miller captura la soledad del exilio y la carga de cargar con los secretos de la galaxia. Una novela de western espacial brillante.',
  },
  {
    id: 5,
    title: 'Aftermath',
    author: 'Chuck Wendig',
    tone: 'G',
    kind: 'canon',
    score: 3,
    date: '8 abr 2026',
    pubType: 'Novela',
    excerpt: 'Un inicio irregular para la nueva era canónica. Wendig tiene ideas frescas pero la ejecución tropieza en el ritmo y algunos personajes secundarios. Vale la pena por los interludios.',
  },
  {
    id: 6,
    title: 'Rogue One: Novela',
    author: 'Alexander Freed',
    tone: 'F',
    kind: 'canon',
    score: 4,
    date: '1 abr 2026',
    pubType: 'Novela',
    excerpt: 'La adaptación supera a la película en profundidad de personaje. Freed da vida interior a Cassian y Jyn con una economía narrativa admirable. Una de las mejores novelizaciones del universo.',
  },
];

const PUB_TYPES = ['Todos', 'Novela', 'Cómic', 'Antología', 'Audiolibro'];

const Reviews: React.FC = () => {
  const [selectedType, setSelectedType] = useState('Todos');
  const [selectedKind, setSelectedKind] = useState<'ambos' | 'canon' | 'legends'>('ambos');
  const [minScore, setMinScore] = useState(0);

  const filtered = REVIEWS.filter((r) => {
    if (selectedType !== 'Todos' && r.pubType !== selectedType) return false;
    if (selectedKind !== 'ambos' && r.kind !== selectedKind) return false;
    if (r.score < minScore) return false;
    return true;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', display: 'flex', flexDirection: 'column' }}>
      <TopNav active="Reseñas" />

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
          // opiniones honestas de la galaxia
        </div>
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
          Reseñas
        </h1>
      </div>

      {/* Content: sidebar + list */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '240px 1fr',
        }}
      >
        {/* Sidebar filters */}
        <div
          style={{
            borderRight: '1px solid rgba(201,168,76,0.1)',
            padding: '32px 24px',
          }}
        >
          <div
            style={{
              fontFamily: "'Oswald', sans-serif",
              fontWeight: 500,
              fontSize: 13,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#5C5A52',
              marginBottom: 16,
            }}
          >
            Tipo
          </div>
          {PUB_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              style={{
                display: 'block',
                width: '100%',
                background: selectedType === t ? 'rgba(201,168,76,0.1)' : 'none',
                border: 'none',
                borderLeft: `2px solid ${selectedType === t ? '#C9A84C' : 'transparent'}`,
                color: selectedType === t ? '#C9A84C' : '#9C9788',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                padding: '8px 12px',
                cursor: 'pointer',
                textAlign: 'left',
                marginBottom: 2,
                transition: 'all 0.2s',
              }}
            >
              {t}
            </button>
          ))}

          <div
            style={{
              fontFamily: "'Oswald', sans-serif",
              fontWeight: 500,
              fontSize: 13,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#5C5A52',
              marginTop: 28,
              marginBottom: 16,
            }}
          >
            Canonicidad
          </div>
          {([['ambos', 'Ambos'], ['canon', 'Canon'], ['legends', 'Leyendas']] as const).map(([val, label]) => (
            <button
              key={val}
              onClick={() => setSelectedKind(val)}
              style={{
                display: 'block',
                width: '100%',
                background: selectedKind === val ? 'rgba(201,168,76,0.1)' : 'none',
                border: 'none',
                borderLeft: `2px solid ${selectedKind === val ? '#C9A84C' : 'transparent'}`,
                color: selectedKind === val ? '#C9A84C' : '#9C9788',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                padding: '8px 12px',
                cursor: 'pointer',
                textAlign: 'left',
                marginBottom: 2,
                transition: 'all 0.2s',
              }}
            >
              {label}
            </button>
          ))}

          <div
            style={{
              fontFamily: "'Oswald', sans-serif",
              fontWeight: 500,
              fontSize: 13,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#5C5A52',
              marginTop: 28,
              marginBottom: 16,
            }}
          >
            Puntaje mínimo
          </div>
          {[0, 1, 2, 3, 4, 5].map((score) => (
            <button
              key={score}
              onClick={() => setMinScore(score)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                width: '100%',
                background: minScore === score ? 'rgba(201,168,76,0.1)' : 'none',
                border: 'none',
                borderLeft: `2px solid ${minScore === score ? '#C9A84C' : 'transparent'}`,
                padding: '8px 12px',
                cursor: 'pointer',
                marginBottom: 2,
                transition: 'all 0.2s',
              }}
            >
              {score === 0 ? (
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: minScore === 0 ? '#C9A84C' : '#9C9788' }}>Todos</span>
              ) : (
                <Stars value={score} size={12} />
              )}
            </button>
          ))}
        </div>

        {/* Review list */}
        <div style={{ padding: '32px 40px' }}>
          {filtered.map((review, i) => (
            <div
              key={review.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '100px 1fr 180px',
                gap: 24,
                alignItems: 'start',
                padding: '24px',
                background: review.featured ? 'rgba(201,168,76,0.04)' : 'transparent',
                border: `1px solid ${review.featured ? 'rgba(201,168,76,0.18)' : 'rgba(255,255,255,0.05)'}`,
                borderRadius: 8,
                marginBottom: 16,
                cursor: 'pointer',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={(e) => {
                if (!review.featured) (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(201,168,76,0.15)';
              }}
              onMouseLeave={(e) => {
                if (!review.featured) (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.05)';
              }}
            >
              {/* Book cover */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <BookCover title={review.title} author={review.author} tone={review.tone} kind={review.kind} w={88} ratio={1.5} />
              </div>
              {/* Meta + excerpt */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Flag kind={review.kind} size="sm" />
                  {review.featured && (
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 10,
                        color: '#C9A84C',
                        background: 'rgba(201,168,76,0.1)',
                        border: '1px solid rgba(201,168,76,0.2)',
                        borderRadius: 3,
                        padding: '2px 6px',
                        letterSpacing: '0.1em',
                      }}
                    >
                      DESTACADA
                    </span>
                  )}
                </div>
                <h3
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontWeight: 600,
                    fontSize: 20,
                    textTransform: 'uppercase',
                    color: '#F2EEDF',
                    letterSpacing: '0.02em',
                    lineHeight: 1.1,
                    marginBottom: 6,
                  }}
                >
                  {review.title}
                </h3>
                <div
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    color: '#5C5A52',
                    marginBottom: 12,
                  }}
                >
                  {review.author} · {review.pubType}
                </div>
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    color: '#9C9788',
                    lineHeight: 1.65,
                  }}
                >
                  {review.excerpt}
                </p>
              </div>
              {/* Score + date */}
              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontWeight: 600,
                    fontSize: 42,
                    color: '#C9A84C',
                    lineHeight: 1,
                    marginBottom: 4,
                  }}
                >
                  {review.score}
                </div>
                <Stars value={review.score} size={14} />
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11,
                    color: '#5C5A52',
                    marginTop: 12,
                    letterSpacing: '0.06em',
                  }}
                >
                  {review.date}
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '80px 0',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 16,
                color: '#5C5A52',
              }}
            >
              No hay reseñas que coincidan con los filtros.
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Reviews;
