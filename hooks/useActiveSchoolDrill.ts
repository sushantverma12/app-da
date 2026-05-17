import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { Drill } from '@/types';
import { getActiveDrill } from '@/services/drills';
import { useAuthStore } from '@/store/authStore';

const POLL_MS = 4000;

/** Polls for an active drill for the logged-in user's school (works without push in Expo Go). */
export function useActiveSchoolDrill() {
  const user = useAuthStore((s) => s.user);
  const [drill, setDrill] = useState<Drill | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.schoolCode) {
      setDrill(null);
      return;
    }

    let cancelled = false;

    const poll = async () => {
      setLoading(true);
      try {
        const active = await getActiveDrill(user.schoolCode);
        if (!cancelled) setDrill(active);
      } catch {
        if (!cancelled) setDrill(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    poll();
    const interval = setInterval(poll, POLL_MS);
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') void poll();
    });

    return () => {
      cancelled = true;
      clearInterval(interval);
      sub.remove();
    };
  }, [user?.schoolCode]);

  return { drill, loading };
}
