import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Starfield from '../../components/Starfield/Starfield';
import { register } from '../../api/auth';

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim() || !password || !confirm) {
      setError('Completá todos los campos.');
      return;
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await register(username.trim(), email.trim(), password);
      setDone(true);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'No se pudo crear la cuenta. Intentá de nuevo.';
      setError(msg);
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

      <header
        style={{
          padding: '20px 56px',
          borderBottom: '1px solid rgba(201,168,76,0.1)',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          zIndex: 5,
          cursor: 'pointer',
        }}
        onClick={() => navigate('/')}
      >
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 500, fontSize: 13, color: '#F2EEDF', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
            Leyendo
          </span>
          <span style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 16, color: '#C9A84C', letterSpacing: '0.5em', textTransform: 'uppercase' }}>
            Star Wars
          </span>
        </div>
      </header>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', position: 'relative', zIndex: 5 }}>
        <div style={{ width: '100%', maxWidth: 440 }}>

          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#C9A84C', letterSpacing: '0.36em', marginBottom: 16, textAlign: 'center' }}>
            // NUEVA CUENTA
          </div>

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
            Registrarse
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#9C9788', textAlign: 'center', marginBottom: 36 }}>
            Creá tu cuenta para guardar tu progreso de lectura.
          </p>

          {done ? (
            <div style={{
              background: '#14141C',
              border: '1px solid rgba(201,168,76,0.18)',
              padding: '36px 32px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}>
              <div style={{ fontSize: 32 }}>✉️</div>
              <div>
                <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 20, color: '#F2EEDF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                  Revisá tu casilla
                </div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#9C9788', margin: 0, lineHeight: 1.7 }}>
                  Te mandamos un mail para verificar tu cuenta.<br />
                  El link expira en 24 horas.
                </p>
              </div>
              <button
                onClick={() => navigate('/login')}
                style={{
                  background: '#C9A84C',
                  border: 'none',
                  color: '#0A0A0F',
                  fontFamily: "'Oswald', sans-serif",
                  fontWeight: 600,
                  fontSize: 13,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  padding: '15px 24px',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                Ir a iniciar sesión →
              </button>
            </div>
          ) : (
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
              {error && (
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
              )}

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

              <div>
                <label style={label}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  autoComplete="email"
                  style={field}
                  onFocus={(e) => (e.target.style.borderColor = 'rgba(201,168,76,0.5)')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
              </div>

              <div>
                <label style={label}>Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  style={field}
                  onFocus={(e) => (e.target.style.borderColor = 'rgba(201,168,76,0.5)')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
              </div>

              <div>
                <label style={label}>Confirmar contraseña</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  style={field}
                  onFocus={(e) => (e.target.style.borderColor = 'rgba(201,168,76,0.5)')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
              </div>

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
                {loading ? 'Creando cuenta...' : 'Crear cuenta →'}
              </button>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 16, textAlign: 'center' }}>
                <span
                  onClick={() => navigate('/login')}
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
                  ¿Ya tenés cuenta? Iniciá sesión →
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
