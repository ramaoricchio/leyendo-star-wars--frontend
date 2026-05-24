import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNav from '../../components/Layout/TopNav';
import Footer from '../../components/Layout/Footer';
import Starfield from '../../components/Starfield/Starfield';
import BookCover from '../../components/BookCover/BookCover';
import { ToneKey, Publication } from '../../types/publication';
import { getPublications } from '../../api/publications';

type CanonFilter = 'canon' | 'legends' | 'ambos';

interface Era {
  id: string;
  name: string;
  range: string;
  color: string;
  description: string;
  apiEra: string;
}

const ERAS: Era[] = [
  {
    id: 'dawn',
    name: 'Amanecer Jedi',
    range: 'c. 25.000 – 5.000 BBY',
    color: '#7B5BC5',
    description: 'Los albores de la Orden Jedi y los primeros enfrentamientos con el lado oscuro. Una era de descubrimiento y formación de la galaxia.',
    apiEra: 'Amanecer Jedi',
  },
  {
    id: 'oldrep',
    name: 'Antigua República',
    range: '5.000 – 1.000 BBY',
    color: '#5BA3C5',
    description: 'La época dorada de la Antigua República, marcada por guerras devastadoras contra los Sith y el surgimiento de grandes leyendas.',
    apiEra: 'Antigua República',
  },
  {
    id: 'high',
    name: 'Alta República',
    range: '500 – 100 BBY',
    color: '#E3C865',
    description: 'La era más luminosa de los Jedi, cuando la República expandía sus fronteras y los guardianes de la paz brillaban en toda su gloria.',
    apiEra: 'Alta República',
  },
  {
    id: 'fall',
    name: 'Caída de los Jedi',
    range: '100 – 19 BBY',
    color: '#6BC58A',
    description: 'La preuela a las películas. Intrigas políticas, el ascenso de Palpatine y el comienzo del fin para la Orden Jedi.',
    apiEra: 'Caída de los Jedi',
  },
  {
    id: 'reign',
    name: 'Reinado del Imperio',
    range: '19 BBY – 4 ABY',
    color: '#C56B5B',
    description: 'La era oscura del Imperio Galáctico. Los Jedi sobrevivientes, la Rebelión naciente y los héroes que desafiaron la tiranía.',
    apiEra: 'Reinado del Imperio',
  },
  {
    id: 'civil',
    name: 'Era de la Rebelión',
    range: '4 – 5 ABY',
    color: '#C9A84C',
    description: 'La guerra civil galáctica alcanza su clímax. Aldeeran, la Estrella de la Muerte, Hoth, Endor. Los momentos más icónicos de la saga.',
    apiEra: 'Era de la Rebelión',
  },
  {
    id: 'newrep',
    name: 'Nueva República',
    range: '5 – 34 ABY',
    color: '#5B7FC5',
    description: 'La galaxia reconstruye tras la caída del Imperio. Nuevas amenazas emergen mientras la República Galáctica intenta florecer.',
    apiEra: 'Nueva República',
  },
  {
    id: 'risefo',
    name: 'Ascenso de la Primera Orden',
    range: '34 – 35 ABY',
    color: '#B45BC5',
    description: 'Los últimos Jedi, la resistencia final y el despertar de una nueva generación de héroes frente a la Primera Orden.',
    apiEra: 'Ascenso de la Primera Orden',
  },
];

const deriveTone = (id: number): ToneKey =>
  String.fromCharCode(65 + (id % 8)) as ToneKey;

