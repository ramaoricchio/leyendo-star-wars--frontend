import React, { useState } from 'react';
import TopNav from '../../components/Layout/TopNav';
import Footer from '../../components/Layout/Footer';
import BookCover from '../../components/BookCover/BookCover';
import Flag from '../../components/Flag/Flag';
import { ToneKey } from '../../types/publication';

type CanonFilter = 'canon' | 'legends' | 'ambos';

interface YearGroup {
  year: number;
  count: number;
  books: {
    title: string;
    author: string;
    tone: ToneKey;
    kind: 'canon' | 'legends';
    pubType: string;
  }[];
}

const YEAR_GROUPS: YearGroup[] = [
  {
    year: 2024,
    count: 14,
    books: [
      { title: 'The Living Force', author: 'John Jackson Miller', tone: 'E', kind: 'canon', pubType: 'Novela' },
      { title: 'Ahsoka: Novela', author: 'E.K. Johnston', tone: 'C', kind: 'canon', pubType: 'Novela' },
      { title: 'Inquisitor: Ascenso al dominio', author: 'Delilah S. Dawson', tone: 'D', kind: 'canon', pubType: 'Novela' },
      { title: 'La Alta República: Camino del engaño', author: 'Tessa Gratton', tone: 'H', kind: 'canon', pubType: 'Novela' },
      { title: 'Cómic: Darth Vader Vol. 5', author: 'Greg Pak', tone: 'G', kind: 'canon', pubType: 'Cómic' },
    ],
  },
  {
    year: 2023,
    count: 19,
    books: [
      { title: 'Thrawn: Treason', author: 'Timothy Zahn', tone: 'C', kind: 'canon', pubType: 'Novela' },
      { title: 'El Mandaloriano: Child of the Watch', author: 'Joe Schreiber', tone: 'G', kind: 'canon', pubType: 'Novela' },
      { title: 'Shadow of the Sith', author: 'Adam Christopher', tone: 'D', kind: 'canon', pubType: 'Novela' },
      { title: 'La Alta República: Venganza', author: 'Zoraida Córdova', tone: 'A', kind: 'canon', pubType: 'Novela' },
      { title: 'Crimson Reign', author: 'Charles Soule', tone: 'F', kind: 'canon', pubType: 'Cómic' },
    ],
  },
  {
    year: 1996,
    count: 8,
    books: [
      { title: 'Specter of the Past', author: 'Timothy Zahn', tone: 'C', kind: 'legends', pubType: 'Novela' },
      { title: 'Vision of the Future', author: 'Timothy Zahn', tone: 'E', kind: 'legends', pubType: 'Novela' },
      { title: 'Heir to the Jedi', author: 'Kevin Hearne', tone: 'B', kind: 'legends', pubType: 'Novela' },
      { title: 'Children of the Jedi', author: 'Barbara Hambly', tone: 'A', kind: 'legends', pubType: 'Novela' },
      { title: 'Darksaber', author: 'Kevin J. Anderson', tone: 'D', kind: 'legends', pubType: 'Novela' },
    ],
  },
];

const DECADES = [1977, 1980, 1990, 2000, 2010, 2020, 2026];

const ByYear: React.FC = () => {
  const [filter, setFilter] = useState<CanonFilter>('ambos');

  const filteredGroups = YEAR_GROUPS.map((g) => ({
    ...g,
    books: g.books.filter((b) => {
      if (filter === 'ambos') return true;
      return b.kind === filter;
    }),
  })).filter((g) => g.books.length > 0);

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', display: 'flex', flexDirection: 'column' }}>
      <TopNav active="Por año" />

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
          // año de publicación real
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
            Por año
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

      {/* Decades bar */}
      <div
        style={{
          padding: '24px 56px',
          borderBottom: '1px solid rgba(201,168,76,0.08)',
          display: 'flex',
          gap: 0,
          alignItems: 'center',
          overflowX: 'auto',
        }}
      >
        {DECADES.map((decade, i) => (
          <React.Fragment key={decade}>
            <button
              style={{
                background: 'none',
                border: 'none',
                color: '#5C5A52',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                cursor: 'pointer',
                padding: '4px 12px',
                letterSpacing: '0.06em',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => (e.target as HTMLButtonElement).style.color = '#C9A84C'}
              onMouseLeave={(e) => (e.target as HTMLButtonElement).style.color = '#5C5A52'}
            >
              {decade}
            </button>
            {i < DECADES.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: 2,
                  background: 'linear-gradient(90deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05))',
                  minWidth: 20,
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Year groups */}
      <div style={{ padding: '48px 56px', flex: 1 }}>
        {filteredGroups.map((group) => (
          <div
            key={group.year}
            style={{
              marginBottom: 64,
              display: 'flex',
              gap: 48,
              alignItems: 'flex-start',
            }}
          >
            {/* Year label */}
            <div style={{ flexShrink: 0, width: 160 }}>
              <div
                style={{
                  fontFamily: "'Oswald', sans-serif",
                  fontWeight: 600,
                  fontSize: 64,
                  color: '#C9A84C',
                  lineHeight: 1,
                }}
              >
                {group.year}
              </div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  color: '#5C5A52',
                  letterSpacing: '0.08em',
                  marginTop: 8,
                }}
              >
                {group.count} títulos
              </div>
              <div
                style={{
                  width: 40,
                  height: 1,
                  background: 'rgba(201,168,76,0.3)',
                  marginTop: 16,
                }}
              />
            </div>

            {/* Books grid */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                gap: 16,
                flexWrap: 'wrap',
                alignItems: 'flex-start',
              }}
            >
              {group.books.map((book, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    cursor: 'pointer',
                    width: 110,
                  }}
                >
                  <BookCover
                    title={book.title}
                    author={book.author}
                    tone={book.tone}
                    kind={book.kind}
                    w={110}
                    ratio={1.5}
                  />
                  <Flag kind={book.kind} size="sm" />
                  <div
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 12,
                      color: '#9C9788',
                      lineHeight: 1.3,
                    }}
                  >
                    {book.title}
                  </div>
                  <div
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 11,
                      color: '#5C5A52',
                    }}
                  >
                    {book.author}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
};

export default ByYear;
