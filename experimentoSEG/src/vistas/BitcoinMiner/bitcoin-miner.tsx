import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useMinerContext } from '../../context/MinerContext';
import './bitcoin-miner.css';

interface Session {
  id: string;
  blocks_found: number;
  amount_mined: number;
  duration_seconds: number;
  created_at: string;
  current_page: string;
}

function StatCard({
  label,
  value,
  color = '#00ff41',
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="stat-card">
      <div className="stat-card__label">{label}</div>
      <div className="stat-card__value" style={{ color }}>{value}</div>
    </div>
  );
}

function formatBTC(n: number) {
  return n.toFixed(8) + ' BTC';
}

function formatUSD(btc: number, price: number | null) {
  if (price === null) return '…';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 6 }).format(btc * price);
}

function useBTCPrice() {
  const [price, setPrice] = useState<number | null>(null);
  useEffect(() => {
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
      .then((r) => r.json())
      .then((d) => setPrice(d?.bitcoin?.usd ?? null))
      .catch(() => setPrice(null));
  }, []);
  return price;
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface WalletData {
  total_btc: number;
  total_blocks: number;
  total_sessions: number;
  updated_at: string;
}

function useWallet(refreshTrigger: number) {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [walletError, setWalletError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setWalletError('');
    supabase
      .from('attacker_wallet')
      .select('*')
      .eq('id', 'attacker-1')
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) setWalletError(error.message);
        else setWallet(data as WalletData | null);
        setLoading(false);
      });
  }, [refreshTrigger]);

  return { wallet, walletError, loading };
}

