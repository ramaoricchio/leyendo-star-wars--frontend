import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNav from '../../components/Layout/TopNav';
import Footer from '../../components/Layout/Footer';
import BookCover from '../../components/BookCover/BookCover';
import Flag from '../../components/Flag/Flag';
import { ToneKey } from '../../types/publication';
import { useAuth } from '../../context/AuthContext';
import { getMyProfile, UserProfile as ProfileData } from '../../api/readingStatus';
import { getPublications } from '../../api/publications';

const deriveTone = (id: number): ToneKey => String.fromCharCode(65 + (id % 8)) as ToneKey;

const BADGE_ICONS: Record<string, string> = {
  primer_paso:        '○',
  padawan:            '◈',
  caballero:          '◆',
  maestro:            '✦',
  guardian:           '✧',
  novelista:          '◻',
  cazador_comics:     '◼',
  bibliofilo:         '◉',
  completador:        '▣',
  archivista:         '▤',
  maestro_archivo:    '▦',
  defensor_canon:     '▷',
  explorador_legends: '◁',
  cronista:           '◍',
  equilibrio:         '◎',
  primer_wishlist:    '♡',
  gran_plan:          '♥',
  prometedor:         '★',
};

function getLevelName(leido: number): string {
  if (leido >= 100) return 'Guardián de la Historia';
  if (leido >= 50)  return 'Maestro de las Crónicas';
  if (leido >= 25)  return 'Caballero del Conocimiento';
  if (leido >= 10)  return 'Padawan Lector';
  if (leido >= 1)   return 'Primer Paso';
  return 'Iniciado';
}

function formatMemberSince(createdAt?: string): string {
  if (!createdAt) return '';
  return new Date(createdAt).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
}

