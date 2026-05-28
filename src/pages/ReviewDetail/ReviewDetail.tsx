import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopNav from '../../components/Layout/TopNav';
import Footer from '../../components/Layout/Footer';
import BookCover from '../../components/BookCover/BookCover';
import Flag from '../../components/Flag/Flag';
import Stars from '../../components/Stars/Stars';
import { ToneKey } from '../../types/publication';
import useApi from '../../hooks/useApi';
import { getReview } from '../../api/reviews';

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

const extractYoutubeId = (url: string): string | null => {
  const match = url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return match ? match[1] : null;
};

const ReviewDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: review, loading, error } = useApi(() => getReview(Number(id)));

  const pub = review?.publication;
  const kind: 'canon' | 'legends' = pub?.is_canon ? 'canon' : 'legends';
  const tone = pub ? deriveTone(pub.id) : 'A';
  const pubTypeLabel = pub ? (PUB_TYPE_LABEL[pub.pub_type] ?? pub.pub_type) : '';
  const dateStr = review?.date ? formatDate(review.date) : '';
  const youtubeId = review?.youtube_url ? extractYoutubeId(review.youtube_url) : null;

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', display: 'flex', flexDirection: 'column' }}>
      <TopNav active="Reseñas" />

      {loading && (
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
      )}

      {error && (
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            color: '#C25555',
          }}
        >
          No se encontró la reseña.
        </div>
      )}

      {!loading && !error && review && pub && (
        <div style={{ flex: 1 }}>
          {/* Breadcrumb */}
          <div style={{ padding: '24px 56px 0' }}>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                color: '#5C5A52',
                letterSpacing: '0.06em',
                display: 'flex',
                gap: 8,
                alignItems: 'center',
              }}
            >
              <span
                onClick={() => navigate('/')}
                style={{ cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#9C9788')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#5C5A52')}
              >
                inicio
              </span>
              <span>›</span>
              <span
                onClick={() => navigate('/resenas')}
                style={{ cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#9C9788')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#5C5A52')}
              >
                reseñas
              </span>
              <span>›</span>
              <span style={{ color: '#9C9788' }}>{pub.title.toLowerCase()}</span>
            </div>
          </div>

          {/* Main grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '300px 1fr',
              gap: 48,
              padding: '32px 56px 48px',
              maxWidth: 1200,
            }}
          >
            {/* Left column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <BookCover title={pub.title} author={pub.author} tone={tone} kind={kind} w={200} ratio={1.5} />

              {/* Score */}
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontWeight: 600,
                    fontSize: 64,
                    color: '#C9A84C',
                    lineHeight: 1,
                    marginBottom: 8,
                  }}
                >
                  {review.score}
                </div>
                <Stars value={review.score} size={18} />
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

            {/* Right column */}
            <div>
              <div style={{ marginBottom: 12 }}>
                <Flag kind={kind} size="sm" />
              </div>

              <h1
                style={{
                  fontFamily: "'Oswald', sans-serif",
                  fontWeight: 600,
                  fontSize: 48,
                  textTransform: 'uppercase',
                  color: '#F2EEDF',
                  letterSpacing: '-0.01em',
                  lineHeight: 1,
                  marginBottom: 10,
                }}
              >
                {pub.title}
              </h1>

              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 15,
                  color: '#5C5A52',
                  marginBottom: 24,
                }}
              >
                {pub.author} · {pubTypeLabel}
              </div>

              {/* Link to publication */}
              <button
                onClick={() => navigate(`/publicaciones/${pub.id}`)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'none',
                  border: '1px solid rgba(201,168,76,0.25)',
                  borderRadius: 4,
                  color: '#C9A84C',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  padding: '6px 14px',
                  cursor: 'pointer',
                  marginBottom: 32,
                  transition: 'border-color 0.2s, background 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,168,76,0.5)';
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(201,168,76,0.06)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,168,76,0.25)';
                  (e.currentTarget as HTMLButtonElement).style.background = 'none';
                }}
              >
                Ver publicación →
              </button>

              {/* Divider */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginBottom: 28 }} />

              {/* YouTube embed */}
              {youtubeId && (
                <div style={{ marginBottom: 32 }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}`}
                    title="Review video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{
                      display: 'block',
                      width: '100%',
                      aspectRatio: '16 / 9',
                      border: 'none',
                      borderRadius: 8,
                    }}
                  />
                </div>
              )}

              {/* Review text */}
              <div
                className="review-content"
                dangerouslySetInnerHTML={{ __html: review.text }}
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ReviewDetail;
