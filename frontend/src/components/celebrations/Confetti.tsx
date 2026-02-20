/**
 * Confetti Component
 *
 * Triggers confetti animation on task completion
 * Uses canvas-confetti for performant particle effects
 * Respects prefers-reduced-motion
 */

'use client';

import { useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiOptions {
  particleCount?: number;
  spread?: number;
  startVelocity?: number;
  decay?: number;
  gravity?: number;
  colors?: string[];
  origin?: { x: number; y: number };
  disableForReducedMotion?: boolean;
}

const defaultColors = [
  '#EF4444', // red
  '#F59E0B', // amber
  '#10B981', // emerald
  '#3B82F6', // blue
  '#8B5CF6', // violet
  '#EC4899', // pink
];

/**
 * Trigger confetti burst
 */
export function triggerConfetti(options: ConfettiOptions = {}) {
  const {
    particleCount = 50,
    spread = 70,
    startVelocity = 45,
    decay = 0.9,
    gravity = 1,
    colors = defaultColors,
    origin = { x: 0.5, y: 0.5 },
    disableForReducedMotion = true,
  } = options;

  // Check for reduced motion preference
  if (disableForReducedMotion) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
  }

  confetti({
    particleCount,
    spread,
    startVelocity,
    decay,
    gravity,
    colors,
    origin,
  });
}

/**
 * Trigger confetti from specific element (e.g., checkbox)
 */
export function triggerConfettiFromElement(
  element: HTMLElement | null,
  options: ConfettiOptions = {}
) {
  if (!element) return;

  const rect = element.getBoundingClientRect();
  const x = (rect.left + rect.width / 2) / window.innerWidth;
  const y = (rect.top + rect.height / 2) / window.innerHeight;

  triggerConfetti({
    ...options,
    origin: { x, y },
  });
}

/**
 * Hook to manage confetti with frequency capping
 */
export function useConfetti(maxPerSession = 5) {
  const countRef = useRef(0);

  const triggerWithCap = useCallback((options?: ConfettiOptions) => {
    if (countRef.current >= maxPerSession) return false;
    
    triggerConfetti(options);
    countRef.current += 1;
    return true;
  }, [maxPerSession]);

  const reset = useCallback(() => {
    countRef.current = 0;
  }, []);

  return { triggerWithCap, reset, count: countRef.current };
}
