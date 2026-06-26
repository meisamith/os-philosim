import { motion } from 'framer-motion';
import type { Philosopher as PhiloData } from '../../engine/types';
import { getStateColor, getStateLabel } from '../../lib/utils';

export interface PhilosopherProps {
  philo: PhiloData;
  cx: number;
  cy: number;
  isDeadlocked: boolean;
  onClick?: (id: number) => void;
}

/** Single philosopher node. Color and animation depend on FSM state. */
export function Philosopher({ philo, cx, cy, isDeadlocked, onClick }: PhilosopherProps) {
  const stateColor = isDeadlocked ? '#f43f5e' : getStateColor(philo.state);
  const label = isDeadlocked ? 'Deadlock' : getStateLabel(philo.state);

  // Animation per state.
  const ringAnimate =
    philo.state === 'HUNGRY' || isDeadlocked
      ? { scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }
      : philo.state === 'EATING'
      ? { scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }
      : { scale: 1, opacity: 0.3 };

  const ringTransition =
    philo.state === 'EATING'
      ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' as const }
      : { duration: 0.9, repeat: Infinity, ease: 'easeInOut' as const };

  const bodyScale = philo.state === 'EATING' ? 1.08 : 1;

  return (
    <g
      transform={`translate(${cx} ${cy})`}
      onClick={() => onClick?.(philo.id)}
      style={{ cursor: 'pointer' }}
    >
      <motion.circle
        r={36}
        fill={stateColor}
        animate={ringAnimate}
        transition={ringTransition}
        style={{ filter: `drop-shadow(0 0 12px ${stateColor})`, opacity: 0.3 }}
      />
      <motion.circle
        r={26}
        animate={{
          scale: bodyScale,
          fill: stateColor,
        }}
        transition={{ type: 'spring', stiffness: 240, damping: 20 }}
        stroke="rgba(255,255,255,0.25)"
        strokeWidth={2}
      />
      <text
        textAnchor="middle"
        dy={5}
        className="fill-white font-bold text-sm pointer-events-none select-none"
      >
        {philo.name}
      </text>
      <text
        textAnchor="middle"
        y={56}
        className="fill-slate-200 text-[11px] font-medium pointer-events-none select-none"
      >
        {label}
      </text>
      {philo.heldForks.length > 0 && (
        <text
          textAnchor="middle"
          y={72}
          className="fill-slate-400 text-[9px] font-mono pointer-events-none select-none"
        >
          forks: {philo.heldForks.join(',')}
        </text>
      )}
    </g>
  );
}
