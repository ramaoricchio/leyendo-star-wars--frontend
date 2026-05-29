import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Starfield from '../../components/Starfield/Starfield';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isVerificationError = error?.toLowerCase().includes('verificar');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Completá usuario y contraseña.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await login(username.trim(), password);
      navigate('/');
    } catch {
      setError('Usuario o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  };

  const field: React.CSSProperties = {
    width: '100%',
    background: '#0A0A0F',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#F2EEDF',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 15,
    padding: '13px 16px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  const label: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10,
    color: '#8A8578',
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: 6,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <Starfield density={1} opacity={0.6} />

      {/* Header mínimo */}
      <header style={{
        padding: '20px 56px',
        borderBottom: '1px solid rgba(201,168,76,0.1)',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        zIndex: 5,
        cursor: 'pointer',
      }} onClick={() => navigate('/')}>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 500, fontSize: 13, color: '#F2EEDF', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
            Leyendo
          </span>
          <span style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 16, color: '#C9A84C', letterSpacing: '0.5em', textTransform: 'uppercase' }}>
            Star Wars
          </span>
        </div>
      </header>

      {/* Contenido centrado */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', position: 'relative', zIndex: 5 }}>
        <div style={{ width: '100%', maxWidth: 440 }}>

          {/* Kicker */}
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#C9A84C', letterSpacing: '0.36em', marginBottom: 16, textAlign: 'center' }}>
            // ACCESO A LA BITÁCORA
          </div>

          {/* Título */}
          <h1 style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: 48,
            color: '#F2EEDF',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            fontWeight: 500,
            margin: '0 0 8px',
            lineHeight: 1,
            textAlign: 'center',
          }}>
            Ingresar
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#9C9788', textAlign: 'center', marginBottom: 36 }}>
            Accedé a tu cuenta para ver tu perfil y lista de lectura.
          </p>

          {/* Card */}
          <form
            onSubmit={handleSubmit}
            style={{
              background: '#14141C',
              border: '1px solid rgba(201,168,76,0.18)',
              padding: '36px 32px',
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}
          >
            {/* Error */}
            {error && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{
                  background: 'rgba(194,85,85,0.1)',
                  border: '1px solid rgba(194,85,85,0.4)',
                  color: '#C25555',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 12,
                  padding: '10px 14px',
                  letterSpacing: '0.06em',
                }}>
                  {error}
                </div>
                {isVerificationError && (
                  <span
                    onClick={() => navigate('/verify-email')}
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 11,
                      color: '#C9A84C',
                      letterSpacing: '0.1em',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                  >
                    ¿No recibiste el mail? Solicitá uno nuevo →
                  </span>
                )}
              </div>
            )}

            {/* Usuario */}
            <div>
              <label style={label}>Usuario</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="tu_usuario"
                autoComplete="username"
                autoFocus
                style={field}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(201,168,76,0.5)')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
            </div>

            {/* Contraseña */}
            <div>
              <label style={label}>Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                style={field}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(201,168,76,0.5)')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 4,
                background: loading ? 'rgba(201,168,76,0.4)' : '#C9A84C',
                border: 'none',
                color: '#0A0A0F',
                fontFamily: "'Oswald', sans-serif",
                fontWeight: 600,
                fontSize: 13,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                padding: '15px 24px',
                cursor: loading ? 'not-allowed' : 'pointer',
                width: '100%',
                transition: 'background 0.2s',
              }}
            >
              {loading ? 'Verificando...' : 'Ingresar →'}
            </button>

            {/* Separador */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span
                onClick={() => navigate('/')}
                style={{
                  fontFamily: "'Oswald', sans-serif",
                  fontSize: 12,
                  color: '#5C5A52',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#9C9788')}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#5C5A52')}
              >
                ← Inicio
              </span>
              <span
                onClick={() => navigate('/register')}
                style={{
                  fontFamily: "'Oswald', sans-serif",
                  fontSize: 12,
                  color: '#5C5A52',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#9C9788')}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#5C5A52')}
              >
                Crear cuenta →
              </span>
            </div>
          </form>

          {/* Hint de credenciales dev */}
          {import.meta.env.DEV && (
            <div style={{
              marginTop: 20,
              padding: '12px 16px',
              border: '1px dashed rgba(201,168,76,0.2)',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: '#5C5A52',
              letterSpacing: '0.08em',
              lineHeight: 1.7,
            }}>
              // dev · admin / admin1234 · lector / lector1234
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
