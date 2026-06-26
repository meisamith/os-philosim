import { useEffect } from 'react';

export interface KeyHandlers {
  space?: () => void;
  r?: () => void;
  s?: () => void;
  keys1to4?: (n: number) => void;
  plus?: () => void;
  minus?: () => void;
  f?: () => void;
}

/**
 * Keyboard shortcut hook:
 *   Space      : toggle play/pause (via `space`)
 *   R          : reset
 *   S          : step
 *   1..4       : pick strategy index (1=DEADLOCK, 4=ORDERING)
 *   +/-        : adjust philosopher count
 *   F          : fullscreen toggle
 */
export function useKeyboardShortcuts(handlers: KeyHandlers): void {
  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      // Ignore when typing into an input/textarea/select.
      const target = e.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
        if (target.isContentEditable) return;
      }

      switch (e.key) {
        case ' ':
        case 'Spacebar':
          e.preventDefault();
          handlers.space?.();
          break;
        case 'r':
        case 'R':
          handlers.r?.();
          break;
        case 's':
        case 'S':
          handlers.s?.();
          break;
        case '+':
        case '=':
          handlers.plus?.();
          break;
        case '-':
        case '_':
          handlers.minus?.();
          break;
        case 'f':
        case 'F':
          handlers.f?.();
          break;
        case '1':
        case '2':
        case '3':
        case '4':
          handlers.keys1to4?.(parseInt(e.key, 10));
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handlers]);
}
