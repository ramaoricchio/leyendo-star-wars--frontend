import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Starfield from '../../components/Starfield/Starfield';
import { verifyEmail, resendVerification } from '../../api/auth';

type Status = 'loading' | 'success' | 'error';

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [status, setStatus] = useState<Status>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [resendEmail, setResendEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendDone, setResendDone] = useState(false);
  const [resendError, setResendError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token') || '';
    if (!token) {
      setErrorMsg('No se encontró el token de verificación.');
      setStatus('error');
      return;
    }
    verifyEmail(token)
      .then(() => setStatus('success'))
      .catch((err: unknown) => {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'El link de verificación es inválido o expiró.';
        setErrorMsg(msg);
        setStatus('error');
      });
  }, [searchParams]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail.trim()) return;
    setResendError('');
    setResendLoading(true);
    try {
      await resendVerification(resendEmail.trim());
      setResendDone(true);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'No se pudo reenviar el mail.';
      setResendError(msg);
    } finally {
      setResendLoading(false);
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

          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#C9A84C', letterSpacing: '0.36em', marginBottom: 24, textAlign: 'center' }}>
            // VERIFICACIÓN DE CUENTA
          </div>

          <div style={{
            background: '#14141C',
            border: '1px solid rgba(201,168,76,0.18)',
            padding: '40px 32px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}>
            {status === 'loading' && (
              <>
                <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 20, color: '#F2EEDF', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Verificando...
                </div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#9C9788', margin: 0 }}>
                  Estamos validando tu link de verificación.
                </p>
              </>
            )}

            {status === 'success' && (
              <>
                <div style={{ fontSize: 40 }}>✓</div>
                <div>
                  <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 22, color: '#C9A84C', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                    ¡Email verificado!
                  </div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#9C9788', margin: 0 }}>
                    Tu cuenta está activa. Ya podés iniciar sesión.
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
                  Iniciar sesión →
                </button>
              </>
            )}

            {status === 'error' && (
              <>
                <div style={{
                  background: 'rgba(194,85,85,0.1)',
                  border: '1px solid rgba(194,85,85,0.4)',
                  color: '#C25555',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 12,
                  padding: '10px 14px',
                  letterSpacing: '0.06em',
                  textAlign: 'left',
                }}>
                  {errorMsg}
                </div>

                {resendDone ? (
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#9C9788', margin: 0 }}>
                    Te reenviamos el mail de verificación. Revisá tu casilla.
                  </p>
                ) : (
                  <>
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 20 }}>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#9C9788', margin: '0 0 16px', textAlign: 'left' }}>
                        ¿Querés recibir un nuevo link?
                      </p>
                      <form onSubmit={handleResend} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <input
                          type="email"
                          value={resendEmail}
                          onChange={(e) => setResendEmail(e.target.value)}
                          placeholder="tu@email.com"
                          style={field}
                          onFocus={(e) => (e.target.style.borderColor = 'rgba(201,168,76,0.5)')}
                          onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                        />
                        {resendError && (
                          <div style={{ color: '#C25555', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.06em' }}>
                            {resendError}
                          </div>
                        )}
                        <button
                          type="submit"
                          disabled={resendLoading}
                          style={{
                            background: resendLoading ? 'rgba(201,168,76,0.4)' : '#C9A84C',
                            border: 'none',
                            color: '#0A0A0F',
                            fontFamily: "'Oswald', sans-serif",
                            fontWeight: 600,
                            fontSize: 13,
                            letterSpacing: '0.25em',
                            textTransform: 'uppercase',
                            padding: '13px 24px',
                            cursor: resendLoading ? 'not-allowed' : 'pointer',
                            width: '100%',
                          }}
                        >
                          {resendLoading ? 'Enviando...' : 'Reenviar mail →'}
                        </button>
                      </form>
                    </div>
                  </>
                )}

                <span
                  onClick={() => navigate('/login')}
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontSize: 12,
                    color: '#5C5A52',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#9C9788')}
                  onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#5C5A52')}
                >
                  ← Ir a iniciar sesión
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
