import type { PhilosopherState } from '../engine/types';

/** Concatenate className arguments, dropping falsy values. */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/** Format milliseconds as a short human-readable string (e.g. "1.23s"). */
export function formatMs(ms: number): string {
  if (ms < 1000) return `${ms.toFixed(0)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

/** Clamp a number to an inclusive [min, max] range. */
export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

/** Hex color used by the design system for a given philosopher state. */
export function getStateColor(state: PhilosopherState): string {
  switch (state) {
    case 'THINKING':
      return '#3b82f6';
    case 'HUNGRY':
      return '#f59e0b';
    case 'WAITING':
      return '#64748b';
    case 'EATING':
      return '#10b981';
  }
}

/** Capitalized human label for a state. */
export function getStateLabel(state: PhilosopherState): string {
  switch (state) {
    case 'THINKING':
      return 'Thinking';
    case 'HUNGRY':
      return 'Hungry';
    case 'WAITING':
      return 'Waiting';
    case 'EATING':
      return 'Eating';
  }
}
