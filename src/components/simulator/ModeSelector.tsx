import { motion } from 'framer-motion';
import { AlertOctagon, Lock } from 'lucide-react';
import type { StrategyMode } from '../../engine/types';
import { cn } from '../../lib/utils';

export interface ModeSelectorProps {
  value: StrategyMode;
  onChange: (m: StrategyMode) => void;
}

interface ModeOption {
  id: StrategyMode;
  title: string;
  description: string;
  icon: typeof Lock;
  accent: string;
}

const MODES: ModeOption[] = [
  {
    id: 'DEADLOCK',
    title: 'Deadlock Demo',
    description: 'Naive left-first pickup. Watch the circular wait emerge.',
    icon: AlertOctagon,
    accent: 'from-rose-500/30 to-rose-700/10 border-rose-500/40 text-rose-200',
  },
  {
    id: 'SEMAPHORE',
    title: 'Binary Semaphore',
    description: 'Atomic acquisition of both forks. No partial state.',
    icon: Lock,
    accent: 'from-indigo-500/30 to-indigo-700/10 border-indigo-500/40 text-indigo-200',
  },
];

export function ModeSelector({ value, onChange }: ModeSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {MODES.map((m) => {
        const Icon = m.icon;
        const active = m.id === value;
        return (
          <motion.button
            key={m.id}
            type="button"
            onClick={() => onChange(m.id)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              'group relative text-left rounded-2xl border p-4 transition-all duration-150',
              'bg-gradient-to-br',
              active
                ? cn(m.accent, 'shadow-lg ring-2 ring-white/10')
                : 'from-white/[0.03] to-white/[0.01] border-white/10 text-slate-300 hover:border-white/20',
            )}
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-xl border',
                  active ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/10',
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold tracking-tight">{m.title}</div>
                <div
                  className={cn(
                    'mt-0.5 text-xs leading-snug',
                    active ? 'opacity-90' : 'text-slate-400',
                  )}
                >
                  {m.description}
                </div>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