function AttackerWallet({
  wallet,
  loading,
  walletError,
  btcPrice,
}: {
  wallet: WalletData | null;
  loading: boolean;
  walletError: string;
  btcPrice: number | null;
}) {
  return (
    <div className="bm-wallet">
      <div className="bm-wallet__header">
        <div className="bm-wallet__title">⚠ BILLETERA DEL ATACANTE</div>
        <div className="bm-wallet__subtitle">
          tabla: <span className="bm-wallet__table">attacker_wallet</span>
          {' '}← acumula todas las sesiones de{' '}
          <span className="bm-wallet__table">bitcoin_sessions</span>
        </div>
      </div>

      {walletError ? (
        <div className="bm-wallet__error">
          <div className="bm-error__title">ERROR AL LEER BILLETERA</div>
          <div className="bm-error__body">{walletError}</div>
          <div className="bm-wallet__sql-hint">
            Crea la tabla en Supabase SQL Editor:
            <pre className="bm-wallet__sql">{`CREATE TABLE attacker_wallet (
  id            TEXT PRIMARY KEY,
  total_btc     NUMERIC DEFAULT 0,
  total_blocks  INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);
INSERT INTO attacker_wallet (id) VALUES ('attacker-1');
ALTER TABLE attacker_wallet ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon select" ON attacker_wallet FOR SELECT USING (true);
CREATE POLICY "anon write"  ON attacker_wallet FOR ALL    USING (true);`}</pre>
          </div>
        </div>
      ) : loading ? (
        <div className="bm-loading">Cargando billetera...</div>
      ) : !wallet ? (
        <div className="bm-empty">
          Billetera vacía — aún no hay sesiones guardadas.
        </div>
      ) : (
        <div className="bm-wallet__rows">
          <div className="bm-wallet__row">
            <span className="bm-wallet__key">SALDO TOTAL</span>
            <span className="bm-wallet__val bm-wallet__val--btc">{formatBTC(Number(wallet.total_btc))}</span>
          </div>
          {btcPrice && (
            <div className="bm-wallet__row">
              <span className="bm-wallet__key">VALOR USD</span>
              <span className="bm-wallet__val bm-wallet__val--usd">{formatUSD(Number(wallet.total_btc), btcPrice)}</span>
            </div>
          )}
          <div className="bm-wallet__row">
            <span className="bm-wallet__key">SESIONES ROBADAS</span>
            <span className="bm-wallet__val">{wallet.total_sessions}</span>
          </div>
          <div className="bm-wallet__row">
            <span className="bm-wallet__key">BLOQUES ACUMULADOS</span>
            <span className="bm-wallet__val">{wallet.total_blocks}</span>
          </div>
          <div className="bm-wallet__row">
            <span className="bm-wallet__key">ÚLTIMO DEPÓSITO</span>
            <span className="bm-wallet__val bm-wallet__val--date">{formatDate(wallet.updated_at)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function useSessionHistory(refreshTrigger: number) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [totals, setTotals] = useState({ sesiones: 0, bloques: 0, btc: 0 });
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    setLoading(true);
    setFetchError('');
    supabase
      .from('bitcoin_sessions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)
      .then(({ data, error }) => {
        if (error) {
          console.warn(error.message);
          setFetchError(error.message);
          setLoading(false);
          return;
        }
        const rows = (data ?? []) as Session[];
        setSessions(rows);
        setTotals({
          sesiones: rows.length,
          bloques: rows.reduce((a, r) => a + r.blocks_found, 0),
          btc: rows.reduce((a, r) => a + Number(r.amount_mined), 0),
        });
        setLoading(false);
      });
  }, [refreshTrigger]);

  return { sessions, totals, loading, fetchError };
}

export default function BitcoinMiner() {
  const { stats, saveError, refreshTrigger, forceRefresh } = useMinerContext();
  const { sessions, totals, loading, fetchError } = useSessionHistory(refreshTrigger);
  const { wallet, walletError, loading: walletLoading } = useWallet(refreshTrigger);
  const btcPrice = useBTCPrice();
  const isMatch = stats.currentHash.startsWith('000');

  return (
    <div className="bm-root">
      <h1 className="bm-title">₿ Simulador de Minería Bitcoin</h1>
      <p className="bm-subtitle">
        La minería se detiene y guarda automáticamente al salir de esta página
      </p>

      {/* Hash en tiempo real */}
      <div className={`bm-hash-box${isMatch ? ' bm-hash-box--match' : ''}`}>
        <div className="bm-hash-label">
          INTENTANDO HASH — dificultad: <span className="bm-hash-prefix">000</span>xxxxx
        </div>
        <div className={`bm-hash-value${isMatch ? ' bm-hash-value--match' : ''}`}>
          {stats.currentHash}
        </div>
        <div className="bm-nonce">nonce #{stats.nonce.toLocaleString()}</div>
      </div>

      {/* Grid de estadísticas sesión actual */}
      <div className="bm-stats-grid">
        <StatCard label="VELOCIDAD" value={`${stats.hashRate.toLocaleString()} H/s`} />
        <StatCard label="TIEMPO ACTIVO" value={formatTime(stats.elapsedSeconds)} />
        <StatCard label="BLOQUES ENCONTRADOS" value={stats.blocksFound.toString()} color="#f7931a" />
        <StatCard label="TOTAL MINADO" value={formatBTC(stats.totalMined)} color="#f7931a" />
        <StatCard
          label={btcPrice ? `VALOR EN USD (1 BTC = $${btcPrice.toLocaleString('en-US')})` : 'VALOR EN USD'}
          value={formatUSD(stats.totalMined, btcPrice)}
          color="#4cff91"
        />
      </div>

      {/* Último bloque */}
      {stats.lastBlockHash ? (
        <div className="bm-last-block">
          <div className="bm-last-block__label">✓ ÚLTIMO BLOQUE VÁLIDO</div>
          <div className="bm-last-block__hash">{stats.lastBlockHash}</div>
        </div>
      ) : (
        <div className="bm-no-block">Buscando primer bloque...</div>
      )}

      {/* Error al guardar sesión */}
      {saveError && (
        <div className="bm-save-error">
          <div className="bm-error__title">ERROR AL GUARDAR SESIÓN</div>
          <div className="bm-error__body">{saveError}</div>
          <div className="bm-error__hint">
            Revisa que la tabla <strong className="bm-error__key">bitcoin_sessions</strong> exista en Supabase y que RLS permita inserciones anónimas.
          </div>
        </div>
      )}

      {/* Billetera del atacante */}
      <AttackerWallet
        wallet={wallet}
        loading={walletLoading}
        walletError={walletError}
        btcPrice={btcPrice}
      />

      {/* Historial de sesiones */}
      <div className="bm-history">
        <div className="bm-history__header">
          <div className="bm-history__title">HISTORIAL DE SESIONES</div>
          <div className="bm-history__controls">
            {!loading && !fetchError && (
              <div className="bm-history__totals">
                {totals.sesiones} sesiones · {formatBTC(totals.btc)} acumulado
                {btcPrice && <span style={{ color: '#4cff91' }}> · {formatUSD(totals.btc, btcPrice)}</span>}
              </div>
            )}
            <button
              className="bm-reload-btn"
              onClick={forceRefresh}
            >
              ↺ recargar
            </button>
          </div>
        </div>

        {fetchError ? (
          <div className="bm-fetch-error">
            <div className="bm-error__title">ERROR AL LEER HISTORIAL</div>
            <div className="bm-error__body">{fetchError}</div>
            <div className="bm-fetch-error__hint">
              Posibles causas:<br />
              1. La tabla <strong className="bm-error__key">bitcoin_sessions</strong> no existe aún — créala en Supabase SQL Editor.<br />
              2. RLS bloqueando lectura — agrega política: <br />
              <span className="bm-fetch-error__code">
                {'CREATE POLICY "anon read" ON bitcoin_sessions FOR SELECT USING (true);'}
              </span>
            </div>
          </div>
        ) : loading ? (
          <div className="bm-loading">Cargando...</div>
        ) : sessions.length === 0 ? (
          <div className="bm-empty">
            Aún no hay sesiones guardadas.<br />
            <span className="bm-empty__hint">
              Las sesiones se guardan al navegar fuera de esta página (no al cerrar el navegador).
            </span>
          </div>
        ) : (
          <div className="bm-sessions-list">
            {sessions.map((s) => (
              <div key={s.id} className="bm-session-row">
                <div className="bm-session-row__date">{formatDate(s.created_at)}</div>
                <div className="bm-session-row__page" style={{ color: '#888', fontSize: '11px', fontFamily: 'monospace' }}>{s.current_page || '/'}</div>
                <div className="bm-session-row__time">{formatTime(s.duration_seconds)}</div>
                <div className="bm-session-row__blocks">{s.blocks_found} bloques</div>
                <div className="bm-session-row__btc">{formatBTC(Number(s.amount_mined))}</div>
                <div className="bm-session-row__usd" style={{ color: '#4cff91' }}>{formatUSD(Number(s.amount_mined), btcPrice)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bm-footer">
        Simulación educativa · No produce BTC real · Usa FNV-1a hash con dificultad 000xxxxx
      </div>
    </div>
  );
}
