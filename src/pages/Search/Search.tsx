import React, { useState, useCallback } from 'react';
import TopNav from '../../components/Layout/TopNav';
import Footer from '../../components/Layout/Footer';
import BookCover from '../../components/BookCover/BookCover';
import Flag from '../../components/Flag/Flag';
import { ToneKey } from '../../types/publication';

interface SearchResult {
  id: number;
  title: string;
  author: string;
  tone: ToneKey;
  kind: 'canon' | 'legends';
  pubType: 'Novela' | 'Cómic' | 'Colección';
  year: number;
  era: string;
}

const MOCK_RESULTS: SearchResult[] = [
  { id: 1, title: 'Thrawn', author: 'Timothy Zahn', tone: 'C', kind: 'canon', pubType: 'Novela', year: 2017, era: 'Reinado del Imperio' },
  { id: 2, title: 'Thrawn: Alianzas', author: 'Timothy Zahn', tone: 'E', kind: 'canon', pubType: 'Novela', year: 2018, era: 'Reinado del Imperio' },
  { id: 3, title: 'Thrawn: Traición', author: 'Timothy Zahn', tone: 'G', kind: 'canon', pubType: 'Novela', year: 2019, era: 'Reinado del Imperio' },
  { id: 4, title: 'Thrawn: Una Nueva Alianza', author: 'Timothy Zahn', tone: 'A', kind: 'canon', pubType: 'Novela', year: 2022, era: 'Reinado del Imperio' },
  { id: 5, title: 'Heredero del Imperio', author: 'Timothy Zahn', tone: 'C', kind: 'legends', pubType: 'Novela', year: 1991, era: 'Nueva República' },
  { id: 6, title: 'La Flota de Oscuras Fuerzas', author: 'Timothy Zahn', tone: 'E', kind: 'legends', pubType: 'Novela', year: 1992, era: 'Nueva República' },
  { id: 7, title: 'El Último Comando', author: 'Timothy Zahn', tone: 'D', kind: 'legends', pubType: 'Novela', year: 1993, era: 'Nueva República' },
  { id: 8, title: 'Visiones de la Fuerza', author: 'Timothy Zahn', tone: 'H', kind: 'legends', pubType: 'Novela', year: 1998, era: 'Nueva República' },
  { id: 9, title: 'Thrawn (Cómic): Génesis', author: 'Jody Houser', tone: 'F', kind: 'canon', pubType: 'Cómic', year: 2018, era: 'Reinado del Imperio' },
  { id: 10, title: 'Trilogía de Thrawn', author: 'Timothy Zahn', tone: 'C', kind: 'legends', pubType: 'Colección', year: 1993, era: 'Nueva República' },
];

const FILTER_CHIPS = ['Novela', 'Cómic', 'Antología', 'Audiolibro', 'Canon', 'Leyendas', 'Alta República', 'Imperio'];

