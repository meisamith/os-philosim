import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import type { PhilosopherState } from '../../engine/types';

type Variant = PhilosopherState | 'DEADLOCK' | 'NEUTRAL' | 'INFO';

export interface BadgeProps {
  variant?: Variant;
  children: ReactNode;
  className?: string;
}

const STYLES: Record<Variant, string> = {
  THINKING: 'bg-blue-500/15 text-blue-300 border-blue-500/40',
  HUNGRY: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
  WAITING: 'bg-slate-500/15 text-slate-300 border-slate-500/40',
  EATING: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
  DEADLOCK: 'bg-rose-500/15 text-rose-300 border-rose-500/40',
  NEUTRAL: 'bg-white/5 text-slate-300 border-white/10',
  INFO: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/40',
};

export function Badge({ variant = 'NEUTRAL', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
        STYLES[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
