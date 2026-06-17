import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './restaurante.css';

export default function Restaurante() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [rut, setRut] = useState('');
  const [correo, setCorreo] = useState('');
  const [starsComida, setStarsComida] = useState(0);
  const [starsServicio, setStarsServicio] = useState(0);
  const [starsGeneral, setStarsGeneral] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/leccion-seguridad?origen=un restaurante');
  };

  return (
    <div className="rest-page">


      {/* Hero */}
      <div className="rest-hero">
        <span className="rest-hero-emoji">🥤</span>
        <h1>¡Gana una bebida gratis!</h1>
        <p className="rest-hero-sub">
          Responde nuestra breve encuesta de satisfacción y obtén una bebida sin costo. ¡Solo toma 2 minutos!
        </p>
      </div>

      {/* Steps */}
      <div className="rest-steps">
        <div className="rest-steps-inner">
          <div className="rest-step active">
            <span className="rest-step-num">1</span>
            Tus datos
          </div>
          <span className="rest-step-arrow">›</span>
          <div className="rest-step">
            <span className="rest-step-num">2</span>
            Recibe tu cupón
          </div>
        </div>
      </div>

      {/* Main */}
      <main className="rest-main">

        {/* Form card */}
        <div className="rest-card">
          <div className="rest-card-header">
            <span>👤</span>
            <h2>Paso 1: Ingresa tus datos personales</h2>
          </div>

          <div className="rest-card-body">
            <div className="rest-notice">
              <span className="rest-notice-icon">ℹ️</span>
              <span>
                Necesitamos tus datos para enviarte el cupón digital y validar tu identidad al momento del canje.
              </span>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="rest-field">
                <label htmlFor="nombre">
                  Nombre completo <span className="rest-required">*</span>
                </label>
                <input
                  type="text"
                  id="nombre"
                  className="rest-input"
                  placeholder="Ej: María Fernanda López"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>

              <div className="rest-field">
                <label htmlFor="rut">
                  RUT <span className="rest-required">*</span>
                </label>
                <input
                  type="text"
                  id="rut"
                  className="rest-input"
                  placeholder="Ej: 12.345.678-9"
                  value={rut}
                  onChange={(e) => setRut(e.target.value)}
                />
                <p className="rest-input-hint">Necesario para validar el cupón en caja.</p>
              </div>

              <div className="rest-field">
                <label htmlFor="correo">
                  Correo electrónico <span className="rest-required">*</span>
                </label>
                <input
                  type="text"
                  id="correo"
                  className="rest-input"
                  placeholder="Ej: usuario@correo.cl"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
                <p className="rest-input-hint">Te enviaremos el cupón a este correo.</p>
              </div>

              <div className="rest-section-title">Tu experiencia de hoy</div>

              <div className="rest-field">
                <label>¿Cómo calificarías la comida?</label>
                <div className="rest-stars-group">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span
                      key={n}
                      className={`rest-star${starsComida >= n ? ' selected' : ''}`}
                      onClick={() => setStarsComida(n)}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
              </div>

              <div className="rest-field">
                <label>¿Cómo calificarías el servicio?</label>
                <div className="rest-stars-group">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span
                      key={n}
                      className={`rest-star${starsServicio >= n ? ' selected' : ''}`}
                      onClick={() => setStarsServicio(n)}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
              </div>

              <div className="rest-field">
                <label>En general, ¿cómo calificarías tu visita? <span className="rest-required">*</span></label>
                <div className="rest-stars-group">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span
                      key={n}
                      className={`rest-star${starsGeneral >= n ? ' selected' : ''}`}
                      onClick={() => setStarsGeneral(n)}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
              </div>

              <div className="rest-field">
                <label>¿Recomendarías este local de comida a un amigo?</label>
                <div className="rest-radio-group">
                  {['Sí, definitivamente', 'Probablemente sí', 'No estoy seguro/a', 'No lo recomendaría'].map((opt) => (
                    <label key={opt} className="rest-radio-option">
                      <input type="radio" name="recomendar" value={opt} />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              <div className="rest-section-title">Deja tus comentarios <span style={{ fontWeight: 400, textTransform: 'none', fontSize: '12px', color: '#aaa' }}>(opcional)</span></div>

              <div className="rest-field">
                <textarea
                  className="rest-input rest-textarea"
                  placeholder="Cuéntanos qué te gustó, qué mejorarías o cualquier comentario sobre tu visita..."
                  rows={4}
                />
              </div>

              <hr className="rest-divider" />

              <div className="rest-terms">
                <input type="checkbox" id="terms" defaultChecked />
                <label htmlFor="terms">
                  Acepto los <a href="#">Términos y Condiciones</a> y que La Buena Mesa me contacte con ofertas y noticias.
                </label>
              </div>

              <button type="submit" className="rest-btn-submit">
                <span>Enviar y obtener mi cupón</span>
                <span>🥤</span>
              </button>

            </form>
          </div>
        </div>

       
      </main>

      {/* Footer */}
      <footer className="rest-footer">
        © 2026  &mdash; Todos los derechos reservados &nbsp;|&nbsp;
        <a href="#">Política de Privacidad</a> &nbsp;|&nbsp;
        <a href="#">Términos de Uso</a>
      </footer>

    </div>
  );
}
