import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './micomunidadfelizhome.css';

export default function ComunidadFelizHome() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirigir directamente a la lección educativa sin importar qué ingresaron
    navigate('/leccion-seguridad');
  };

  return (
    <div className="cf-container">
      <div className="cf-left-panel">
        <div className="cf-form-wrapper">
          <img
            src="https://cdn.comunidadfeliz.com/alpha/public/assets/cf-logo-6f02cea48b67fd0fa709e2b10706bdb1e73a462f561b3b91fa038a17e421b704.png"
            alt="ComunidadFeliz Logo"
            className="cf-logo"
          />
          
          <form onSubmit={handleLogin}>
            <div className="cf-input-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                type="text" /* Cambiado de "email" a "text" para evitar la validación del @ */
                id="email"
                className="cf-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                /* Se eliminó el 'required' */
              />
            </div>

            <div className="cf-input-group">
              <label htmlFor="password">Contraseña</label>
              <div className="cf-password-wrapper">
                <input
                  type="password"
                  id="password"
                  className="cf-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  /* Se eliminó el 'required' */
                />
                <img
                  src="https://cdn.comunidadfeliz.com/alpha/public/assets/eye-hidden-35f4cdb8fa3c603cd7af989fdfb7dd74be9ba3fe4a92d1f9b47cdd9a2b818a20.svg"
                  alt="Ocultar contraseña"
                  className="cf-eye-icon"
                />
              </div>
            </div>

            <div className="cf-forgot-password">
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/leccion-seguridad'); }}>
                Recuperar contraseña
              </a>
            </div>

            <button type="submit" className="cf-btn-primary">
              Iniciar sesión
            </button>
          </form>

          <button onClick={handleLogin} className="cf-btn-google">
            <img
              src="https://cdn.comunidadfeliz.com/alpha/public/assets/google-b22b997e428ee55bfe847f3e7bfb5733285c7b53ba9cba24523d1b06a9b7fc94.svg"
              alt="Google Logo"
            />
            Acceder con Google
          </button>

          <div className="cf-register-link">
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/leccion-seguridad'); }}>
              ¿Eres residente y no tienes cuenta?
            </a>
          </div>
        </div>
      </div>

      <div className="cf-right-panel">
        <iframe
          className="cf-iframe"
          src="https://www.comunidadfeliz.cl/prueba-de-login"
          title="Landing Page"
          frameBorder="0"
        ></iframe>
      </div>
    </div>
  );
}