import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BookCover from '../../components/BookCover/BookCover';
import Stars from '../../components/Stars/Stars';
import { ToneKey } from '../../types/publication';
import { getCollections, createCollection, updateCollection } from '../../api/collections';

type AdminTab = 'Publicaciones' | 'Colecciones' | 'Reseñas' | 'Usuarios';

interface PubItem {
  id: number;
  title: string;
  author: string;
  tone: ToneKey;
  kind: 'canon' | 'legends';
  pubType: string;
  year: number;
}

interface ColItem {
  id: number;
  name: string;
  author: string;
  era: string;
  kind: 'canon' | 'legends';
  tone: ToneKey;
  count: number;
  description: string;
}

const MOCK_PUBS: PubItem[] = [
  { id: 1, title: 'Thrawn', author: 'Timothy Zahn', tone: 'C', kind: 'canon', pubType: 'Novela', year: 2017 },
  { id: 2, title: 'Luz de los Jedi', author: 'Charles Soule', tone: 'E', kind: 'canon', pubType: 'Novela', year: 2021 },
  { id: 3, title: 'Darth Plagueis', author: 'James Luceno', tone: 'D', kind: 'legends', pubType: 'Novela', year: 2012 },
  { id: 4, title: 'Kenobi', author: 'John Jackson Miller', tone: 'B', kind: 'legends', pubType: 'Novela', year: 2013 },
  { id: 5, title: 'Aftermath', author: 'Chuck Wendig', tone: 'G', kind: 'canon', pubType: 'Novela', year: 2015 },
  { id: 6, title: 'Heredero del Imperio', author: 'Timothy Zahn', tone: 'C', kind: 'legends', pubType: 'Novela', year: 1991 },
];


