import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';

const DIFFICULTY = '000';
const HASHES_PER_TICK = 500;
const TICK_MS = 100;
const REWARD_PER_BLOCK = 0.000000000003125;
const SAVE_INTERVAL_MS = 5_000;

function fnv1a(s: string): string {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

export interface MinerStats {
  nonce: number;
  currentHash: string;
  hashRate: number;
  blocksFound: number;
  totalMined: number;
  elapsedSeconds: number;
  lastBlockHash: string;
}

interface MinerContextValue {
  stats: MinerStats;
  saveError: string;
  refreshTrigger: number;
  forceRefresh: () => void;
}

const MinerContext = createContext<MinerContextValue | null>(null);

export function MinerProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<MinerStats>({
    nonce: 0,
    currentHash: '00000000',
    hashRate: 0,
    blocksFound: 0,
    totalMined: 0,
    elapsedSeconds: 0,
    lastBlockHash: '',
  });
  const [saveError, setSaveError] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const ref = useRef({
    blocksFound: 0,
    totalMined: 0,
    nonce: 0,
    startTime: Date.now(),
    lastBlockHash: '',
    lastSavedBlocks: 0,
    sessionId: crypto.randomUUID(),
  });

  useEffect(() => {
    const r = ref.current;
    let lastHash = '00000000';

    const mineInterval = setInterval(() => {
      for (let i = 0; i < HASHES_PER_TICK; i++) {
        r.nonce++;
        const hash = fnv1a(`BTC:${r.nonce}:${r.startTime}`);
        lastHash = hash;
        if (hash.startsWith(DIFFICULTY)) {
          r.blocksFound++;
          r.totalMined += REWARD_PER_BLOCK;
          r.lastBlockHash = hash;
        }
      }

      setStats({
        nonce: r.nonce,
        currentHash: lastHash,
        hashRate: Math.floor(HASHES_PER_TICK / (TICK_MS / 1000)),
        blocksFound: r.blocksFound,
        totalMined: r.totalMined,
        elapsedSeconds: Math.floor((Date.now() - r.startTime) / 1000),
        lastBlockHash: r.lastBlockHash,
      });
    }, TICK_MS);

    const saveSession = (final = false) => {
      if (r.blocksFound === 0) return;
      if (!final && r.blocksFound === r.lastSavedBlocks) return;

      r.lastSavedBlocks = r.blocksFound;
      supabase
        .from('bitcoin_sessions')
        .upsert({
          id: r.sessionId,
          blocks_found: r.blocksFound,
          amount_mined: r.totalMined,
          duration_seconds: Math.floor((Date.now() - r.startTime) / 1000),
          current_page: window.location.pathname,
        })
        .then(({ error }) => {
          if (error) setSaveError(error.message);
          else {
            setSaveError('');
            setRefreshTrigger((n) => n + 1);
          }
        });
    };

    const saveInterval = setInterval(() => saveSession(), SAVE_INTERVAL_MS);

    return () => {
      clearInterval(mineInterval);
      clearInterval(saveInterval);
      saveSession(true);
    };
  }, []);

  return (
    <MinerContext.Provider value={{ stats, saveError, refreshTrigger, forceRefresh: () => setRefreshTrigger((n) => n + 1) }}>
      {children}
    </MinerContext.Provider>
  );
}

export function useMinerContext() {
  const ctx = useContext(MinerContext);
  if (!ctx) throw new Error('useMinerContext debe usarse dentro de MinerProvider');
  return ctx;
}
