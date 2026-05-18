import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export const useVisitLogger = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    let cancelled = false;

    const logVisit = async () => {
      // Intentamos incrementar si ya existe
      const { data: existing } = await supabase
        .from('page_visits')
        .select('count')
        .eq('path', path)
        .single();

      if (cancelled) return;

      if (existing) {
        await supabase
          .from('page_visits')
          .update({ count: existing.count + 1 })
          .eq('path', path);
        console.log(`👀 Visitas de '${path}': ${existing.count + 1}`);
      } else {
        await supabase
          .from('page_visits')
          .insert({ path, count: 1 });
        console.log(`👀 Visitas de '${path}': 1`);
      }
    };

    logVisit();

    // Cleanup para evitar el doble disparo de StrictMode
    return () => { cancelled = true; };
  }, [location.pathname]);
};