const ERAS = ['Alta República', 'Antigua República', 'Amanecer Jedi', 'Caída de los Jedi', 'Reinado del Imperio', 'Era de la Rebelión', 'Nueva República', 'Ascenso de la Primera Orden'];
const TONES: ToneKey[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const COLLECTIONS = ['Trilogía de Thrawn', 'La Alta República', 'Aftermath', 'Thrawn (Canon)', 'X-Wing'];

const Admin: React.FC = () => {
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<AdminTab>('Publicaciones');

  // — Publicaciones state —
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

  // — Colecciones state —
  const [cols, setCols] = useState<ColItem[]>([]);
  const [colSearch, setColSearch] = useState('');
  const [selectedColId, setSelectedColId] = useState<number | null>(null);
  const [colIsNew, setColIsNew] = useState(false);
  const [colIsCanon, setColIsCanon] = useState(true);
  const [colSaved, setColSaved] = useState(false);
  const [colError, setColError] = useState('');
  const [colForm, setColForm] = useState({
    name: '',
    author: '',
    era: 'Alta República',
    description: '',
    tone: 'A' as ToneKey,
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    getCollections({ per_page: 100 }).then((r) => {
      const mapped: ColItem[] = r.items.map((c) => ({
        id: c.id,
        name: c.name,
        author: c.author ?? '',
        era: c.era ?? '',
        kind: c.is_canon ? 'canon' : 'legends',
        tone: (TONES.includes(c.cover_tone as ToneKey) ? c.cover_tone : 'A') as ToneKey,
        count: 0,
        description: c.description ?? '',
      }));
      setCols(mapped);
      if (mapped.length > 0 && !colIsNew) {
        const first = mapped[0];
        setSelectedColId(first.id);
        setColIsCanon(first.kind === 'canon');
        setColForm({ name: first.name, author: first.author, era: first.era, description: first.description, tone: first.tone });
      }
    });
  }, []);

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
          {(['Publicaciones', 'Colecciones', 'Reseñas', 'Usuarios'] as AdminTab[]).map((item) => (
            <button
              key={item}
              onClick={() => setActiveTab(item)}
              style={{
                background: activeTab === item ? 'rgba(201,168,76,0.08)' : 'none',
                border: 'none',
                borderBottom: activeTab === item ? '2px solid #C9A84C' : '2px solid transparent',
                color: activeTab === item ? '#C9A84C' : '#9C9788',
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
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '300px 1fr' }}>

        {/* ══ TAB: COLECCIONES ══ */}
        {activeTab === 'Colecciones' && (() => {
          const filteredCols = cols.filter(
            (c) => c.name.toLowerCase().includes(colSearch.toLowerCase()) || c.author.toLowerCase().includes(colSearch.toLowerCase())
          );
          const handleColInput = (field: keyof typeof colForm) =>
            (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
              setColForm((prev) => ({ ...prev, [field]: e.target.value }));

          const handleSelectCol = (col: ColItem) => {
            setColIsNew(false);
            setColSaved(false);
            setColError('');
            setSelectedColId(col.id);
            setColIsCanon(col.kind === 'canon');
            setColForm({ name: col.name, author: col.author, era: col.era, description: col.description, tone: col.tone });
          };

          const handleNewCol = () => {
            setColIsNew(true);
            setColSaved(false);
            setColError('');
            setSelectedColId(null);
            setColIsCanon(true);
            setColForm({ name: '', author: '', era: 'Alta República', description: '', tone: 'A' });
          };

          const handleSave = async () => {
            setColError('');
            const payload = {
              name: colForm.name,
              author: colForm.author,
              era: colForm.era,
              description: colForm.description,
              is_canon: colIsCanon,
              cover_tone: colForm.tone,
            };
            try {
              if (colIsNew) {
                const created = await createCollection(payload);
                const newItem: ColItem = {
                  id: created.id,
                  name: created.name,
                  author: created.author ?? '',
                  era: created.era ?? '',
                  kind: colIsCanon ? 'canon' : 'legends',
                  tone: (TONES.includes(created.cover_tone as ToneKey) ? created.cover_tone : 'A') as ToneKey,
                  count: 0,
                  description: created.description ?? '',
                };
                setCols((prev) => [...prev, newItem]);
                setColIsNew(false);
                setSelectedColId(created.id);
              } else {
                await updateCollection(selectedColId!, payload);
                setCols((prev) =>
                  prev.map((c) =>
                    c.id === selectedColId
                      ? { ...c, name: colForm.name, author: colForm.author, era: colForm.era, description: colForm.description, kind: colIsCanon ? 'canon' : 'legends', tone: colForm.tone }
                      : c
                  )
                );
              }
              setColSaved(true);
            } catch {
              setColError('No se pudo guardar. Verificá que el backend esté corriendo y que hayas iniciado sesión como admin.');
            }
          };

          return (
            <>
              {/* Sidebar colecciones */}
              <div style={{ borderRight: '1px solid rgba(201,168,76,0.1)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: 16, borderBottom: '1px solid rgba(201,168,76,0.08)' }}>
                  <input
                    type="text"
                    value={colSearch}
                    onChange={(e) => setColSearch(e.target.value)}
                    placeholder="Filtrar colecciones..."
                    style={{ ...inputStyle, padding: '8px 12px', fontSize: 13 }}
                  />
                </div>
                <button
                  onClick={handleNewCol}
                  style={{
                    margin: 12,
                    background: colIsNew ? 'rgba(201,168,76,0.15)' : 'linear-gradient(135deg, #C9A84C, #8E7635)',
                    border: colIsNew ? '1px solid rgba(201,168,76,0.4)' : 'none',
                    borderRadius: 6,
                    color: colIsNew ? '#C9A84C' : '#0A0A0F',
                    fontFamily: "'Oswald', sans-serif",
                    fontWeight: 600,
                    fontSize: 13,
                    padding: 10,
                    cursor: 'pointer',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  + Nueva colección
                </button>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  {filteredCols.map((col) => {
                    const isActive = !colIsNew && selectedColId === col.id;
                    return (
                      <div
                        key={col.id}
                        onClick={() => handleSelectCol(col)}
                        style={{
                          display: 'flex',
                          gap: 12,
                          padding: '12px 16px',
                          cursor: 'pointer',
                          background: isActive ? 'rgba(201,168,76,0.06)' : 'transparent',
                          borderLeft: `3px solid ${isActive ? '#C9A84C' : 'transparent'}`,
                          transition: 'all 0.15s',
                        }}
                      >
                        <BookCover title={col.name} tone={col.tone} kind={col.kind} w={36} ratio={1.5} badge={false} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 13, color: '#F2EEDF', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                            {col.name}
                          </div>
                          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#5C5A52', marginTop: 3 }}>
                            {col.author} · {col.count} títulos
                          </div>
                          <div style={{ marginTop: 4 }}>
                            <span style={{
                              fontSize: 9, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em',
                              color: col.kind === 'canon' ? '#4B8FD9' : '#C25555',
                              border: `1px solid ${col.kind === 'canon' ? '#4B8FD9' : '#C25555'}`,
                              padding: '1px 5px', borderRadius: 2,
                            }}>
                              {col.kind === 'canon' ? 'CANON' : 'LEYENDAS'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Editor colección */}
              <div style={{ padding: '32px 40px', overflowY: 'auto' }}>
                {/* Header editor */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
                  <div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#C9A84C', letterSpacing: '0.3em', marginBottom: 8 }}>
                      {colIsNew ? '// NUEVA COLECCIÓN' : `// EDITANDO · ID ${selectedColId?.toString()?.padStart(5, '0') ?? '—'}`}
                    </div>
                    <h2 style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 28, textTransform: 'uppercase', color: '#F2EEDF', letterSpacing: '0.04em', margin: 0 }}>
                      {colIsNew ? 'Nueva colección' : (colForm.name || 'Sin nombre')}
                    </h2>
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      onClick={() => { setColIsNew(false); setColSaved(false); setColError(''); if (cols[0]) handleSelectCol(cols[0]); }}
                      style={{ background: 'none', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6, color: '#9C9788', fontFamily: "'DM Sans', sans-serif", fontSize: 14, padding: '8px 20px', cursor: 'pointer' }}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSave}
                      style={{ background: 'linear-gradient(135deg, #C9A84C, #8E7635)', border: 'none', borderRadius: 6, color: '#0A0A0F', fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 13, padding: '8px 24px', cursor: 'pointer', letterSpacing: '0.06em', textTransform: 'uppercase' }}
                    >
                      {colIsNew ? 'Crear colección' : 'Guardar cambios'}
                    </button>
                  </div>
                </div>

                {/* Feedback guardado */}
                {colSaved && (
                  <div style={{ marginBottom: 24, padding: '12px 16px', background: 'rgba(107,197,138,0.08)', border: '1px solid rgba(107,197,138,0.3)', color: '#6BC58A', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: '0.08em' }}>
                    ✓ {colIsNew ? 'Colección creada correctamente.' : 'Cambios guardados.'}
                  </div>
                )}
                {colError && (
                  <div style={{ marginBottom: 24, padding: '12px 16px', background: 'rgba(194,85,85,0.08)', border: '1px solid rgba(194,85,85,0.3)', color: '#C25555', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: '0.08em' }}>
                    ✗ {colError}
                  </div>
                )}

                {/* Formulario */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
                  {/* Nombre */}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>Nombre de la colección</label>
                    <input
                      style={{ ...inputStyle, fontFamily: "'Oswald', sans-serif", fontSize: 18, textTransform: 'uppercase', letterSpacing: '0.04em' }}
                      value={colForm.name}
                      onChange={handleColInput('name')}
                      placeholder="Ej: Trilogía Thrawn"
                    />
                  </div>

                  {/* Autor */}
                  <div>
                    <label style={labelStyle}>Autor / es</label>
                    <input style={inputStyle} value={colForm.author} onChange={handleColInput('author')} placeholder="Ej: Timothy Zahn" />
                  </div>

                  {/* Era */}
                  <div>
                    <label style={labelStyle}>Era del universo</label>
                    <select style={inputStyle} value={colForm.era} onChange={handleColInput('era')}>
                      {ERAS.map((e) => <option key={e} value={e} style={{ background: '#1C1C26' }}>{e}</option>)}
                    </select>
                  </div>

                  {/* Canonicidad */}
                  <div>
                    <label style={labelStyle}>Canonicidad</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {(['canon', 'legends'] as const).map((k) => {
                        const active = k === 'canon' ? colIsCanon : !colIsCanon;
                        const color = k === 'canon' ? '#4B8FD9' : '#C25555';
                        return (
                          <button key={k} onClick={() => setColIsCanon(k === 'canon')} style={{
                            flex: 1,
                            background: active ? `${color}22` : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${active ? color : 'rgba(255,255,255,0.1)'}`,
                            borderRadius: 6, color: active ? color : '#9C9788',
                            fontFamily: "'Oswald', sans-serif", fontSize: 13, fontWeight: 500,
                            padding: 10, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.06em', transition: 'all 0.2s',
                          }}>
                            {k === 'canon' ? 'Canon' : 'Leyendas'}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tono de portada */}
                  <div>
                    <label style={labelStyle}>Tono de portada</label>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {TONES.map((t) => (
                        <button
                          key={t}
                          onClick={() => setColForm((prev) => ({ ...prev, tone: t }))}
                          title={`Tono ${t}`}
                          style={{
                            width: 32, height: 32, border: `2px solid ${colForm.tone === t ? '#C9A84C' : 'rgba(255,255,255,0.1)'}`,
                            borderRadius: 4, cursor: 'pointer', overflow: 'hidden', padding: 0,
                          }}
                        >
                          <BookCover title="" tone={t} kind={colIsCanon ? 'canon' : 'legends'} w={32} ratio={1} badge={false} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Descripción */}
                <div style={{ marginBottom: 28 }}>
                  <label style={labelStyle}>Descripción</label>
                  <textarea
                    style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }}
                    value={colForm.description}
                    onChange={handleColInput('description')}
                    placeholder="Descripción de la colección..."
                  />
                </div>

                {/* Preview */}
                <div>
                  <label style={labelStyle}>Preview de tarjeta</label>
                  <div style={{
                    display: 'inline-flex', flexDirection: 'column',
                    background: '#14141C', border: '1px solid rgba(201,168,76,0.15)',
                    width: 240, overflow: 'hidden',
                  }}>
                    <div style={{ position: 'relative', height: 160, background: '#0A0A0F', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', left: 20, top: 20, transform: 'rotate(-8deg)' }}>
                        <BookCover title={colForm.name || 'Colección'} tone={colForm.tone} kind={colIsCanon ? 'canon' : 'legends'} w={70} badge={false} />
                      </div>
                      <div style={{ position: 'absolute', left: 80, top: 16, zIndex: 2 }}>
                        <BookCover title={(colForm.name || 'Colección') + ' II'} tone={TONES[(TONES.indexOf(colForm.tone) + 2) % TONES.length]} kind={colIsCanon ? 'canon' : 'legends'} w={78} badge={false} />
                      </div>
                      <div style={{ position: 'absolute', left: 150, top: 24, transform: 'rotate(8deg)' }}>
                        <BookCover title={(colForm.name || 'Colección') + ' III'} tone={TONES[(TONES.indexOf(colForm.tone) + 4) % TONES.length]} kind={colIsCanon ? 'canon' : 'legends'} w={70} badge={false} />
                      </div>
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 50%, #14141C 100%)' }} />
                    </div>
                    <div style={{ padding: '14px 16px' }}>
                      <span style={{
                        fontSize: 9, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.15em',
                        color: colIsCanon ? '#4B8FD9' : '#C25555',
                        border: `1px solid ${colIsCanon ? '#4B8FD9' : '#C25555'}`,
                        padding: '2px 7px', borderRadius: 2,
                      }}>
                        {colIsCanon ? 'CANON' : 'LEYENDAS'}
                      </span>
                      <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 16, color: '#F2EEDF', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 10, lineHeight: 1.1 }}>
                        {colForm.name || 'Nombre de la colección'}
                      </div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#8A8578', marginTop: 4 }}>
                        {colForm.author || 'Autor'}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#9C9788', letterSpacing: '0.1em' }}>{(colForm.era || 'Era').toUpperCase()}</span>
                        <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 12, color: '#C9A84C' }}>— TÍTULOS</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          );
        })()}
        {/* ══ TAB: PUBLICACIONES ══ */}
        {activeTab === 'Publicaciones' && <>
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
        </>}

        {/* ══ TAB: RESEÑAS / USUARIOS — placeholder ══ */}
        {(activeTab === 'Reseñas' || activeTab === 'Usuarios') && (
          <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, color: '#5C5A52' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 32 }}>◈</div>
            <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 18, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              {activeTab} — próximamente
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Admin;
