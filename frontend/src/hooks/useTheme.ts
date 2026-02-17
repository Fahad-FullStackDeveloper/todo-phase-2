'use client';

/**
 * useTheme Hook
 *
 * Theme management hook using next-themes
 * Provides theme state and methods with localStorage persistence
 */

import { useEffect, useState, useCallback } from 'react';
import { useTheme as useNextTheme } from 'next-themes';

export type Theme = 'light' | 'dark' | 'system';

interface UseThemeReturn {
  theme: Theme;
  actualTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isDark: boolean;
  isLight: boolean;
  isLoading: boolean;
}

/**
 * Custom theme hook built on top of next-themes
 * Adds localStorage persistence and smooth transitions
 */
export function useTheme(): UseThemeReturn {
  const { theme, setTheme: setNextTheme, resolvedTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Wait for client-side hydration
  useEffect(() => {
    setMounted(true);
    setIsLoading(false);
  }, []);

  // Get the actual resolved theme (light or dark)
  const actualTheme = (resolvedTheme as 'light' | 'dark') || 'light';

  // Set theme with localStorage persistence
  const setTheme = useCallback(
    (newTheme: Theme) => {
      setNextTheme(newTheme);
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', newTheme);
      }
    },
    [setNextTheme]
  );

  // Toggle between light and dark
  const toggleTheme = useCallback(() => {
    const newTheme = actualTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }, [actualTheme, setTheme]);

  return {
    theme: (theme as Theme) || 'system',
    actualTheme,
    setTheme,
    toggleTheme,
    isDark: actualTheme === 'dark',
    isLight: actualTheme === 'light',
    isLoading: !mounted || isLoading,
  };
}

/**
 * Theme transition utility
 * Adds smooth transition class to document body
 */
export function enableThemeTransition(): void {
  if (typeof document !== 'undefined') {
    document.documentElement.style.setProperty('--theme-transition', 'all 300ms ease-in-out');
    document.documentElement.classList.add('theme-transition');
  }
}

/**
 * Disable theme transition (for instant theme changes)
 */
export function disableThemeTransition(): void {
  if (typeof document !== 'undefined') {
    document.documentElement.style.removeProperty('--theme-transition');
    document.documentElement.classList.remove('theme-transition');
  }
}

/**
 * Get system theme preference
 */
export function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Listen for system theme changes
 */
export function onSystemThemeChange(callback: (theme: 'light' | 'dark') => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleChange = (event: MediaQueryListEvent) => {
    callback(event.matches ? 'dark' : 'light');
  };

  mediaQuery.addEventListener('change', handleChange);
  return () => mediaQuery.removeEventListener('change', handleChange);
}
