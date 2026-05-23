import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface TopNavProps {
  active?: string;
}

const NAV_ITEMS = [
  { label: 'Timeline', path: '/timeline' },
  { label: 'Por año', path: '/por-anno' },
  { label: 'Colecciones', path: '/colecciones' },
  { label: 'Reseñas', path: '/resenas' },
  { label: 'Buscar', path: '/buscar' },
];

const TopNav: React.FC<TopNavProps> = ({ active }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'linear-gradient(180deg, rgba(10,10,15,0.95) 0%, rgba(10,10,15,0.6) 100%)',
        backdropFilter: 'blur(6px)',
        borderBottom: '1px solid rgba(201,168,76,0.12)',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        padding: '0 56px',
      }}
    >
      {/* Logo */}
      <div
        onClick={() => navigate('/')}
        style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', lineHeight: 1 }}
      >
        <span
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontWeight: 500,
            fontSize: 13,
            color: '#F2EEDF',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
          }}
        >
          Leyendo
        </span>
        <span
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontWeight: 600,
            fontSize: 16,
            color: '#C9A84C',
            letterSpacing: '0.5em',
            textTransform: 'uppercase',
          }}
        >
          Star Wars
        </span>
      </div>

      {/* Nav Items */}
      <div style={{ display: 'flex', gap: 4, marginLeft: 48, flex: 1 }}>
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.label;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: isActive ? '1px solid #C9A84C' : '1px solid transparent',
                color: isActive ? '#C9A84C' : '#9C9788',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                fontWeight: 500,
                padding: '4px 16px',
                cursor: 'pointer',
                transition: 'color 0.2s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                if (!isActive) (e.target as HTMLButtonElement).style.color = '#F2EEDF';
              }}
              onMouseLeave={(e) => {
                if (!isActive) (e.target as HTMLButtonElement).style.color = '#9C9788';
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Auth area */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {isAdmin && (
          <button
            onClick={() => navigate('/admin')}
            style={{
              background: 'none',
              border: '1px solid rgba(201,168,76,0.3)',
              borderRadius: 4,
              color: '#C9A84C',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              padding: '4px 10px',
              cursor: 'pointer',
              letterSpacing: '0.08em',
            }}
          >
            ADMIN
          </button>
        )}
        {isAuthenticated ? (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              style={{
                background: 'rgba(201,168,76,0.1)',
                border: '1px solid rgba(201,168,76,0.25)',
                borderRadius: 4,
                color: '#F2EEDF',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                padding: '6px 14px',
                cursor: 'pointer',
              }}
            >
              {user?.username}
            </button>
            {showMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: 4,
                  background: '#1C1C26',
                  border: '1px solid rgba(201,168,76,0.2)',
                  borderRadius: 6,
                  minWidth: 140,
                  overflow: 'hidden',
                  zIndex: 200,
                }}
              >
                <button
                  onClick={() => { navigate('/perfil'); setShowMenu(false); }}
                  style={{
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    color: '#9C9788',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    padding: '10px 16px',
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  Mi perfil
                </button>
                <button
                  onClick={() => { logout(); setShowMenu(false); }}
                  style={{
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    color: '#C25555',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    padding: '10px 16px',
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'linear-gradient(135deg, #C9A84C, #8E7635)',
              border: 'none',
              borderRadius: 4,
              color: '#0A0A0F',
              fontFamily: "'Oswald', sans-serif",
              fontWeight: 600,
              fontSize: 13,
              padding: '7px 18px',
              cursor: 'pointer',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Ingresar
          </button>
        )}
      </div>
    </nav>
  );
};

export default TopNav;
