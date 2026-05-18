import { Link } from 'react-router-dom';

export default function MiComunidadHome() {
  return (
    <div>
      <h1>🏘️ Mi Comunidad Feliz Home</h1>
      <p>Estás en la vista de Mi Comunidad Feliz.</p>
      <br />
      <Link to="/">← Volver al inicio</Link>
    </div>
  );
}