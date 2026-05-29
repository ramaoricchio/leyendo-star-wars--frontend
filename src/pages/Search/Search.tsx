import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNav from '../../components/Layout/TopNav';
import Footer from '../../components/Layout/Footer';
import BookCover from '../../components/BookCover/BookCover';
import Flag from '../../components/Flag/Flag';
import { ToneKey, Publication } from '../../types/publication';
import { search } from '../../api/search';

const TONES: ToneKey[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

let debounceTimer: ReturnType<typeof setTimeout>;

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [results, setResults] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInput = useCallback((val: string) => {
    setQuery(val);
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const q = val.trim();
      setActiveQuery(q);
      if (!q) {
        setResults([]);
        return;
      }
      setLoading(true);
      setError(null);
      search({ q })
        .then((data) => setResults(data.items))
        .catch(() => setError('Error al buscar. Verificá que el servidor esté activo.'))
        .finally(() => setLoading(false));
    }, 350);
  }, []);

  const books = results.filter((r) => r.pub_type === 'novela');
  const comics = results.filter((r) => r.pub_type === 'comic');
  const others = results.filter((r) => r.pub_type === 'antologia' || r.pub_type === 'audiolibro');

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
          // buscar en el universo expandido
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
            margin: '0 auto',
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
              boxSizing: 'border-box',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'rgba(201,168,76,0.5)')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(201,168,76,0.2)')}
          />
          {query && (
            <button
              onClick={() => { setQuery(''); setActiveQuery(''); setResults([]); }}
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
      </div>

      {/* Results */}
      <div style={{ flex: 1, padding: '48px 56px' }}>
        {!activeQuery ? (
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
        ) : loading ? (
          <div
            style={{
              textAlign: 'center',
              padding: '80px 0',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 16,
              color: '#5C5A52',
            }}
          >
            Buscando…
          </div>
        ) : error ? (
          <div
            style={{
              textAlign: 'center',
              padding: '80px 0',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 16,
              color: '#C25555',
            }}
          >
            {error}
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
            <ResultGroup label="Libros" count={books.length}>
              {books.map((r) => <ResultItem key={r.id} result={r} />)}
            </ResultGroup>
            {/* Cómics */}
            <ResultGroup label="Cómics" count={comics.length}>
              {comics.map((r) => <ResultItem key={r.id} result={r} />)}
            </ResultGroup>
            {/* Otros */}
            <ResultGroup label="Otros" count={others.length}>
              {others.map((r) => <ResultItem key={r.id} result={r} />)}
            </ResultGroup>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

const ResultGroup: React.FC<{ label: string; count: number; children: React.ReactNode }> = ({ label, count, children }) => (
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
      {label}
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
        {count}
      </span>
    </div>
    {count === 0 ? (
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#5C5A52' }}>
        Sin resultados
      </div>
    ) : children}
  </div>
);

const ResultItem: React.FC<{ result: Publication }> = ({ result }) => {
  const navigate = useNavigate();
  const kind = result.is_canon ? 'canon' : 'legends';
  const tone = TONES[result.id % 8];
  return (
    <div
      onClick={() => navigate(`/publicaciones/${result.id}`)}
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
      <BookCover title={result.title} author={result.author} tone={tone} kind={kind} w={52} ratio={1.5} badge={false} imageUrl={result.cover_urls?.[0] || undefined} />
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <Flag kind={kind} size="sm" />
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
};

export default Search;
