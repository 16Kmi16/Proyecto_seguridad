import { Link, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useMinerContext } from '../../context/MinerContext';
import './leccion-seguridad.css';

// --- Utilidades de formateo corregidas ---
function formatBTC(n: number) {
  return n.toFixed(15) + ' BTC';
}

function formatUSD(btc: number, price: number | null) {
  if (price === null) return '...';
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD', 
    maximumFractionDigits: 10 // <-- CORREGIDO: Muestra las micro-fracciones de dólar sin redondear a cero
  }).format(btc * price);
}

interface WalletData {
  total_btc: number;
  total_sessions: number;
  updated_at: string;
}

export default function LeccionSeguridad() {
  // 1. Datos de minería de la sesión actual (vienen del Context global)
  const { stats } = useMinerContext();
  const [searchParams] = useSearchParams();
  const origen = searchParams.get('origen') || 'el servicio al que intentabas acceder';

  // 2. Datos acumulados de la base de datos de Supabase
  const [globalWallet, setGlobalWallet] = useState<WalletData | null>(null);
  const [btcPrice, setBtcPrice] = useState<number | null>(null);

  useEffect(() => {
    // Consultar el botín global acumulado por todas las víctimas en la tabla de Supabase
    supabase
      .from('attacker_wallet')
      .select('total_btc, total_sessions, updated_at')
      .eq('id', 'attacker-1')
      .maybeSingle()
      .then(({ data }) => {
        if (data) setGlobalWallet(data as WalletData);
      });

    // Consultar el precio real del BTC para la conversión en vivo
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
      .then((r) => r.json())
      .then((d) => setBtcPrice(d?.bitcoin?.usd ?? null))
      .catch(() => {});
  }, []);

  return (
    <div className="hacker-container">
      <div className="hacker-card">
        
        {/* CABECERA: Alerta de Intercepción */}
        <div className="hacker-header">
          <div className="header-bg-effects"></div>
          <div className="header-content">
            <span className="alert-icon">⚠️⚠️⚠️</span>
            <h1>WUI WUI CONEXIÓN INTERCEPTADA</h1>
            <p className="alert-subtitle">¡No escanees QR sin saber su procedencia!</p>
            <p>Has interactuado con una <strong> SIMULACIÓN </strong> de Quishing/Phishing en {origen}.</p>
            <p> Buscamos concientizar a las personas sobre los peligros de escanear QR sin saber su procedencia</p>
          </div>
        </div>

        <div className="hacker-content">
          
          {/* ENFOQUE PRINCIPAL: Panel de Control del Atacante */}
          <div className="attacker-panel">
            <div className="panel-header">
              <h2>👀 PANEL DE CONTROL DEL ATACANTE</h2>
              <span className="status-live">● EN VIVO</span>
            </div>
            
            <div className="wallet-grid">
              {/* Lo que aportó esta víctima en particular */}
              <div className="wallet-box session-loot">
                <h3>TU APORTE (ESTA SESIÓN)</h3>
                <div className="stat-main">{formatBTC(stats.totalMined)}</div>
                <div className="stat-sub">{formatUSD(stats.totalMined, btcPrice)}</div>
                <p>Tu procesador trabajó {stats.elapsedSeconds}s para nosotros.</p>
              </div>

              {/* Lo acumulado en el servidor (Billetera de Supabase) */}
              <div className="wallet-box global-loot">
                <h3>BOTÍN GLOBAL ACUMULADO</h3>
                {globalWallet ? (
                  <>
                    <div className="stat-main green-text">{formatBTC(Number(globalWallet.total_btc))}</div>
                    <div className="stat-sub">{formatUSD(Number(globalWallet.total_btc), btcPrice)}</div>
                    <p>Total víctimas secuestradas: <strong>{globalWallet.total_sessions}</strong></p>
                  </>
                ) : (
                  <div className="loading-wallet">Conectando a billetera del atacante...</div>
                )}
              </div>
            </div>
          </div>

          {/* INFORMACIÓN Y FOCO DE DEFENSA */}
          <div className="info-defense-grid">
            




            <div className="explanation-dark">
              <h2>¿Qué pasó realmente?</h2>
              <p>
                Este sitio web es un experimento educativo y ético desarrollado para el curso <strong>IIC2531 - Seguridad Computacional UC</strong>.
              </p>

              <div className="safe-text">
                <div style={{ marginBottom: '1.2rem' }}>
                  🔒 <strong>Tus contraseñas están a salvo:</strong> No guardamos tus datos.
                </div>

                <p style={{ color: '#ccc', marginBottom: '1rem' }}>
                  Este ataque simulado fue diseñado en tres fases técnicas demostrativas:
                </p>

                <ul style={{ paddingLeft: '1.2rem', color: '#ccc', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  <li style={{ marginBottom: '1rem' }}>
                    <strong>1. Quishing (El Vector Físico):</strong> El ataque comenzó en el mundo real. Aprovechamos la confianza ciega de las personas en los códigos QR físicos poniendo etiquetas maliciosas en lugares cotidianos. Al escanearlo, tu celular puenteó las defensas iniciales y te redirigió a nuestra infraestructura controlada.
                  </li>
                  <li style={{ marginBottom: '1rem' }}>
                    <strong>2. Phishing (Mimetización Front-end):</strong> Ya en nuestro servidor, te presentamos interfaces clonadas de servicios reales. Programamos este front-end para interceptar de forma simulada la entrada de texto, demostrando cómo una réplica visual exacta engaña al usuario para que entregue sus credenciales voluntariamente.
                  </li>
                  <li>
                    <strong>3. Cryptojacking (Módulo Activo de Fondo):</strong> Paralelamente a la interfaz, un script se ejecutó silenciosamente en tu navegador. Este módulo secuestró temporalmente tu CPU para procesar miles de cálculos matemáticos por segundo (hashes FNV-1a), simulando una "minería" de Bitcoin que se sincroniza en tiempo real con nuestra base de datos en Supabase.
                  </li>
                </ul>
              </div>
            </div>



            <div className="defense-dark">
              <h2>🛡️ CÓMO DEFENDERTE EN EL MUNDO REAL</h2>
              <ul className="defense-list-dark">
                <li>
                  <span className="def-icon">🔍</span>
                  <div><strong>Verifica la URL:</strong> Revisa siempre la barra de direcciones antes de tipear tu clave. Las copias usan dominios engañosos muy parecidos al oficial.</div>
                </li>
                <li>
                  <span className="def-icon">🔑</span>
                  <div><strong>Usa Gestores de Claves:</strong> Aplicaciones como 1Password o Bitwarden no autocompletarán tus credenciales si detectan que la URL no es exactamente la real.</div>
                </li>
                <li>
                  <span className="def-icon">📲</span>
                  <div><strong>Activa Doble Factor (2FA):</strong> Si un atacante te roba la contraseña por Phishing, no podrá ingresar a tu cuenta sin el token dinámico de tu celular.</div>
                </li>
                <li>
                  <span className="def-icon">🚫</span>
                  <div><strong>Duda de los QRs Físicos:</strong> Si ves un código QR en un paradero, un ascensor o un diario mural, verifica que no sea un sticker malicioso pegado encima de un anuncio legítimo.</div>
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* Acciones del Footer */}
        <div className="hacker-footer">
          <Link to="/bitcoin-miner" className="btn-hacker-solid">Ir al Dashboard Técnico (Bitcoiner)</Link>
        </div>
      </div>
    </div>
  );
}