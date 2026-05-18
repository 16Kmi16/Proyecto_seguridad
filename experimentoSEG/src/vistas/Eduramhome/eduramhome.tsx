import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVisitLogger } from '../../hooks/useVisitLogger';
import './eduramhome.css';

export default function EduramHome() {
  useVisitLogger();
  const navigate = useNavigate();
  const [step, setStep] = useState<'email' | 'password'>('email');
  const [email, setEmail] = useState('');
  const [animClass, setAnimClass] = useState('slide-in-right');

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setAnimClass('slide-in-right');
    setStep('password');
  };

  const handleBack = () => {
    setAnimClass('slide-in-left');
    setStep('email');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/leccion-seguridad');
  };

  return (
    <div className="ms-background">
      <div className="ms-overlay">

        {step === 'email' ? (
          <>
            <div className="ms-card">
              <div className={`ms-card-content ${animClass}`}>
                <h1 className="ms-title">Microsoft 365 UC</h1>
                <h2 className="ms-subtitle">Iniciar sesión</h2>
                <form onSubmit={handleNext}>
                  <input
                    type="text"
                    placeholder="usuario@uc.cl"
                    className="ms-input"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoFocus
                  />
                  <p className="ms-link-text">¿No puede acceder a su cuenta?</p>
                  <div className="ms-button-group">
                    <button type="submit" className="ms-btn-primary">Siguiente</button>
                  </div>
                </form>
              </div>
              <div className="ms-tenant-branding">
                <p>Pontificia Universidad Católica de Chile</p>
              </div>
            </div>

            <div className="ms-card-footer">
              <button className="ms-btn-options">
                <img
                  src="https://aadcdn.msauth.net/shared/1.0/content/images/signin-options_3e3f6b73c3f310c31d2c4d131a8ab8c6.svg"
                  alt="key"
                  className="ms-key-icon"
                />
                Opciones de inicio de sesión
              </button>
            </div>
          </>
        ) : (
          <div className="ms-card">
            <div className={`ms-card-content ${animClass}`}>
              <h1 className="ms-title">Microsoft 365 UC</h1>

              <p className="ms-back-row">
                <button className="ms-back-btn" onClick={handleBack}>←</button>
                <span className="ms-email-display">{email || 'usuario@uc.cl'}</span>
              </p>

              <h2 className="ms-subtitle">Escribir contraseña</h2>

              <form onSubmit={handleLogin}>
                <input
                  type="password"
                  placeholder="Contraseña"
                  className="ms-input"
                  autoFocus
                />
                <p className="ms-link-text">He olvidado mi contraseña</p>
                <p className="ms-link-text" style={{ marginTop: '-20px' }}>
                  Usar un certificado o una tarjeta inteligente
                </p>
                <div className="ms-button-group">
                  <button type="submit" className="ms-btn-primary">Iniciar sesión</button>
                </div>
              </form>
            </div>
            <div className="ms-tenant-branding">
              <p>Pontificia Universidad Católica de Chile</p>
            </div>
          </div>
        )}

        <div className="ms-page-footer">
          <a href="#">Términos de uso</a>
          <a href="#">Privacidad y cookies</a>
          <a href="#">...</a>
        </div>
      </div>
    </div>
  );
}