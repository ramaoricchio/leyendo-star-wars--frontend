import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BookCover from '../../components/BookCover/BookCover';
import Stars from '../../components/Stars/Stars';
import { ToneKey } from '../../types/publication';

interface PubItem {
  id: number;
  title: string;
  author: string;
  tone: ToneKey;
  kind: 'canon' | 'legends';
  pubType: string;
  year: number;
}

const MOCK_PUBS: PubItem[] = [
  { id: 1, title: 'Thrawn', author: 'Timothy Zahn', tone: 'C', kind: 'canon', pubType: 'Novela', year: 2017 },
  { id: 2, title: 'Luz de los Jedi', author: 'Charles Soule', tone: 'E', kind: 'canon', pubType: 'Novela', year: 2021 },
  { id: 3, title: 'Darth Plagueis', author: 'James Luceno', tone: 'D', kind: 'legends', pubType: 'Novela', year: 2012 },
  { id: 4, title: 'Kenobi', author: 'John Jackson Miller', tone: 'B', kind: 'legends', pubType: 'Novela', year: 2013 },
  { id: 5, title: 'Aftermath', author: 'Chuck Wendig', tone: 'G', kind: 'canon', pubType: 'Novela', year: 2015 },
  { id: 6, title: 'Heredero del Imperio', author: 'Timothy Zahn', tone: 'C', kind: 'legends', pubType: 'Novela', year: 1991 },
];

const ERAS = ['Alta República', 'Antigua República', 'Caída de los Jedi', 'Reinado del Imperio', 'Era de la Rebelión', 'Nueva República', 'Ascenso de la Primera Orden'];
const COLLECTIONS = ['Trilogía de Thrawn', 'La Alta República', 'Aftermath', 'Thrawn (Canon)', 'X-Wing'];

