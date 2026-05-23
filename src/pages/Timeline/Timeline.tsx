import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNav from '../../components/Layout/TopNav';
import Footer from '../../components/Layout/Footer';
import Starfield from '../../components/Starfield/Starfield';
import BookCover from '../../components/BookCover/BookCover';
import { ToneKey } from '../../types/publication';

type CanonFilter = 'canon' | 'legends' | 'ambos';

interface Era {
  id: string;
  name: string;
  range: string;
  count: number;
  color: string;
  description: string;
  books: { title: string; author: string; tone: ToneKey; kind: 'canon' | 'legends' }[];
}

const ERAS: Era[] = [
  {
    id: 'dawn',
    name: 'Amanecer Jedi',
    range: 'c. 25.000 – 5.000 BBY',
    count: 18,
    color: '#7B5BC5',
    description: 'Los albores de la Orden Jedi y los primeros enfrentamientos con el lado oscuro. Una era de descubrimiento y formación de la galaxia.',
    books: [
      { title: 'Amanecer del Jedi: Fuerza sin oscuridad', author: 'John Ostrander', tone: 'A', kind: 'legends' },
      { title: 'Amanecer del Jedi: El despertar', author: 'John Ostrander', tone: 'A', kind: 'legends' },
      { title: 'Amanecer del Jedi: Prisión del Oscuro', author: 'John Ostrander', tone: 'F', kind: 'legends' },
      { title: 'Antes de la República', author: 'Varios', tone: 'G', kind: 'legends' },
    ],
  },
  {
    id: 'oldrep',
    name: 'Antigua República',
    range: '5.000 – 1.000 BBY',
    count: 42,
    color: '#5BA3C5',
    description: 'La época dorada de la Antigua República, marcada por guerras devastadoras contra los Sith y el surgimiento de grandes leyendas.',
    books: [
      { title: 'Caballeros de la Antigua República', author: 'John Jackson Miller', tone: 'B', kind: 'legends' },
      { title: 'La Guerra Sith', author: 'Kevin J. Anderson', tone: 'D', kind: 'legends' },
      { title: 'Darth Bane: La senda de la destrucción', author: 'Drew Karpyshyn', tone: 'D', kind: 'legends' },
      { title: 'Darth Bane: La regla de dos', author: 'Drew Karpyshyn', tone: 'G', kind: 'legends' },
    ],
  },
  {
    id: 'high',
    name: 'Alta República',
    range: '500 – 100 BBY',
    count: 36,
    color: '#E3C865',
    description: 'La era más luminosa de los Jedi, cuando la República expandía sus fronteras y los guardianes de la paz brillaban en toda su gloria.',
    books: [
      { title: 'Luz de los Jedi', author: 'Charles Soule', tone: 'E', kind: 'canon' },
      { title: 'El sendero del engaño', author: 'Claudia Gray', tone: 'C', kind: 'canon' },
      { title: 'La tormenta de la cosecha', author: 'Cavan Scott', tone: 'H', kind: 'canon' },
      { title: 'El guardián de las tormentas Whills', author: 'Daniel José Older', tone: 'F', kind: 'canon' },
    ],
  },
  {
    id: 'fall',
    name: 'Caída de los Jedi',
    range: '100 – 19 BBY',
    count: 54,
    color: '#6BC58A',
    description: 'La preuela a las películas. Intrigas políticas, el ascenso de Palpatine y el comienzo del fin para la Orden Jedi.',
    books: [
      { title: 'Darth Plagueis', author: 'James Luceno', tone: 'D', kind: 'legends' },
      { title: 'Maul: Lockdown', author: 'Joe Schreiber', tone: 'D', kind: 'legends' },
      { title: 'La amenaza Phantom: Novela', author: 'Terry Brooks', tone: 'A', kind: 'legends' },
      { title: 'Cloak of Deception', author: 'James Luceno', tone: 'C', kind: 'legends' },
    ],
  },
  {
    id: 'reign',
    name: 'Reinado del Imperio',
    range: '19 BBY – 4 ABY',
    count: 87,
    color: '#C56B5B',
    description: 'La era oscura del Imperio Galáctico. Los Jedi sobrevivientes, la Rebelión naciente y los héroes que desafiaron la tiranía.',
    books: [
      { title: 'Kenobi', author: 'John Jackson Miller', tone: 'E', kind: 'legends' },
      { title: 'Thrawn', author: 'Timothy Zahn', tone: 'C', kind: 'canon' },
      { title: 'Rogue One: Novela', author: 'Alexander Freed', tone: 'G', kind: 'canon' },
      { title: 'Una nueva esperanza: Novela', author: 'Alan Dean Foster', tone: 'B', kind: 'legends' },
    ],
  },
  {
    id: 'civil',
    name: 'Era de la Rebelión',
    range: '4 – 5 ABY',
    count: 31,
    color: '#C9A84C',
    description: 'La guerra civil galáctica alcanza su clímax. Aldeeran, la Estrella de la Muerte, Hoth, Endor. Los momentos más icónicos de la saga.',
    books: [
      { title: 'El Imperio Contraataca: Novela', author: 'Donald Glut', tone: 'E', kind: 'legends' },
      { title: 'El retorno del Jedi: Novela', author: 'James Kahn', tone: 'H', kind: 'legends' },
      { title: 'Aftermath', author: 'Chuck Wendig', tone: 'G', kind: 'canon' },
      { title: 'Aftermath: Life Debt', author: 'Chuck Wendig', tone: 'C', kind: 'canon' },
    ],
  },
  {
    id: 'newrep',
    name: 'Nueva República',
    range: '5 – 34 ABY',
    count: 64,
    color: '#5B7FC5',
    description: 'La galaxia reconstruye tras la caída del Imperio. Nuevas amenazas emergen mientras la República Galáctica intenta florecer.',
    books: [
      { title: 'Heredero del Imperio', author: 'Timothy Zahn', tone: 'C', kind: 'legends' },
      { title: 'Oscuras fuerzas: Soldado por el Imperio', author: 'William C. Dietz', tone: 'D', kind: 'legends' },
      { title: 'X-Wing: Rogue Squadron', author: 'Michael A. Stackpole', tone: 'E', kind: 'legends' },
      { title: 'Mandalorian: El camino', author: 'Jon Favreau', tone: 'G', kind: 'canon' },
    ],
  },
  {
    id: 'risefo',
    name: 'Ascenso de la Primera Orden',
    range: '34 – 35 ABY',
    count: 22,
    color: '#B45BC5',
    description: 'Los últimos Jedi, la resistencia final y el despertar de una nueva generación de héroes frente a la Primera Orden.',
    books: [
      { title: 'El despertar de la Fuerza: Novela', author: 'Alan Dean Foster', tone: 'A', kind: 'canon' },
      { title: 'Los últimos Jedi: Novela', author: 'Jason Fry', tone: 'D', kind: 'canon' },
      { title: 'El ascenso de Skywalker: Novela', author: 'Rae Carson', tone: 'F', kind: 'canon' },
      { title: 'Phasma', author: 'Delilah S. Dawson', tone: 'G', kind: 'canon' },
    ],
  },
];

const Timeline: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<CanonFilter>('ambos');
  const [activeEra, setActiveEra] = useState<string>('high');

  const currentEra = ERAS.find((e) => e.id === activeEra) || ERAS[0];

  const filteredBooks = currentEra.books.filter((b) => {
    if (filter === 'ambos') return true;
    return b.kind === filter;
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
                    {era.count} títulos
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
              {currentEra.count} títulos en esta era
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
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 32 }}>
            {filteredBooks.map((book, i) => (
              <BookCover
                key={i}
                title={book.title}
                author={book.author}
                tone={book.tone}
                kind={book.kind}
                w={130}
                ratio={1.5}
              />
            ))}
            {filteredBooks.length === 0 && (
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
            Ver {currentEra.count} títulos →
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Timeline;