// Visual-only activity grid
const ActivityGrid: React.FC = () => {
  const weeks = 26;
  const days = 7;
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, paddingTop: 18 }}>
          {dayLabels.map((d, i) => (
            <div key={i} style={{ height: 11, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#5C5A52', display: 'flex', alignItems: 'center' }}>
              {i % 2 === 0 ? d : ''}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 3 }}>
          {Array.from({ length: weeks }).map((_, w) => (
            <div key={w} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {Array.from({ length: days }).map((_, d) => {
                const level = getActivity(w, d);
                return (
                  <div key={d} title={`Semana ${w + 1}, ${dayLabels[d]}`} style={{ width: 11, height: 11, background: colors[level], borderRadius: 2 }} />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8, justifyContent: 'flex-end' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#5C5A52' }}>Menos</span>
        {colors.map((c, i) => <div key={i} style={{ width: 11, height: 11, background: c, borderRadius: 2 }} />)}
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#5C5A52' }}>Más</span>
      </div>
    </div>
  );
};

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [totalCatalog, setTotalCatalog] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    Promise.all([
      getMyProfile(),
      getPublications({ per_page: 1 }),
    ])
      .then(([prof, pubs]) => {
        setProfile(prof);
        setTotalCatalog(pubs.total ?? 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  const stats   = profile?.stats    ?? { leido: 0, leyendo: 0, wishlist: 0 };
  const badges  = profile?.badges   ?? [];
  const inProgress = profile?.in_progress ?? [];
  const wishlist   = profile?.wishlist    ?? [];

  const read   = stats.leido;
  const total  = totalCatalog || 1;
  const percent = totalCatalog > 0 ? Math.round((read / total) * 100) : 0;
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (percent / 100) * circumference;

  const level       = getLevelName(stats.leido);
  const memberSince = formatMemberSince(user?.created_at);

  const statsStrip = [
    { label: 'Leídos',    value: stats.leido },
    { label: 'Leyendo',   value: stats.leyendo },
    { label: 'Wishlist',  value: stats.wishlist },
  ];

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0A0F', display: 'flex', flexDirection: 'column' }}>
        <TopNav />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: '#5C5A52', letterSpacing: '0.06em' }}>
          Cargando…
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', display: 'flex', flexDirection: 'column' }}>
      <TopNav />

      {/* Profile header */}
      <div style={{ background: '#06060A', borderBottom: '1px solid rgba(201,168,76,0.12)', padding: '40px 56px' }}>
        <div style={{ maxWidth: 1328, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 40 }}>

          {/* Progress ring */}
          <div style={{ position: 'relative', width: 128, height: 128, flexShrink: 0 }}>
            <svg width={128} height={128} viewBox="0 0 128 128">
              <circle cx={64} cy={64} r={54} fill="none" stroke="#1C1C26" strokeWidth={8} />
              <circle cx={64} cy={64} r={54} fill="none" stroke="#C9A84C" strokeWidth={8}
                strokeDasharray={`${circumference}`} strokeDashoffset={`${offset}`}
                strokeLinecap="round" transform="rotate(-90 64 64)" />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 28, color: '#C9A84C', lineHeight: 1 }}>
                {percent}%
              </div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#5C5A52', marginTop: 2 }}>leído</div>
            </div>
          </div>

          {/* User info */}
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#C9A84C', letterSpacing: '0.1em', marginBottom: 8 }}>
              // perfil de lector
            </div>
            <h1 style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 40, textTransform: 'uppercase', color: '#F2EEDF', letterSpacing: '0.02em', lineHeight: 1, marginBottom: 8 }}>
              {user?.username ?? '—'}
            </h1>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#5C5A52' }}>
              {memberSince ? `Miembro desde ${memberSince} · ` : ''}Nivel: {level}
            </div>
          </div>

          {/* Stats strip */}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 32 }}>
            {statsStrip.map((s) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 32, color: '#C9A84C', lineHeight: 1 }}>
                  {s.value}
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#5C5A52', marginTop: 4 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: '48px 56px', maxWidth: 1440, margin: '0 auto', width: '100%' }}>

        {/* In progress + Wishlist preview */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginBottom: 48 }}>

          {/* In progress */}
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#C9A84C', letterSpacing: '0.08em', marginBottom: 8 }}>
              // en curso
            </div>
            <h2 style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 24, textTransform: 'uppercase', color: '#F2EEDF', marginBottom: 20, letterSpacing: '0.04em' }}>
              Estás leyendo
            </h2>
            {inProgress.length === 0 ? (
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#5C5A52', padding: '32px 0' }}>
                Marcá un libro como "Leyendo" para verlo aquí.
              </div>
            ) : (
              inProgress.map((pub) => (
                <div
                  key={pub.id}
                  onClick={() => navigate(`/publicaciones/${pub.id}`)}
                  style={{ display: 'flex', gap: 16, alignItems: 'center', background: '#14141C', border: '1px solid rgba(201,168,76,0.1)', borderRadius: 8, padding: 16, marginBottom: 12, cursor: 'pointer' }}
                >
                  <BookCover title={pub.title} author={pub.author} tone={deriveTone(pub.id)} kind={pub.is_canon ? 'canon' : 'legends'} w={52} ratio={1.5} badge={false} imageUrl={pub.cover_urls?.[0]} />
                  <div style={{ flex: 1 }}>
                    <div style={{ marginBottom: 6 }}>
                      <Flag kind={pub.is_canon ? 'canon' : 'legends'} size="sm" />
                    </div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 14, color: '#F2EEDF', marginBottom: 4 }}>
                      {pub.title}
                    </div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#5C5A52' }}>
                      {pub.author}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Wishlist preview */}
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#C9A84C', letterSpacing: '0.08em', marginBottom: 8 }}>
              // próximos a leer
            </div>
            <h2 style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 24, textTransform: 'uppercase', color: '#F2EEDF', marginBottom: 20, letterSpacing: '0.04em' }}>
              Lista de deseos
            </h2>
            {wishlist.length === 0 ? (
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#5C5A52', padding: '32px 0' }}>
                Agregá libros a tu lista de deseos desde cualquier publicación.
              </div>
            ) : (
              <>
                {wishlist.slice(0, 6).map((pub, i) => (
                  <div
                    key={pub.id}
                    onClick={() => navigate(`/publicaciones/${pub.id}`)}
                    style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}
                  >
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#5C5A52', width: 20, textAlign: 'right' }}>{i + 1}.</span>
                    <BookCover title={pub.title} tone={deriveTone(pub.id)} kind={pub.is_canon ? 'canon' : 'legends'} w={40} ratio={1.5} badge={false} imageUrl={pub.cover_urls?.[0]} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 13, color: '#F2EEDF', marginBottom: 2 }}>{pub.title}</div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#5C5A52' }}>{pub.author}</div>
                    </div>
                    <Flag kind={pub.is_canon ? 'canon' : 'legends'} size="sm" />
                  </div>
                ))}
                {wishlist.length > 6 && (
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#5C5A52', paddingTop: 12 }}>
                    +{wishlist.length - 6} más en la wishlist completa
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Badges */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#C9A84C', letterSpacing: '0.08em', marginBottom: 8 }}>
            // logros desbloqueados
          </div>
          <h2 style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 24, textTransform: 'uppercase', color: '#F2EEDF', marginBottom: 20, letterSpacing: '0.04em' }}>
            Insignias
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16 }}>
            {badges.map((badge) => (
              <div
                key={badge.slug}
                style={{
                  background: badge.earned ? 'rgba(201,168,76,0.06)' : '#14141C',
                  border: `1px solid ${badge.earned ? 'rgba(201,168,76,0.3)' : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: 10,
                  padding: '20px 16px',
                  textAlign: 'center',
                  opacity: badge.earned ? 1 : 0.4,
                }}
              >
                <div style={{ fontSize: 22, marginBottom: 10, color: badge.earned ? '#C9A84C' : '#5C5A52', fontFamily: "'JetBrains Mono', monospace" }}>
                  {BADGE_ICONS[badge.slug] ?? '○'}
                </div>
                <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 500, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em', color: badge.earned ? '#C9A84C' : '#9C9788', marginBottom: 6 }}>
                  {badge.name}
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#5C5A52', lineHeight: 1.3 }}>
                  {badge.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity grid */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#C9A84C', letterSpacing: '0.08em', marginBottom: 8 }}>
            // actividad de lectura
          </div>
          <h2 style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 24, textTransform: 'uppercase', color: '#F2EEDF', marginBottom: 20, letterSpacing: '0.04em' }}>
            Heatmap de actividad
          </h2>
          <div style={{ background: '#14141C', border: '1px solid rgba(201,168,76,0.1)', borderRadius: 10, padding: 24 }}>
            <ActivityGrid />
          </div>
        </div>

        {/* Full wishlist */}
        {wishlist.length > 0 && (
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#C9A84C', letterSpacing: '0.08em', marginBottom: 8 }}>
              // wishlist completa
            </div>
            <h2 style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 24, textTransform: 'uppercase', color: '#F2EEDF', marginBottom: 20, letterSpacing: '0.04em' }}>
              Wishlist
            </h2>
            {wishlist.map((pub, i) => (
              <div
                key={pub.id}
                onClick={() => navigate(`/publicaciones/${pub.id}`)}
                style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}
              >
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: '#5C5A52', width: 20, textAlign: 'right' }}>{i + 1}.</span>
                <BookCover title={pub.title} author={pub.author} tone={deriveTone(pub.id)} kind={pub.is_canon ? 'canon' : 'legends'} w={44} ratio={1.5} badge={false} imageUrl={pub.cover_urls?.[0]} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 15, color: '#F2EEDF', marginBottom: 4 }}>{pub.title}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#5C5A52' }}>{pub.author}</div>
                </div>
                <Flag kind={pub.is_canon ? 'canon' : 'legends'} size="sm" />
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(`/publicaciones/${pub.id}`); }}
                  style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, color: '#9C9788', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, padding: '4px 12px', cursor: 'pointer', letterSpacing: '0.06em' }}
                >
                  ver
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default UserProfile;