const Admin: React.FC = () => {
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(1);
  const [reviewScore, setReviewScore] = useState(4);
  const [isCanon, setIsCanon] = useState(true);
  const [formData, setFormData] = useState({
    title: 'Thrawn',
    author: 'Timothy Zahn',
    year: '2017',
    pubType: 'Novela',
    era: 'Reinado del Imperio',
    isbn: '978-0-345-51152-9',
    publisher: 'Del Rey Books',
    collection: 'Thrawn (Canon)',
    pages: '448',
    description: 'El Imperio Galáctico ha tomado control de la galaxia...',
    buyLinks: 'https://amazon.com/thrawn',
    reviewText: 'Una novela magistral que revela el origen del personaje más querido del universo expandido.',
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  const filtered = MOCK_PUBS.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.author.toLowerCase().includes(search.toLowerCase())
  );

  const selectedPub = MOCK_PUBS.find((p) => p.id === selectedId);

  const handleInput = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const inputStyle: React.CSSProperties = {
    background: '#1C1C26',
    border: '1px solid rgba(201,168,76,0.15)',
    borderRadius: 6,
    padding: '10px 14px',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    color: '#F2EEDF',
    width: '100%',
    outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    color: '#5C5A52',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: 6,
    display: 'block',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', display: 'flex', flexDirection: 'column' }}>
      {/* Admin top bar */}
      <div
        style={{
          background: '#06060A',
          borderBottom: '1px solid rgba(201,168,76,0.15)',
          height: 52,
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          gap: 24,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            lineHeight: 1,
            cursor: 'pointer',
          }}
          onClick={() => navigate('/')}
        >
          <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 10, color: '#F2EEDF', letterSpacing: '0.3em' }}>LEYENDO</span>
          <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 12, color: '#C9A84C', letterSpacing: '0.4em' }}>STAR WARS</span>
        </div>
        <div
          style={{
            background: 'rgba(201,168,76,0.1)',
            border: '1px solid rgba(201,168,76,0.2)',
            borderRadius: 4,
            padding: '3px 10px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: '#C9A84C',
            letterSpacing: '0.1em',
          }}
        >
          ADMIN · v0.7
        </div>
        <div style={{ flex: 1, display: 'flex', gap: 0 }}>
          {['Publicaciones', 'Colecciones', 'Reseñas', 'Usuarios'].map((item, i) => (
            <button
              key={item}
              style={{
                background: i === 0 ? 'rgba(201,168,76,0.08)' : 'none',
                border: 'none',
                borderBottom: i === 0 ? '2px solid #C9A84C' : '2px solid transparent',
                color: i === 0 ? '#C9A84C' : '#9C9788',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                padding: '0 16px',
                height: 52,
                cursor: 'pointer',
                transition: 'color 0.2s',
              }}
            >
              {item}
            </button>
          ))}
        </div>
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            color: '#9C9788',
          }}
        >
          {user?.email}
        </div>
        <div
          style={{
            width: 32,
            height: 32,
            background: 'rgba(201,168,76,0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Oswald', sans-serif",
            fontSize: 14,
            color: '#C9A84C',
          }}
        >
          {user?.username?.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Main: sidebar + editor */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '300px 1fr',
        }}
      >
        {/* Sidebar */}
        <div
          style={{
            borderRight: '1px solid rgba(201,168,76,0.1)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Sidebar header */}
          <div
            style={{
              padding: '16px',
              borderBottom: '1px solid rgba(201,168,76,0.1)',
            }}
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filtrar publicaciones..."
              style={{
                ...inputStyle,
                padding: '8px 12px',
                fontSize: 13,
              }}
            />
          </div>
          <button
            style={{
              margin: 12,
              background: 'linear-gradient(135deg, #C9A84C, #8E7635)',
              border: 'none',
              borderRadius: 6,
              color: '#0A0A0F',
              fontFamily: "'Oswald', sans-serif",
              fontWeight: 600,
              fontSize: 13,
              padding: '10px',
              cursor: 'pointer',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            + Nueva publicación
          </button>
          {/* List */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filtered.map((pub) => (
              <div
                key={pub.id}
                onClick={() => setSelectedId(pub.id)}
                style={{
                  display: 'flex',
                  gap: 12,
                  padding: '12px 16px',
                  cursor: 'pointer',
                  background: selectedId === pub.id ? 'rgba(201,168,76,0.06)' : 'transparent',
                  borderLeft: `3px solid ${selectedId === pub.id ? '#C9A84C' : 'transparent'}`,
                  transition: 'all 0.2s',
                }}
              >
                <BookCover title={pub.title} tone={pub.tone} kind={pub.kind} w={36} ratio={1.5} badge={false} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 500,
                      fontSize: 13,
                      color: '#F2EEDF',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {pub.title}
                  </div>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 10,
                      color: '#5C5A52',
                      marginTop: 3,
                    }}
                  >
                    {pub.author} · {pub.year}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Editor */}
        {selectedPub && (
          <div style={{ padding: '32px 40px', overflowY: 'auto' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 32,
              }}
            >
              <h2
                style={{
                  fontFamily: "'Oswald', sans-serif",
                  fontWeight: 600,
                  fontSize: 24,
                  textTransform: 'uppercase',
                  color: '#F2EEDF',
                  letterSpacing: '0.04em',
                }}
              >
                Editando: {selectedPub.title}
              </h2>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  style={{
                    background: 'none',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 6,
                    color: '#9C9788',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    padding: '8px 20px',
                    cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>
                <button
                  style={{
                    background: 'none',
                    border: '1px solid rgba(201,168,76,0.3)',
                    borderRadius: 6,
                    color: '#C9A84C',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    padding: '8px 20px',
                    cursor: 'pointer',
                  }}
                >
                  Previsualizar
                </button>
                <button
                  style={{
                    background: 'linear-gradient(135deg, #C9A84C, #8E7635)',
                    border: 'none',
                    borderRadius: 6,
                    color: '#0A0A0F',
                    fontFamily: "'Oswald', sans-serif",
                    fontWeight: 600,
                    fontSize: 13,
                    padding: '8px 24px',
                    cursor: 'pointer',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}
                >
                  Guardar cambios
                </button>
              </div>
            </div>

            {/* 2-column form */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
              {/* Título */}
              <div>
                <label style={labelStyle}>Título</label>
                <input style={inputStyle} value={formData.title} onChange={handleInput('title')} />
              </div>
              {/* Autor */}
              <div>
                <label style={labelStyle}>Autor</label>
                <input style={inputStyle} value={formData.author} onChange={handleInput('author')} />
              </div>
              {/* Año */}
              <div>
                <label style={labelStyle}>Año de publicación</label>
                <input style={inputStyle} value={formData.year} onChange={handleInput('year')} type="number" />
              </div>
              {/* Tipo */}
              <div>
                <label style={labelStyle}>Tipo</label>
                <select style={inputStyle} value={formData.pubType} onChange={handleInput('pubType')}>
                  {['Novela', 'Cómic', 'Antología', 'Audiolibro'].map((t) => (
                    <option key={t} value={t} style={{ background: '#1C1C26' }}>{t}</option>
                  ))}
                </select>
              </div>
              {/* Canon toggle */}
              <div>
                <label style={labelStyle}>Canonicidad</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {(['canon', 'legends'] as const).map((k) => (
                    <button
                      key={k}
                      onClick={() => setIsCanon(k === 'canon')}
                      style={{
                        flex: 1,
                        background: (k === 'canon' ? isCanon : !isCanon) ? (k === 'canon' ? 'rgba(75,143,217,0.15)' : 'rgba(194,85,85,0.15)') : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${(k === 'canon' ? isCanon : !isCanon) ? (k === 'canon' ? '#4B8FD9' : '#C25555') : 'rgba(255,255,255,0.1)'}`,
                        borderRadius: 6,
                        color: (k === 'canon' ? isCanon : !isCanon) ? (k === 'canon' ? '#4B8FD9' : '#C25555') : '#9C9788',
                        fontFamily: "'Oswald', sans-serif",
                        fontSize: 13,
                        fontWeight: 500,
                        padding: '10px',
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        transition: 'all 0.2s',
                      }}
                    >
                      {k === 'canon' ? 'Canon' : 'Leyendas'}
                    </button>
                  ))}
                </div>
              </div>
              {/* Era */}
              <div>
                <label style={labelStyle}>Era</label>
                <select style={inputStyle} value={formData.era} onChange={handleInput('era')}>
                  {ERAS.map((e) => (
                    <option key={e} value={e} style={{ background: '#1C1C26' }}>{e}</option>
                  ))}
                </select>
              </div>
              {/* ISBN */}
              <div>
                <label style={labelStyle}>ISBN</label>
                <input style={inputStyle} value={formData.isbn} onChange={handleInput('isbn')} />
              </div>
              {/* Editorial */}
              <div>
                <label style={labelStyle}>Editorial</label>
                <input style={inputStyle} value={formData.publisher} onChange={handleInput('publisher')} />
              </div>
              {/* Colección */}
              <div>
                <label style={labelStyle}>Colección</label>
                <select style={inputStyle} value={formData.collection} onChange={handleInput('collection')}>
                  <option value="" style={{ background: '#1C1C26' }}>Sin colección</option>
                  {COLLECTIONS.map((c) => (
                    <option key={c} value={c} style={{ background: '#1C1C26' }}>{c}</option>
                  ))}
                </select>
              </div>
              {/* Páginas */}
              <div>
                <label style={labelStyle}>Páginas</label>
                <input style={inputStyle} value={formData.pages} onChange={handleInput('pages')} type="number" />
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Descripción / Sinopsis</label>
              <textarea
                style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }}
                value={formData.description}
                onChange={handleInput('description')}
              />
            </div>

            {/* Portadas */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>URLs de portadas</label>
              <input style={inputStyle} placeholder="https://..." />
              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <BookCover title={formData.title} author={formData.author} tone="C" kind={isCanon ? 'canon' : 'legends'} w={80} ratio={1.5} />
                <div
                  style={{
                    width: 80,
                    height: 120,
                    border: '2px dashed rgba(201,168,76,0.2)',
                    borderRadius: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#5C5A52',
                    fontSize: 24,
                  }}
                >
                  +
                </div>
              </div>
            </div>

            {/* Buy links */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Links de compra</label>
              <input style={{ ...inputStyle, marginBottom: 8 }} value={formData.buyLinks} onChange={handleInput('buyLinks')} placeholder="Amazon URL" />
            </div>

            {/* Review */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Reseña (Markdown)</label>
              <textarea
                style={{ ...inputStyle, minHeight: 120, resize: 'vertical', fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}
                value={formData.reviewText}
                onChange={handleInput('reviewText')}
              />
            </div>

            {/* Score */}
            <div>
              <label style={labelStyle}>Puntaje</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Stars value={reviewScore} size={24} />
                <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 28, color: '#C9A84C', fontWeight: 600 }}>
                  {reviewScore}/5
                </span>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      onClick={() => setReviewScore(s)}
                      style={{
                        background: reviewScore >= s ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${reviewScore >= s ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.1)'}`,
                        borderRadius: 4,
                        color: reviewScore >= s ? '#C9A84C' : '#5C5A52',
                        fontFamily: "'Oswald', sans-serif",
                        fontSize: 13,
                        width: 32,
                        height: 32,
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
