import { useState, useEffect, useMemo } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Patriarch } from '@/types';

interface UsePatriarchsResult {
  patriarchs: Patriarch[];
  loading: boolean;
  error: string | null;
}

export function usePatriarchs(): UsePatriarchsResult {
  const [patriarchs, setPatriarchs] = useState<Patriarch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchPatriarchs() {
      if (!isSupabaseConfigured) {
        setError('Supabase is not configured. Set environment variables.');
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('patriarchs')
          .select('*')
          .order('papal_number', { ascending: true });

        if (fetchError) throw fetchError;
        if (!cancelled) {
          setPatriarchs(data || []);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load patriarchs');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchPatriarchs();
    return () => {
      cancelled = true;
    };
  }, []);

  return { patriarchs, loading, error };
}

interface UsePatriarchDetailResult {
  patriarch: Patriarch | null;
  events: import('@/types').PatriarchEvent[];
  sources: import('@/types').PatriarchSource[];
  loading: boolean;
  error: string | null;
}

export function usePatriarchDetail(id: string | undefined): UsePatriarchDetailResult {
  const [patriarch, setPatriarch] = useState<Patriarch | null>(null);
  const [events, setEvents] = useState<import('@/types').PatriarchEvent[]>([]);
  const [sources, setSources] = useState<import('@/types').PatriarchSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchDetail() {
      if (!isSupabaseConfigured) {
        setError('Supabase is not configured.');
        setLoading(false);
        return;
      }

      try {
        const [{ data: pData, error: pErr }, { data: eData, error: eErr }, { data: sData, error: sErr }] =
          await Promise.all([
            supabase.from('patriarchs').select('*').eq('id', id).maybeSingle(),
            supabase
              .from('patriarch_events')
              .select('*')
              .eq('patriarch_id', id)
              .order('sort_order', { ascending: true }),
            supabase
              .from('patriarch_sources')
              .select('*')
              .eq('patriarch_id', id)
              .order('created_at', { ascending: true }),
          ]);

        if (pErr) throw pErr;
        if (eErr) throw eErr;
        if (sErr) throw sErr;

        if (!cancelled) {
          setPatriarch(pData);
          setEvents(eData || []);
          setSources(sData || []);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load patriarch');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchDetail();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { patriarch, events, sources, loading, error };
}

interface UseStatsResult {
  stats: { patriarchs: number; centuries: number; events: number; sources: number };
  loading: boolean;
}

export function useStats(patriarchs: Patriarch[]): UseStatsResult {
  const [eventCount, setEventCount] = useState(0);
  const [sourceCount, setSourceCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }
      try {
        const [{ count: eCount }, { count: sCount }] = await Promise.all([
          supabase.from('patriarch_events').select('*', { count: 'exact', head: true }),
          supabase.from('patriarch_sources').select('*', { count: 'exact', head: true }),
        ]);
        setEventCount(eCount || 0);
        setSourceCount(sCount || 0);
      } catch {
        // silently fail — stats are supplementary
      } finally {
        setLoading(false);
      }
    }
    fetchCounts();
  }, []);

  const stats = useMemo(() => {
    const centuries = new Set(patriarchs.map((p) => p.century)).size;
    return {
      patriarchs: patriarchs.length,
      centuries,
      events: eventCount,
      sources: sourceCount,
    };
  }, [patriarchs, eventCount, sourceCount]);

  return { stats, loading };
}