let debounceTimer: ReturnType<typeof setTimeout>;

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [activeChips, setActiveChips] = useState<string[]>([]);

  const handleInput = useCallback((val: string) => {
    setQuery(val);
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      setActiveQuery(val.trim());
    }, 350);
  }, []);

  const toggleChip = (chip: string) => {
    setActiveChips((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
    );
  };

  const results = activeQuery
    ? MOCK_RESULTS.filter((r) =>
        r.title.toLowerCase().includes(activeQuery.toLowerCase()) ||
        r.author.toLowerCase().includes(activeQuery.toLowerCase())
      )
    : activeQuery === '' && activeChips.length === 0
    ? []
    : MOCK_RESULTS;

  const books = results.filter((r) => r.pubType === 'Novela');
  const comics = results.filter((r) => r.pubType === 'Cómic');
  const collections = results.filter((r) => r.pubType === 'Colección');

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', display: 'flex', flexDirection: 'column' }}>
      <TopNav active="Buscar" />

      {/* Search header */}
      <div
        style={{
          padding: '72px 56px 48px',
          textAlign: 'center',
          borderBottom: '1px solid rgba(201,168,76,0.12)',
        }}
      >
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            color: '#C9A84C',
            letterSpacing: '0.1em',
            marginBottom: 16,
          }}
        >
          // buscar en 437 títulos
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
            marginBottom: 36,
          }}
        >
          Buscar
        </h1>
        {/* Search input */}
        <div
          style={{
            position: 'relative',
            maxWidth: 640,
            margin: '0 auto 24px',
          }}
        >
          <span
            style={{
              position: 'absolute',
              left: 20,
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: 20,
              color: '#5C5A52',
              pointerEvents: 'none',
            }}
          >
            ⌕
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => handleInput(e.target.value)}
            placeholder="Buscar por título, autor, era..."
            style={{
              width: '100%',
              background: '#14141C',
              border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: 8,
              padding: '18px 20px 18px 52px',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 16,
              color: '#F2EEDF',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'rgba(201,168,76,0.5)')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(201,168,76,0.2)')}
          />
          {query && (
            <button
              onClick={() => { setQuery(''); setActiveQuery(''); }}
              style={{
                position: 'absolute',
                right: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#5C5A52',
                fontSize: 18,
                cursor: 'pointer',
              }}
            >
              ×
            </button>
          )}
        </div>
        {/* Filter chips */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          {FILTER_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => toggleChip(chip)}
              style={{
                background: activeChips.includes(chip) ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${activeChips.includes(chip) ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: 20,
                color: activeChips.includes(chip) ? '#C9A84C' : '#9C9788',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                padding: '6px 16px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div style={{ flex: 1, padding: '48px 56px' }}>
        {!activeQuery && activeChips.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '80px 0',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 16,
              color: '#5C5A52',
            }}
          >
            Escribí algo para buscar en el universo expandido.
          </div>
        ) : results.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '80px 0',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 16,
              color: '#5C5A52',
            }}
          >
            No se encontraron resultados para "{activeQuery}".
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40 }}>
            {/* Libros */}
            <div>
              <div
                style={{
                  fontFamily: "'Oswald', sans-serif",
                  fontWeight: 500,
                  fontSize: 18,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#9C9788',
                  marginBottom: 20,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                Libros
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12,
                    color: '#C9A84C',
                    background: 'rgba(201,168,76,0.1)',
                    borderRadius: 3,
                    padding: '2px 8px',
                  }}
                >
                  {books.length}
                </span>
              </div>
              {books.map((r) => (
                <ResultItem key={r.id} result={r} />
              ))}
            </div>
            {/* Cómics */}
            <div>
              <div
                style={{
                  fontFamily: "'Oswald', sans-serif",
                  fontWeight: 500,
                  fontSize: 18,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#9C9788',
                  marginBottom: 20,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                Cómics
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12,
                    color: '#C9A84C',
                    background: 'rgba(201,168,76,0.1)',
                    borderRadius: 3,
                    padding: '2px 8px',
                  }}
                >
                  {comics.length}
                </span>
              </div>
              {comics.map((r) => (
                <ResultItem key={r.id} result={r} />
              ))}
              {comics.length === 0 && (
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#5C5A52' }}>
                  Sin resultados
                </div>
              )}
            </div>
            {/* Colecciones */}
            <div>
              <div
                style={{
                  fontFamily: "'Oswald', sans-serif",
                  fontWeight: 500,
                  fontSize: 18,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#9C9788',
                  marginBottom: 20,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                Colecciones
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12,
                    color: '#C9A84C',
                    background: 'rgba(201,168,76,0.1)',
                    borderRadius: 3,
                    padding: '2px 8px',
                  }}
                >
                  {collections.length}
                </span>
              </div>
              {collections.map((r) => (
                <ResultItem key={r.id} result={r} />
              ))}
              {collections.length === 0 && (
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#5C5A52' }}>
                  Sin resultados
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

const ResultItem: React.FC<{ result: SearchResult }> = ({ result }) => (
  <div
    style={{
      display: 'flex',
      gap: 12,
      padding: '12px 0',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      cursor: 'pointer',
      transition: 'opacity 0.2s',
    }}
    onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.opacity = '0.75'}
    onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.opacity = '1'}
  >
    <BookCover title={result.title} author={result.author} tone={result.tone} kind={result.kind} w={52} ratio={1.5} badge={false} />
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
        <Flag kind={result.kind} size="sm" />
      </div>
      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 500,
          fontSize: 14,
          color: '#F2EEDF',
          lineHeight: 1.2,
          marginBottom: 3,
        }}
      >
        {result.title}
      </div>
      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 12,
          color: '#5C5A52',
        }}
      >
        {result.author} · {result.year}
      </div>
    </div>
  </div>
);

export default Search;
