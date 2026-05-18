import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useVisitLogger } from './hooks/useVisitLogger';

// Importamos tus vistas
import LandingPage from './vistas/Landingpage/landingpage';
import EduramHome from './vistas/Eduramhome/eduramhome';
import MiComunidadHome from './vistas/Micomunidadfelizhome/micomunidadfelizhome';
import LeccionSeguridad from './vistas/Leccion/leccion-seguridad';


// Este componente envuelve la app para ejecutar el contador en cada cambio de ruta
const RouteTracker = ({ children }: { children: React.ReactNode }) => {
  useVisitLogger();
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <RouteTracker>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/eduram" element={<EduramHome />} />
          <Route path="/micomunidad" element={<MiComunidadHome />} />
          <Route path="/leccion-seguridad" element={<LeccionSeguridad />} />
        </Routes>
      </RouteTracker>
    </BrowserRouter>
  );
}

export default App;