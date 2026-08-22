'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// 20 minutes in milliseconds
const INACTIVITY_TIMEOUT_MS = 20 * 60 * 1000;
const CHECK_INTERVAL_MS = 10 * 1000; // Check every 10 seconds
const STORAGE_KEY = 'stl_admin_last_activity';

export function AdminInactivityGuard() {
  const router = useRouter();
  const isLoggingOut = useRef(false);

  const performLogout = useCallback(async () => {
    if (isLoggingOut.current) return;
    isLoggingOut.current = true;

    try {
      // Clear server session cookie
      await fetch('/api/admin/auth', { method: 'DELETE' });
    } catch (err) {
      console.error('Inactivity logout error:', err);
    } finally {
      localStorage.removeItem(STORAGE_KEY);
      router.push('/admin/login?reason=inactive');
      router.refresh();
    }
  }, [router]);

  const recordActivity = useCallback(() => {
    if (isLoggingOut.current) return;
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
  }, []);

  useEffect(() => {
    // Record initial activity
    recordActivity();

    // Event listeners to track active user engagement
    const activityEvents = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'wheel'];

    const handleUserActivity = () => {
      recordActivity();
    };

    activityEvents.forEach((event) => {
      window.addEventListener(event, handleUserActivity, { passive: true });
    });

    // Interval checker for inactivity
    const intervalId = setInterval(() => {
      const lastActivityStr = localStorage.getItem(STORAGE_KEY);
      const lastActivity = lastActivityStr ? parseInt(lastActivityStr, 10) : Date.now();
      const elapsed = Date.now() - lastActivity;

      if (elapsed >= INACTIVITY_TIMEOUT_MS) {
        performLogout();
      }
    }, CHECK_INTERVAL_MS);

    // Also check immediately when tab gains focus / visibility
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const lastActivityStr = localStorage.getItem(STORAGE_KEY);
        if (lastActivityStr) {
          const elapsed = Date.now() - parseInt(lastActivityStr, 10);
          if (elapsed >= INACTIVITY_TIMEOUT_MS) {
            performLogout();
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(intervalId);
    };
  }, [recordActivity, performLogout]);

  return null;
}
