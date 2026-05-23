import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopNav from '../../components/Layout/TopNav';
import Footer from '../../components/Layout/Footer';
import BookCover from '../../components/BookCover/BookCover';
import Stars from '../../components/Stars/Stars';
import Flag from '../../components/Flag/Flag';
import { ToneKey } from '../../types/publication';

// ActivityGrid local component
const ActivityGrid: React.FC = () => {
  const weeks = 26;
  const days = 7;

  // Deterministic fake activity data
  const getActivity = (week: number, day: number): number => {
    const seed = week * 7 + day;
    const val = (seed * 2654435761) % 4294967296;
    const norm = val / 4294967296;
    if (norm < 0.5) return 0;
    if (norm < 0.7) return 1;
    if (norm < 0.85) return 2;
    if (norm < 0.95) return 3;
    return 4;
  };

  const colors = ['#1C1C26', '#3d2e0c', '#6e5118', '#a87828', '#C9A84C'];
  const dayLabels = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  return (
    <div>
      <div style={{ display: 'flex', gap: 4 }}>
        {/* Day labels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, paddingTop: 18 }}>
          {dayLabels.map((d, i) => (
            <div
              key={i}
              style={{
                height: 11,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 9,
                color: '#5C5A52',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {i % 2 === 0 ? d : ''}
            </div>
          ))}
        </div>
        {/* Grid */}
        <div style={{ display: 'flex', gap: 3 }}>
          {Array.from({ length: weeks }).map((_, w) => (
            <div key={w} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {Array.from({ length: days }).map((_, d) => {
                const level = getActivity(w, d);
                return (
                  <div
                    key={d}
                    title={`Semana ${w + 1}, ${dayLabels[d]}: ${level} actividad`}
                    style={{
                      width: 11,
                      height: 11,
                      background: colors[level],
                      borderRadius: 2,
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      {/* Legend */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          marginTop: 8,
          justifyContent: 'flex-end',
        }}
      >
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#5C5A52' }}>Menos</span>
        {colors.map((c, i) => (
          <div key={i} style={{ width: 11, height: 11, background: c, borderRadius: 2 }} />
        ))}
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#5C5A52' }}>Más</span>
      </div>
    </div>
  );
};

const STATS = [
  { label: 'Leídos', value: 142 },
  { label: 'Reseñas', value: 38 },
  { label: 'En progreso', value: 3 },
  { label: 'Wishlist', value: 24 },
  { label: 'Racha', value: '12 días' },
];

const IN_PROGRESS: { title: string; author: string; tone: ToneKey; kind: 'canon' | 'legends'; progress: number; currentPage: number; totalPages: number }[] = [
  { title: 'Luz de los Jedi', author: 'Charles Soule', tone: 'E', kind: 'canon', progress: 67, currentPage: 300, totalPages: 448 },
  { title: 'Thrawn: Alianzas', author: 'Timothy Zahn', tone: 'C', kind: 'canon', progress: 34, currentPage: 152, totalPages: 448 },
  { title: 'Darth Plagueis', author: 'James Luceno', tone: 'D', kind: 'legends', progress: 12, currentPage: 52, totalPages: 432 },
];

const COLLECTION_PROGRESS: { name: string; kind: 'canon' | 'legends'; completed: number; total: number; color: string }[] = [
  { name: 'Trilogía de Thrawn', kind: 'legends', completed: 3, total: 3, color: '#5B7FC5' },
  { name: 'La Alta República', kind: 'canon', completed: 5, total: 12, color: '#E3C865' },
  { name: 'Aftermath', kind: 'canon', completed: 2, total: 3, color: '#6BC58A' },
  { name: 'Darth Bane', kind: 'legends', completed: 1, total: 3, color: '#C56B5B' },
  { name: 'X-Wing', kind: 'legends', completed: 4, total: 10, color: '#7B5BC5' },
  { name: 'Thrawn (Canon)', kind: 'canon', completed: 3, total: 4, color: '#5BA3C5' },
];

const BADGES: { name: string; desc: string; earned: boolean; icon: string }[] = [
  { name: 'Padawan', desc: 'Leer 10 libros', earned: true, icon: '⚡' },
  { name: 'Caballero Jedi', desc: 'Leer 50 libros', earned: true, icon: '⚔️' },
  { name: 'Maestro Jedi', desc: 'Leer 100 libros', earned: true, icon: '🌟' },
  { name: 'Gran Maestro', desc: 'Leer 200 libros', earned: false, icon: '👑' },
  { name: 'Holocronista', desc: 'Escribir 50 reseñas', earned: false, icon: '📖' },
  { name: 'Lord Sith', desc: 'Leer 50 Leyendas', earned: true, icon: '🔴' },
];

const WISHLIST = [
  { title: 'Kenobi', author: 'John Jackson Miller', tone: 'B' as ToneKey, kind: 'legends' as const },
  { title: 'Caballeros de la Antigua República', author: 'John Jackson Miller', tone: 'C' as ToneKey, kind: 'legends' as const },
  { title: 'Maestro y Aprendiz', author: 'Claudia Gray', tone: 'H' as ToneKey, kind: 'canon' as const },
  { title: 'Leia: Princesa de Alderaan', author: 'Claudia Gray', tone: 'E' as ToneKey, kind: 'canon' as const },
];

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const read = 142;
  const total = 437;
  const percent = Math.round((read / total) * 100);
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', display: 'flex', flexDirection: 'column' }}>
      <TopNav />

      {/* Profile header */}
      <div
        style={{
          background: '#06060A',
          borderBottom: '1px solid rgba(201,168,76,0.12)',
          padding: '40px 56px',
        }}
      >
        <div
          style={{
            maxWidth: 1328,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            gap: 40,
          }}
        >
          {/* Ring progress */}
          <div style={{ position: 'relative', width: 128, height: 128, flexShrink: 0 }}>
            <svg width={128} height={128} viewBox="0 0 128 128">
              <circle cx={64} cy={64} r={54} fill="none" stroke="#1C1C26" strokeWidth={8} />
              <circle
                cx={64}
                cy={64}
                r={54}
                fill="none"
                stroke="#C9A84C"
                strokeWidth={8}
                strokeDasharray={`${circumference}`}
                strokeDashoffset={`${offset}`}
                strokeLinecap="round"
                transform="rotate(-90 64 64)"
              />
            </svg>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 28, color: '#C9A84C', lineHeight: 1 }}>
                {percent}%
              </div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#5C5A52', marginTop: 2 }}>leído</div>
            </div>
          </div>

          {/* User info */}
          <div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                color: '#C9A84C',
                letterSpacing: '0.1em',
                marginBottom: 8,
              }}
            >
              // perfil de lector
            </div>
            <h1
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontWeight: 600,
                fontSize: 40,
                textTransform: 'uppercase',
                color: '#F2EEDF',
                letterSpacing: '0.02em',
                lineHeight: 1,
                marginBottom: 8,
              }}
            >
              Lector Galáctico
            </h1>
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                color: '#5C5A52',
              }}
            >
              Miembro desde enero 2024 · Nivel: Maestro Jedi
            </div>
          </div>

          {/* Stats strip */}
          <div
            style={{
              marginLeft: 'auto',
              display: 'flex',
              gap: 32,
            }}
          >
            {STATS.map((s) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontWeight: 600,
                    fontSize: 32,
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
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: '48px 56px', maxWidth: 1440, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginBottom: 48 }}>

          {/* In progress */}
          <div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                color: '#C9A84C',
                letterSpacing: '0.08em',
                marginBottom: 8,
              }}
            >
              // en curso
            </div>
            <h2
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontWeight: 600,
                fontSize: 24,
                textTransform: 'uppercase',
                color: '#F2EEDF',
                marginBottom: 20,
                letterSpacing: '0.04em',
              }}
            >
              Estás leyendo
            </h2>
            {IN_PROGRESS.map((book, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: 16,
                  alignItems: 'center',
                  background: '#14141C',
                  border: '1px solid rgba(201,168,76,0.1)',
                  borderRadius: 8,
                  padding: '16px',
                  marginBottom: 12,
                  cursor: 'pointer',
                }}
              >
                <BookCover title={book.title} author={book.author} tone={book.tone} kind={book.kind} w={52} ratio={1.5} badge={false} />
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: 6 }}>
                    <Flag kind={book.kind} size="sm" />
                  </div>
                  <div
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 500,
                      fontSize: 14,
                      color: '#F2EEDF',
                      marginBottom: 4,
                    }}
                  >
                    {book.title}
                  </div>
                  <div
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 12,
                      color: '#5C5A52',
                      marginBottom: 10,
                    }}
                  >
                    Pág. {book.currentPage} de {book.totalPages}
                  </div>
                  {/* Progress bar */}
                  <div style={{ background: '#252532', borderRadius: 4, height: 4, overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${book.progress}%`,
                        background: 'linear-gradient(90deg, #C9A84C, #E0BC5C)',
                        borderRadius: 4,
                        transition: 'width 0.3s',
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 10,
                      color: '#C9A84C',
                      marginTop: 4,
                    }}
                  >
                    {book.progress}%
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Collection progress */}
          <div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                color: '#C9A84C',
                letterSpacing: '0.08em',
                marginBottom: 8,
              }}
            >
              // progreso por serie
            </div>
            <h2
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontWeight: 600,
                fontSize: 24,
                textTransform: 'uppercase',
                color: '#F2EEDF',
                marginBottom: 20,
                letterSpacing: '0.04em',
              }}
            >
              Colecciones
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {COLLECTION_PROGRESS.map((col, i) => {
                const pct = Math.round((col.completed / col.total) * 100);
                return (
                  <div
                    key={i}
                    style={{
                      background: '#14141C',
                      border: '1px solid rgba(201,168,76,0.1)',
                      borderRadius: 8,
                      padding: '16px',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ marginBottom: 8 }}>
                      <Flag kind={col.kind} size="sm" />
                    </div>
                    <div
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 500,
                        fontSize: 13,
                        color: '#F2EEDF',
                        lineHeight: 1.2,
                        marginBottom: 12,
                      }}
                    >
                      {col.name}
                    </div>
                    <div style={{ background: '#252532', borderRadius: 4, height: 4, overflow: 'hidden', marginBottom: 6 }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${pct}%`,
                          background: col.color,
                          borderRadius: 4,
                        }}
                      />
                    </div>
                    <div
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 10,
                        color: '#5C5A52',
                      }}
                    >
                      {col.completed}/{col.total} · {pct}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Badges */}
        <div style={{ marginBottom: 48 }}>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              color: '#C9A84C',
              letterSpacing: '0.08em',
              marginBottom: 8,
            }}
          >
            // logros desbloqueados
          </div>
          <h2
            style={{
              fontFamily: "'Oswald', sans-serif",
              fontWeight: 600,
              fontSize: 24,
              textTransform: 'uppercase',
              color: '#F2EEDF',
              marginBottom: 20,
              letterSpacing: '0.04em',
            }}
          >
            Insignias
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16 }}>
            {BADGES.map((badge, i) => (
              <div
                key={i}
                style={{
                  background: badge.earned ? 'rgba(201,168,76,0.06)' : '#14141C',
                  border: `1px solid ${badge.earned ? 'rgba(201,168,76,0.3)' : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: 10,
                  padding: '20px 16px',
                  textAlign: 'center',
                  opacity: badge.earned ? 1 : 0.4,
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 10 }}>{badge.icon}</div>
                <div
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontWeight: 500,
                    fontSize: 14,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: badge.earned ? '#C9A84C' : '#9C9788',
                    marginBottom: 6,
                  }}
                >
                  {badge.name}
                </div>
                <div
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 11,
                    color: '#5C5A52',
                    lineHeight: 1.3,
                  }}
                >
                  {badge.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity grid */}
        <div style={{ marginBottom: 48 }}>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              color: '#C9A84C',
              letterSpacing: '0.08em',
              marginBottom: 8,
            }}
          >
            // actividad de lectura
          </div>
          <h2
            style={{
              fontFamily: "'Oswald', sans-serif",
              fontWeight: 600,
              fontSize: 24,
              textTransform: 'uppercase',
              color: '#F2EEDF',
              marginBottom: 20,
              letterSpacing: '0.04em',
            }}
          >
            Heatmap de actividad
          </h2>
          <div
            style={{
              background: '#14141C',
              border: '1px solid rgba(201,168,76,0.1)',
              borderRadius: 10,
              padding: 24,
            }}
          >
            <ActivityGrid />
          </div>
        </div>

        {/* Wishlist */}
        <div>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              color: '#C9A84C',
              letterSpacing: '0.08em',
              marginBottom: 8,
            }}
          >
            // próximos a leer
          </div>
          <h2
            style={{
              fontFamily: "'Oswald', sans-serif",
              fontWeight: 600,
              fontSize: 24,
              textTransform: 'uppercase',
              color: '#F2EEDF',
              marginBottom: 20,
              letterSpacing: '0.04em',
            }}
          >
            Wishlist
          </h2>
          {WISHLIST.map((book, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                padding: '16px 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                cursor: 'pointer',
              }}
            >
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 13,
                  color: '#5C5A52',
                  width: 20,
                  textAlign: 'right',
                }}
              >
                {i + 1}.
              </span>
              <BookCover title={book.title} author={book.author} tone={book.tone} kind={book.kind} w={44} ratio={1.5} badge={false} />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 500,
                    fontSize: 15,
                    color: '#F2EEDF',
                    marginBottom: 4,
                  }}
                >
                  {book.title}
                </div>
                <div
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    color: '#5C5A52',
                  }}
                >
                  {book.author}
                </div>
              </div>
              <Flag kind={book.kind} size="sm" />
              <button
                style={{
                  background: 'none',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 4,
                  color: '#9C9788',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  padding: '4px 12px',
                  cursor: 'pointer',
                  letterSpacing: '0.06em',
                }}
              >
                ver
              </button>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UserProfile;
