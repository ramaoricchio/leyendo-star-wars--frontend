import React, { useState } from 'react';
import TopNav from '../../components/Layout/TopNav';
import Footer from '../../components/Layout/Footer';
import BookCover from '../../components/BookCover/BookCover';
import Flag from '../../components/Flag/Flag';
import Stars from '../../components/Stars/Stars';
import { ToneKey } from '../../types/publication';
import { Review } from '../../types/review';
import useApi from '../../hooks/useApi';
import { getReviews } from '../../api/reviews';

const TONE_KEYS: ToneKey[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const deriveTone = (id: number): ToneKey => TONE_KEYS[id % 8];

const PUB_TYPE_LABEL: Record<string, string> = {
  novela: 'Novela',
  comic: 'Cómic',
  antologia: 'Antología',
  audiolibro: 'Audiolibro',
};

const formatDate = (iso: string): string => {
  const d = new Date(iso);
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

const PUB_TYPES = ['Todos', 'Novela', 'Cómic', 'Antología', 'Audiolibro'];

const Reviews: React.FC = () => {
  const [selectedType, setSelectedType] = useState('Todos');
  const [selectedKind, setSelectedKind] = useState<'ambos' | 'canon' | 'legends'>('ambos');
  const [minScore, setMinScore] = useState(0);

  const { data, loading, error } = useApi(() => getReviews({ per_page: 100 }));
  const reviews: Review[] = data?.items ?? [];

  const filtered = reviews.filter((r) => {
    if (!r.publication) return false;
    const pubTypeLabel = PUB_TYPE_LABEL[r.publication.pub_type] ?? '';
    if (selectedType !== 'Todos' && pubTypeLabel !== selectedType) return false;
    if (selectedKind !== 'ambos') {
      const kind = r.publication.is_canon ? 'canon' : 'legends';
      if (kind !== selectedKind) return false;
    }
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
              Error al cargar las reseñas.
            </div>
          )}
          {!loading && !error && filtered.map((review) => {
            const pub = review.publication!;
            const kind: 'canon' | 'legends' = pub.is_canon ? 'canon' : 'legends';
            const tone = deriveTone(pub.id);
            const pubTypeLabel = PUB_TYPE_LABEL[pub.pub_type] ?? pub.pub_type;
            const dateStr = review.date ? formatDate(review.date) : '';

            return (
              <div
                key={review.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '100px 1fr 180px',
                  gap: 24,
                  alignItems: 'start',
                  padding: '24px',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: 8,
                  marginBottom: 16,
                  cursor: 'pointer',
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(201,168,76,0.15)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.05)';
                }}
              >
                {/* Book cover */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <BookCover title={pub.title} author={pub.author} tone={tone} kind={kind} w={88} ratio={1.5} />
                </div>
                {/* Meta + excerpt */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <Flag kind={kind} size="sm" />
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
                    {pub.title}
                  </h3>
                  <div
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 14,
                      color: '#5C5A52',
                      marginBottom: 12,
                    }}
                  >
                    {pub.author} · {pubTypeLabel}
                  </div>
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 14,
                      color: '#9C9788',
                      lineHeight: 1.65,
                    }}
                  >
                    {review.excerpt || review.text}
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
                    {dateStr}
                  </div>
                </div>
              </div>
            );
          })}
          {!loading && !error && filtered.length === 0 && (
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
