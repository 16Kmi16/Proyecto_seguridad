import { Link } from 'react-router-dom';

export default function LeccionSeguridad() {
  return (
    <div>
      <h1>🏘️ Lección</h1>
      <p>no metas tus claves en cualquier parte</p>
      <br />
      <Link to="/">← Volver al inicio</Link>
    </div>
  );
}