import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer
      style={{
        background: '#06060A',
        borderTop: '1px solid rgba(201,168,76,0.12)',
        padding: '56px 56px 32px',
        marginTop: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: 1328,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: 48,
        }}
      >
        {/* Col 1: Logo + description */}
        <div>
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontWeight: 500,
                fontSize: 11,
                color: '#F2EEDF',
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
              }}
            >
              Leyendo
            </div>
            <div
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontWeight: 600,
                fontSize: 14,
                color: '#C9A84C',
                letterSpacing: '0.5em',
                textTransform: 'uppercase',
              }}
            >
              Star Wars
            </div>
          </div>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              color: '#5C5A52',
              lineHeight: 1.6,
              maxWidth: 280,
            }}
          >
            La guía definitiva para leer el universo expandido de Star Wars en orden cronológico. Canon y Leyendas.
          </p>
          <div
            style={{
              marginTop: 20,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: '#5C5A52',
              letterSpacing: '0.06em',
            }}
          >
            v0.7 · 437 títulos indexados
          </div>
        </div>

        {/* Col 2: Explorar */}
        <div>
          <h4
            style={{
              fontFamily: "'Oswald', sans-serif",
              fontWeight: 500,
              fontSize: 13,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#9C9788',
              marginBottom: 20,
            }}
          >
            Explorar
          </h4>
          {[
            { label: 'Timeline', path: '/timeline' },
            { label: 'Por año', path: '/por-anno' },
            { label: 'Colecciones', path: '/colecciones' },
            { label: 'Reseñas', path: '/resenas' },
            { label: 'Buscar', path: '/buscar' },
          ].map((item) => (
            <div key={item.label} style={{ marginBottom: 10 }}>
              <button
                onClick={() => navigate(item.path)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#5C5A52',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.target as HTMLButtonElement).style.color = '#C9A84C'}
                onMouseLeave={(e) => (e.target as HTMLButtonElement).style.color = '#5C5A52'}
              >
                {item.label}
              </button>
            </div>
          ))}
        </div>

        {/* Col 3: Categorías */}
        <div>
          <h4
            style={{
              fontFamily: "'Oswald', sans-serif",
              fontWeight: 500,
              fontSize: 13,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#9C9788',
              marginBottom: 20,
            }}
          >
            Categorías
          </h4>
          {['Novelas', 'Cómics', 'Antologías', 'Audiolibros', 'Canon', 'Leyendas'].map((cat) => (
            <div key={cat} style={{ marginBottom: 10 }}>
              <span
                style={{
                  color: '#5C5A52',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                }}
              >
                {cat}
              </span>
            </div>
          ))}
        </div>

        {/* Col 4: Comunidad */}
        <div>
          <h4
            style={{
              fontFamily: "'Oswald', sans-serif",
              fontWeight: 500,
              fontSize: 13,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#9C9788',
              marginBottom: 20,
            }}
          >
            Comunidad
          </h4>
          {['Mi perfil', 'Lista de lectura', 'Mis reseñas', 'Insignias'].map((item) => (
            <div key={item} style={{ marginBottom: 10 }}>
              <span
                style={{
                  color: '#5C5A52',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                }}
              >
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          maxWidth: 1328,
          margin: '40px auto 0',
          paddingTop: 24,
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: '#5C5A52',
            letterSpacing: '0.06em',
          }}
        >
          © 2026 Leyendo Star Wars · Proyecto no oficial · Sin afiliación con Lucasfilm
        </span>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: '#5C5A52',
            letterSpacing: '0.06em',
          }}
        >
          Que la Fuerza te acompañe
        </span>
      </div>
    </footer>
  );
};

export default Footer;
