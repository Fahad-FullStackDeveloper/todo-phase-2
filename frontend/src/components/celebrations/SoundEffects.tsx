/**
 * SoundEffects Component
 *
 * Manages sound effects for celebrations
 * Sounds are generated programmatically using Web Audio API
 * Disabled by default, toggle in settings
 */

'use client';

import { useEffect, useCallback, useRef } from 'react';

interface SoundOptions {
  volume?: number;
  enabled?: boolean;
}

type SoundType = 'success' | 'milestone' | 'completion' | 'error';

/**
 * Generate a simple beep using Web Audio API
 */
function playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.3) {
  if (typeof window === 'undefined') return;
  
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = frequency;
  oscillator.type = type;
  
  gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
}

/**
 * Play success sound (ascending chime)
 */
function playSuccessSound(volume = 0.3) {
  const now = performance.now();
  
  // Play ascending notes
  setTimeout(() => playTone(523.25, 0.15, 'sine', volume), now); // C5
  setTimeout(() => playTone(659.25, 0.15, 'sine', volume), now + 100); // E5
  setTimeout(() => playTone(783.99, 0.2, 'sine', volume), now + 200); // G5
}

/**
 * Play milestone sound (fanfare)
 */
function playMilestoneSound(volume = 0.3) {
  const now = performance.now();
  
  // Play fanfare
  setTimeout(() => playTone(523.25, 0.2, 'triangle', volume), now); // C5
  setTimeout(() => playTone(523.25, 0.2, 'triangle', volume), now + 150);
  setTimeout(() => playTone(523.25, 0.2, 'triangle', volume), now + 300);
  setTimeout(() => playTone(659.25, 0.4, 'triangle', volume), now + 450); // E5
  setTimeout(() => playTone(783.99, 0.6, 'triangle', volume), now + 700); // G5
}

/**
 * Play completion sound (simple chime)
 */
function playCompletionSound(volume = 0.2) {
  playTone(880, 0.1, 'sine', volume); // A5
  setTimeout(() => playTone(1100, 0.15, 'sine', volume), 50); // C#6
}

/**
 * Play error sound (descending)
 */
function playErrorSound(volume = 0.2) {
  playTone(400, 0.15, 'sawtooth', volume);
  setTimeout(() => playTone(300, 0.2, 'sawtooth', volume), 100);
}

/**
 * Sound effects hook
 */
export function useSoundEffects(options: SoundOptions = {}) {
  const { volume = 0.3, enabled = false } = options;
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  const play = useCallback((type: SoundType) => {
    if (!enabledRef.current) return;
    
    // Also check global sound preference
    const soundEnabled = localStorage.getItem('sound_enabled') === 'true';
    if (!soundEnabled) return;

    switch (type) {
      case 'success':
        playSuccessSound(volume);
        break;
      case 'milestone':
        playMilestoneSound(volume);
        break;
      case 'completion':
        playCompletionSound(volume);
        break;
      case 'error':
        playErrorSound(volume);
        break;
    }
  }, [volume]);

  const playSuccess = useCallback(() => play('success'), [play]);
  const playMilestone = useCallback(() => play('milestone'), [play]);
  const playCompletion = useCallback(() => play('completion'), [play]);
  const playError = useCallback(() => play('error'), [play]);

  return {
    play,
    playSuccess,
    playMilestone,
    playCompletion,
    playError,
  };
}

/**
 * Check if sound is enabled
 */
export function isSoundEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('sound_enabled') === 'true';
}

/**
 * Toggle sound enabled state
 */
export function toggleSound(): boolean {
  if (typeof window === 'undefined') return false;
  const current = isSoundEnabled();
  localStorage.setItem('sound_enabled', (!current).toString());
  return !current;
}
