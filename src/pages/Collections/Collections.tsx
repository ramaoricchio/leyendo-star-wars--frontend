import React, { useState } from 'react';
import TopNav from '../../components/Layout/TopNav';
import Footer from '../../components/Layout/Footer';
import BookCover from '../../components/BookCover/BookCover';
import Flag from '../../components/Flag/Flag';
import { ToneKey } from '../../types/publication';

type FilterType = 'todas' | 'canon' | 'legends';

interface CollectionCard {
  id: number;
  name: string;
  author: string;
  era: string;
  kind: 'canon' | 'legends';
  count: number;
  books: { title: string; tone: ToneKey }[];
}

const COLLECTIONS: CollectionCard[] = [
  {
    id: 1,
    name: 'Trilogía de Thrawn',
    author: 'Timothy Zahn',
    era: 'Nueva República',
    kind: 'legends',
    count: 3,
    books: [
      { title: 'Heredero del Imperio', tone: 'C' },
      { title: 'La Flota de Oscuras Fuerzas', tone: 'E' },
      { title: 'El Último Comando', tone: 'G' },
    ],
  },
  {
    id: 2,
    name: 'La Alta República',
    author: 'Varios autores',
    era: 'Alta República',
    kind: 'canon',
    count: 12,
    books: [
      { title: 'Luz de los Jedi', tone: 'E' },
      { title: 'El sendero del engaño', tone: 'C' },
      { title: 'La tormenta', tone: 'H' },
    ],
  },
  {
    id: 3,
    name: 'Darth Bane',
    author: 'Drew Karpyshyn',
    era: 'Antigua República',
    kind: 'legends',
    count: 3,
    books: [
      { title: 'La senda de la destrucción', tone: 'D' },
      { title: 'La regla de dos', tone: 'G' },
      { title: 'Dinastía del mal', tone: 'F' },
    ],
  },
  {
    id: 4,
    name: 'X-Wing',
    author: 'Michael A. Stackpole',
    era: 'Nueva República',
    kind: 'legends',
    count: 10,
    books: [
      { title: 'Rogue Squadron', tone: 'E' },
      { title: 'Wedge\'s Gamble', tone: 'B' },
      { title: 'The Krytos Trap', tone: 'C' },
    ],
  },
  {
    id: 5,
    name: 'Aftermath',
    author: 'Chuck Wendig',
    era: 'Era de la Rebelión',
    kind: 'canon',
    count: 3,
    books: [
      { title: 'Aftermath', tone: 'G' },
      { title: 'Life Debt', tone: 'C' },
      { title: 'Empire\'s End', tone: 'D' },
    ],
  },
  {
    id: 6,
    name: 'Thrawn (Canon)',
    author: 'Timothy Zahn',
    era: 'Reinado del Imperio',
    kind: 'canon',
    count: 4,
    books: [
      { title: 'Thrawn', tone: 'C' },
      { title: 'Thrawn: Alianzas', tone: 'E' },
      { title: 'Thrawn: Traición', tone: 'G' },
    ],
  },
  {
    id: 7,
    name: 'Jedi Academy',
    author: 'Kevin J. Anderson',
    era: 'Nueva República',
    kind: 'legends',
    count: 3,
    books: [
      { title: 'Búsqueda de Jedi', tone: 'H' },
      { title: 'Acecho en la oscuridad', tone: 'A' },
      { title: 'El Resurgimiento de los Champions', tone: 'F' },
    ],
  },
  {
    id: 8,
    name: 'Nueva Trilogía de Jedi',
    author: 'Kevin J. Anderson',
    era: 'Nueva República',
    kind: 'legends',
    count: 4,
    books: [
      { title: 'Ícaro Negro', tone: 'D' },
      { title: 'Esclavo del Imperio', tone: 'B' },
      { title: 'La caída de los Jedi', tone: 'G' },
    ],
  },
];

const Collections: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>('todas');

  const filtered = COLLECTIONS.filter((c) => {
    if (filter === 'todas') return true;
    return c.kind === filter;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', display: 'flex', flexDirection: 'column' }}>
      <TopNav active="Colecciones" />

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
          // series, trilogías y sagas
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
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
            Colecciones
          </h1>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, background: '#14141C', borderRadius: 8, padding: 4 }}>
            {(['todas', 'canon', 'legends'] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  background: filter === f ? '#1C1C26' : 'none',
                  border: 'none',
                  borderRadius: 6,
                  color: filter === f ? '#F2EEDF' : '#9C9788',
                  fontFamily: "'Oswald', sans-serif",
                  fontWeight: 500,
                  fontSize: 13,
                  padding: '8px 20px',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  transition: 'all 0.2s',
                }}
              >
                {f === 'todas' ? 'Todas' : f === 'canon' ? 'Canon' : 'Leyendas'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div
        style={{
          flex: 1,
          padding: '48px 56px 64px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 24,
          }}
        >
          {filtered.map((col) => (
            <CollectionCard key={col.id} col={col} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

const CollectionCard: React.FC<{ col: CollectionCard }> = ({ col }) => {
  const [hovered, setHovered] = useState(false);
  const borderColor = col.kind === 'canon' ? '#4B8FD9' : '#C25555';

  return (
    <div
      style={{
        background: '#14141C',
        border: `1px solid ${hovered ? borderColor + '50' : 'rgba(201,168,76,0.1)'}`,
        borderRadius: 10,
        overflow: 'hidden',
        cursor: 'pointer',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? `0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px ${borderColor}30` : 'none',
        transition: 'all 0.25s ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Cover area */}
      <div
        style={{
          position: 'relative',
          height: 180,
          background: '#1C1C26',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Stacked covers */}
        {col.books.slice(0, 3).map((book, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              transform: `rotate(${[-8, 0, 8][i]}deg) translateX(${[-30, 0, 30][i]}px)`,
              zIndex: 3 - i,
              opacity: 1 - i * 0.05,
            }}
          >
            <BookCover
              title={book.title}
              tone={book.tone}
              kind={col.kind}
              w={90}
              ratio={1.5}
              badge={false}
            />
          </div>
        ))}
        {/* Gradient fade */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 80,
            background: 'linear-gradient(0deg, #14141C, transparent)',
          }}
        />
      </div>

      {/* Info area */}
      <div style={{ padding: '16px 20px 20px' }}>
        <div style={{ marginBottom: 10 }}>
          <Flag kind={col.kind} size="sm" />
        </div>
        <h3
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontWeight: 600,
            fontSize: 18,
            textTransform: 'uppercase',
            color: '#F2EEDF',
            lineHeight: 1.1,
            marginBottom: 6,
            letterSpacing: '0.02em',
          }}
        >
          {col.name}
        </h3>
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            color: '#9C9788',
            marginBottom: 4,
          }}
        >
          {col.author}
        </div>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: '#5C5A52',
            letterSpacing: '0.06em',
          }}
        >
          {col.era} · {col.count} vol.
        </div>
      </div>
    </div>
  );
};

export default Collections;