const Timeline: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<CanonFilter>('ambos');
  const [activeEra, setActiveEra] = useState<string>('high');
  const [books, setBooks] = useState<Publication[]>([]);
  const [eraTotal, setEraTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [eraCounts, setEraCounts] = useState<Record<string, number>>({});

  const currentEra = ERAS.find((e) => e.id === activeEra) || ERAS[0];

  useEffect(() => {
    Promise.all(
      ERAS.map((era) =>
        getPublications({ era: era.apiEra, per_page: 1 })
          .then((r) => ({ id: era.id, total: r.total }))
          .catch(() => ({ id: era.id, total: 0 }))
      )
    ).then((results) => {
      const counts: Record<string, number> = {};
      results.forEach((r) => { counts[r.id] = r.total; });
      setEraCounts(counts);
    });
  }, []);

  useEffect(() => {
    const era = ERAS.find((e) => e.id === activeEra);
    if (!era) return;

    let cancelled = false;
    setBooks([]);
    setEraTotal(0);
    setLoading(true);

    getPublications({ era: era.apiEra, per_page: 50 })
      .then((result) => {
        if (cancelled) return;
        setBooks(result.items);
        setEraTotal(result.total);
      })
      .catch(() => {
        if (!cancelled) {
          setBooks([]);
          setEraTotal(0);
        }
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [activeEra]);

  const filteredBooks = books.filter((b) => {
    if (filter === 'ambos') return true;
    return filter === 'canon' ? b.is_canon : !b.is_canon;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', display: 'flex', flexDirection: 'column' }}>
      <TopNav active="Timeline" />

      {/* Header */}
      <div
        style={{
          position: 'relative',
          padding: '56px 56px 40px',
          borderBottom: '1px solid rgba(201,168,76,0.12)',
          overflow: 'hidden',
        }}
      >
        <Starfield density={0.4} opacity={0.5} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              color: '#C9A84C',
              letterSpacing: '0.1em',
              marginBottom: 12,
            }}
          >
            // orden cronológico in-universe
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
              marginBottom: 24,
            }}
          >
            Timeline
          </h1>
          {/* Canon filter pills */}
          <div style={{ display: 'flex', gap: 8 }}>
            {(['ambos', 'canon', 'legends'] as CanonFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  background: filter === f ? '#C9A84C' : 'rgba(201,168,76,0.08)',
                  border: `1px solid ${filter === f ? '#C9A84C' : 'rgba(201,168,76,0.2)'}`,
                  borderRadius: 20,
                  color: filter === f ? '#0A0A0F' : '#9C9788',
                  fontFamily: "'Oswald', sans-serif",
                  fontWeight: 500,
                  fontSize: 13,
                  padding: '6px 18px',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                {f === 'ambos' ? 'Ambos' : f === 'canon' ? 'Canon' : 'Leyendas'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content: rail + panel */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '420px 1fr',
          flex: 1,
        }}
      >
        {/* Rail */}
        <div
          style={{
            borderRight: '1px solid rgba(201,168,76,0.12)',
            padding: '40px 0',
            position: 'relative',
            overflowY: 'auto',
          }}
        >
          {/* Vertical line */}
          <div
            style={{
              position: 'absolute',
              left: 56,
              top: 0,
              bottom: 0,
              width: 1,
              background: 'linear-gradient(180deg, transparent, rgba(201,168,76,0.3) 10%, rgba(201,168,76,0.3) 90%, transparent)',
            }}
          />
          {ERAS.map((era) => {
            const isActive = era.id === activeEra;
            return (
              <div
                key={era.id}
                onClick={() => setActiveEra(era.id)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 20,
                  padding: '0 40px 0 80px',
                  marginBottom: 8,
                  cursor: 'pointer',
                }}
              >
                {/* Diamond node */}
                <div
                  style={{
                    position: 'absolute',
                    left: 50,
                    width: 13,
                    height: 13,
                    background: isActive ? era.color : '#252532',
                    border: `2px solid ${era.color}`,
                    transform: 'rotate(45deg)',
                    transition: 'background 0.2s',
                    flexShrink: 0,
                    marginTop: 16,
                  }}
                />
                {/* Branch line */}
                <div
                  style={{
                    position: 'absolute',
                    left: 56,
                    width: 24,
                    height: 1,
                    background: isActive ? era.color : 'rgba(201,168,76,0.2)',
                    marginTop: 22,
                    transition: 'background 0.2s',
                  }}
                />
                {/* Card */}
                <div
                  style={{
                    flex: 1,
                    background: isActive ? 'rgba(201,168,76,0.06)' : 'transparent',
                    border: `1px solid ${isActive ? era.color + '40' : 'transparent'}`,
                    borderRadius: 8,
                    padding: '14px 16px',
                    transition: 'all 0.2s',
                    borderLeft: isActive ? `3px solid ${era.color}` : '3px solid transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLDivElement).style.background = 'rgba(201,168,76,0.03)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                    }
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 10,
                      color: era.color,
                      letterSpacing: '0.08em',
                      marginBottom: 4,
                    }}
                  >
                    {era.range}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Oswald', sans-serif",
                      fontWeight: 500,
                      fontSize: 16,
                      textTransform: 'uppercase',
                      color: isActive ? '#F2EEDF' : '#9C9788',
                      letterSpacing: '0.04em',
                      transition: 'color 0.2s',
                    }}
                  >
                    {era.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 12,
                      color: '#5C5A52',
                      marginTop: 4,
                    }}
                  >
                    {eraCounts[era.id] ?? '—'} títulos
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Panel */}
        <div style={{ padding: '48px 56px', overflowY: 'auto' }}>
          <div
            style={{
              borderLeft: `4px solid ${currentEra.color}`,
              paddingLeft: 24,
              marginBottom: 32,
            }}
          >
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                color: currentEra.color,
                letterSpacing: '0.1em',
                marginBottom: 8,
              }}
            >
              {currentEra.range}
            </div>
            <h2
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontWeight: 600,
                fontSize: 42,
                textTransform: 'uppercase',
                color: '#F2EEDF',
                letterSpacing: '0.02em',
                marginBottom: 8,
              }}
            >
              {currentEra.name}
            </h2>
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                color: currentEra.color,
                marginBottom: 16,
              }}
            >
              {eraTotal} títulos en esta era
            </div>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 16,
                color: '#9C9788',
                lineHeight: 1.65,
                maxWidth: 600,
              }}
            >
              {currentEra.description}
            </p>
          </div>

          {/* Book covers */}
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 32, minHeight: 120 }}>
            {loading ? (
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 12,
                  color: '#5C5A52',
                  padding: '40px 0',
                  letterSpacing: '0.06em',
                }}
              >
                Cargando…
              </div>
            ) : filteredBooks.length === 0 ? (
              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  color: '#5C5A52',
                  padding: '40px 0',
                }}
              >
                No hay títulos de este tipo en esta era.
              </div>
            ) : (
              filteredBooks.map((pub) => (
                <div
                  key={pub.id}
                  onClick={() => navigate(`/publicaciones/${pub.id}`)}
                  style={{ cursor: 'pointer' }}
                  title={pub.title}
                >
                  <BookCover
                    title={pub.title}
                    author={pub.author}
                    tone={deriveTone(pub.id)}
                    kind={pub.is_canon ? 'canon' : 'legends'}
                    w={130}
                    ratio={1.5}
                  />
                </div>
              ))
            )}
          </div>

          <button
            onClick={() => navigate('/buscar')}
            style={{
              background: 'none',
              border: `1px solid ${currentEra.color}40`,
              borderRadius: 6,
              color: currentEra.color,
              fontFamily: "'Oswald', sans-serif",
              fontWeight: 500,
              fontSize: 14,
              padding: '12px 24px',
              cursor: 'pointer',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Ver {eraTotal} títulos →
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Timeline;
