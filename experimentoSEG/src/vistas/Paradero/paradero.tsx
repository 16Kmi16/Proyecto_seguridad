import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './paradero.css';

export default function Paradero() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [rut, setRut] = useState('');
  const [correo, setCorreo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/leccion-seguridad?origen=un paradero de Red Movilidad');
  };

  return (
    <div className="rm-page">

      {/* Header */}
      <header className="rm-header">
        <div className="rm-header-inner">
          <div className="rm-logo-block">
            <div className="rm-logo-box">
              <span className="rm-logo-text">red</span>
            </div>
            <span className="rm-logo-subtitle">Metropolitana de Movilidad</span>
          </div>
          <nav className="rm-nav-links">
            <a href="#">Inicio</a>
            <a href="#">Planifica tu viaje</a>
            <a href="#">Tarjeta Bip!</a>
            <a href="#">Atención al usuario</a>
          </nav>
        </div>
      </header>
      <div className="rm-strip" />



      {/* Main */}
      <main className="rm-main">

        {/* Form card */}
        <div className="rm-form-card">
          <div className="rm-form-card-header">
            <span className="rm-card-icon">🪪</span>
            <h2>Paso 1: Datos cliente</h2>
          </div>

          <div className="rm-form-body">
            <div className="rm-form-notice">
              Para continuar con la encuesta y obtener un pasaje gratuito, 
              complete con sus datos y responda las siguientes preguntas. Al finalizar, se le
              solicitará su número de tarjeta para realizar la transferencia del pasaje
            </div>

            <form onSubmit={handleSubmit}>

              <div className="rm-field-group">
                <label htmlFor="nombre">
                  Nombre completo <span className="rm-field-required">*</span>
                </label>
                <input
                  type="text"
                  id="nombre"
                  className="rm-input"
                  placeholder="Ej: Juan Andrés Pérez González"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>

              <div className="rm-field-group">
                <label htmlFor="rut">
                  RUT <span className="rm-field-required">*</span>
                </label>
                <input
                  type="text"
                  id="rut"
                  className="rm-input"
                  placeholder="Ej: 12.345.678-9"
                  value={rut}
                  onChange={(e) => setRut(e.target.value)}
                />
                <p className="rm-input-hint">Ingresa tu RUT sin puntos y guión.</p>
              </div>

              <div className="rm-field-group">
                <label htmlFor="correo">
                  Correo electrónico <span className="rm-field-required">*</span>
                </label>
                <input
                  type="text"
                  id="correo"
                  className="rm-input"
                  placeholder="Ej: usuario@correo.cl"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
                <p className="rm-input-hint">Te enviaremos la confirmación a este correo.</p>
              </div>

              <hr className="rm-form-divider" />

              <div className="rm-terms">
                <input type="checkbox" id="terms" defaultChecked />
                <label htmlFor="terms">
                  Acepto los <a href="#">Términos y Condiciones</a> y la{' '}
                  <a href="#">Política de Privacidad</a> de Red Metropolitana de Movilidad.
                </label>
              </div>

              <button type="submit" className="rm-btn-submit">
                Continuar →
              </button>

            </form>
          </div>
        </div>

     

      </main>

      {/* Footer */}
      <footer className="rm-footer">
        © 2025 Red Metropolitana de Movilidad &mdash; Ministerio de Transportes y Telecomunicaciones &nbsp;|&nbsp;
        <a href="#">Política de Privacidad</a> &nbsp;|&nbsp;
        <a href="#">Términos de Uso</a> &nbsp;|&nbsp;
        <a href="#">Accesibilidad</a>
      </footer>

    </div>
  );
}
