import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
      <h1>Bienvenido al Portal</h1>
      <p>Selecciona a dónde quieres ir:</p>
      
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button onClick={() => navigate('/eduram')}>
          Ir a Eduram
        </button>
        <button onClick={() => navigate('/micomunidad')}>
          Ir a Mi Comunidad Feliz
        </button>
      </div>
    </div>
  );
}