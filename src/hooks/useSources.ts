import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { PatriarchSource, Patriarch } from '@/types';

export interface SourceWithPatriarch extends PatriarchSource {
  patriarch?: Pick<Patriarch, 'id' | 'name_ar' | 'name_en' | 'papal_number'>;
}

interface UseAllSourcesResult {
  sources: SourceWithPatriarch[];
  loading: boolean;
  error: string | null;
}

export function useAllSources(): UseAllSourcesResult {
  const [sources, setSources] = useState<SourceWithPatriarch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    let cancelled = false;

    async function fetchSources() {
      try {
        const [{ data: sData, error: sErr }, { data: pData, error: pErr }] = await Promise.all([
          supabase.from('patriarch_sources').select('*').order('created_at', { ascending: false }),
          supabase.from('patriarchs').select('id, name_ar, name_en, papal_number'),
        ]);

        if (sErr) throw sErr;
        if (pErr) throw pErr;

        if (!cancelled) {
          const patriarchMap = new Map((pData || []).map((p) => [p.id, p]));
          const enriched = (sData || []).map((s) => ({
            ...s,
            patriarch: patriarchMap.get(s.patriarch_id),
          }));
          setSources(enriched);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load sources');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchSources();
    return () => { cancelled = true; };
  }, []);

  return { sources, loading, error };
}
