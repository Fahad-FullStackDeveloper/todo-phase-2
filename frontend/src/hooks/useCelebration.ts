/**
 * Celebration Hook
 *
 * Manages celebration logic for task completions and milestones
 * - Confetti triggers with frequency capping
 * - Milestone detection
 * - Sound effects
 * - Reduced motion support
 */

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { triggerConfetti, triggerConfettiFromElement, useConfetti } from '@/components/celebrations/Confetti';
import { isMilestone, getNextMilestone } from '@/components/celebrations/MilestoneModal';
import { useSoundEffects } from '@/components/celebrations/SoundEffects';

interface UseCelebrationOptions {
  maxConfettiPerSession?: number;
  soundEnabled?: boolean;
  reducedMotion?: boolean;
}

interface UseCelebrationReturn {
  triggerCompletion: (element?: HTMLElement) => void;
  triggerMilestone: (streak: number) => void;
  shouldShowMilestoneModal: boolean;
  milestoneStreak: number | null;
  resetSession: () => void;
  confettiCount: number;
}

export function useCelebration(options: UseCelebrationOptions = {}): UseCelebrationReturn {
  const {
    maxConfettiPerSession = 5,
    soundEnabled = false,
    reducedMotion = false,
  } = options;

  const [shouldShowMilestoneModal, setShowMilestoneModal] = useState(false);
  const [milestoneStreak, setMilestoneStreak] = useState<number | null>(null);
  
  const { triggerWithCap, reset: resetConfetti, count: confettiCount } = useConfetti(maxConfettiPerSession);
  const { playSuccess, playMilestone } = useSoundEffects({ enabled: soundEnabled });

  // Check for reduced motion preference
  const prefersReducedMotion = reducedMotion || (
    typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  /**
   * Trigger celebration for task completion
   */
  const triggerCompletion = useCallback((element?: HTMLElement) => {
    // Trigger confetti (with frequency cap)
    if (!prefersReducedMotion) {
      if (element) {
        triggerConfettiFromElement(element, {
          particleCount: 30,
          spread: 50,
          startVelocity: 35,
        });
      } else {
        triggerWithCap({
          particleCount: 30,
          spread: 50,
          startVelocity: 35,
        });
      }
    }

    // Play sound
    playSuccess();
  }, [prefersReducedMotion, triggerWithCap, playSuccess]);

  /**
   * Trigger celebration for milestone
   */
  const triggerMilestone = useCallback((streak: number) => {
    if (isMilestone(streak)) {
      // Full confetti burst for milestones
      if (!prefersReducedMotion) {
        triggerConfetti({
          particleCount: 100,
          spread: 80,
          startVelocity: 50,
        });
      }

      // Play milestone sound
      playMilestone();

      // Show milestone modal
      setMilestoneStreak(streak);
      setShowMilestoneModal(true);
    }
  }, [prefersReducedMotion, playMilestone]);

  /**
   * Reset session (clear confetti count)
   */
  const resetSession = useCallback(() => {
    resetConfetti();
  }, [resetConfetti]);

  /**
   * Close milestone modal
   */
  const closeMilestoneModal = useCallback(() => {
    setShowMilestoneModal(false);
    setMilestoneStreak(null);
  }, []);

  return {
    triggerCompletion,
    triggerMilestone,
    shouldShowMilestoneModal,
    milestoneStreak,
    resetSession,
    confettiCount,
  };
}

/**
 * Hook to track completion count for frequency capping
 */
export function useCompletionTracker(maxPerSession = 5) {
  const [count, setCount] = useState(0);
  const sessionStartRef = useRef(Date.now());

  const increment = useCallback(() => {
    setCount(prev => {
      // Reset if session is older than 1 hour
      if (Date.now() - sessionStartRef.current > 60 * 60 * 1000) {
        sessionStartRef.current = Date.now();
        return 1;
      }
      return Math.min(prev + 1, maxPerSession);
    });
  }, [maxPerSession]);

  const reset = useCallback(() => {
    setCount(0);
    sessionStartRef.current = Date.now();
  }, []);

  const shouldCelebrate = count < maxPerSession;

  return { count, increment, reset, shouldCelebrate };
}
