import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useVisitLogger } from './hooks/useVisitLogger';
import { MinerProvider } from './context/MinerContext';

import LandingPage from './vistas/Landingpage/landingpage';
import EduramHome from './vistas/Eduramhome/eduramhome';
import MiComunidadHome from './vistas/Micomunidadfelizhome/micomunidadfelizhome';
import LeccionSeguridad from './vistas/Leccion/leccion-seguridad';
import Paradero from './vistas/Paradero/paradero';
import BitcoinMiner from './vistas/BitcoinMiner/bitcoin-miner';
import Restaurante from './vistas/Restaurante/restaurante';

const RouteTracker = ({ children }: { children: React.ReactNode }) => {
  useVisitLogger();
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <MinerProvider>
        <RouteTracker>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/eduram" element={<EduramHome />} />
            <Route path="/micomunidad" element={<MiComunidadHome />} />
            <Route path="/leccion-seguridad" element={<LeccionSeguridad />} />
            <Route path="/encuesta-pasaje" element={<Paradero />} />
            <Route path="/bitcoin-miner" element={<BitcoinMiner />} />
            <Route path="/restaurante" element={<Restaurante />} />
          </Routes>
        </RouteTracker>
      </MinerProvider>
    </BrowserRouter>
  );
}

export default App;
