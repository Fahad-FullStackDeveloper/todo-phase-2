/**
 * Connection Status Hook
 *
 * Monitors online/offline status
 */

'use client';

import { useState, useEffect } from 'react';

interface UseConnectionStatusReturn {
  isOnline: boolean;
  isOffline: boolean;
  lastOnlineTime: Date | null;
}

export function useConnectionStatus(): UseConnectionStatusReturn {
  const [isOnline, setIsOnline] = useState(true);
  const [lastOnlineTime, setLastOnlineTime] = useState<Date | null>(null);

  useEffect(() => {
    // Initial check
    setIsOnline(navigator.onLine);
    if (navigator.onLine) {
      setLastOnlineTime(new Date());
    }

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      setLastOnlineTime(new Date());
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    isOnline,
    isOffline: !isOnline,
    lastOnlineTime,
  };
}

/**
 * Check if connection is stable (not flapping)
 */
export function useStableConnection(threshold = 3000): boolean {
  const [isStable, setIsStable] = useState(true);
  const { isOnline } = useConnectionStatus();

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isOnline) {
      timeout = setTimeout(() => {
        setIsStable(true);
      }, threshold);
    } else {
      setIsStable(false);
    }

    return () => clearTimeout(timeout);
  }, [isOnline, threshold]);

  return isStable;
}
