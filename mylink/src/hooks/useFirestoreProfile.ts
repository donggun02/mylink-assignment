'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { firebaseConfigured } from '@/lib/firebase';
import { cloudError, loadRemoteProfile, saveRemoteProfile } from '@/lib/firestore-profile';
import type { ProfileData } from '@/lib/store';

type Status = 'local' | 'loading' | 'saved' | 'saving' | 'error';

export function useFirestoreProfile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [status, setStatus] = useState<Status>(firebaseConfigured ? 'loading' : 'local');
  const [error, setError] = useState('');
  const confirmed = useRef<ProfileData | null>(null);
  const pending = useRef<ProfileData | null>(null);
  const running = useRef(false);
  const alive = useRef(true);
  const loadGeneration = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flush = useCallback(async () => {
    if (running.current || !confirmed.current || !pending.current) return;
    running.current = true;
    if (alive.current) { setStatus('saving'); setError(''); }
    try {
      while (pending.current && confirmed.current) {
        const target: ProfileData = pending.current;
        await saveRemoteProfile(confirmed.current, target);
        confirmed.current = target;
        if (pending.current === target) pending.current = null;
      }
      if (alive.current) setStatus('saved');
    } catch (reason) {
      if (alive.current) { setError(cloudError(reason)); setStatus('error'); }
    } finally { running.current = false; }
  }, []);

  const reload = useCallback(async () => {
    if (!firebaseConfigured || running.current) return;
    if (pending.current) { await flush(); return; }
    const generation = ++loadGeneration.current;
    setStatus('loading'); setError('');
    try {
      const data = await loadRemoteProfile();
      if (!alive.current || generation !== loadGeneration.current) return;
      confirmed.current = data; setProfile(data); setStatus('saved');
    } catch (reason) {
      if (alive.current && generation === loadGeneration.current) { setError(cloudError(reason)); setStatus('error'); }
    }
  }, [flush]);

  useEffect(() => {
    alive.current = true;
    if (firebaseConfigured) void reload();
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (pending.current || running.current) { event.preventDefault(); event.returnValue = ''; }
    };
    window.addEventListener('beforeunload', beforeUnload);
    return () => {
      alive.current = false;
      window.removeEventListener('beforeunload', beforeUnload);
      if (timer.current) clearTimeout(timer.current);
      void flush();
    };
  }, [flush, reload]);

  function queue(next: ProfileData) {
    if (!firebaseConfigured || !confirmed.current) return;
    pending.current = structuredClone(next);
    setStatus('saving');
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => void flush(), 500);
  }

  return { configured: firebaseConfigured, profile, status, error, queue, reload };
}
