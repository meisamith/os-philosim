import { motion } from 'framer-motion';
import type { Fork as ForkData, Philosopher } from '../../engine/types';
import { getStateColor } from '../../lib/utils';

export interface ForkProps {
  fork: ForkData;
  cx: number;
  cy: number;
  angleDeg: number;
  holder?: Philosopher;
}

/**
 * Single fork on the table. Renders a small bar oriented along the table edge.
 * When held, it lights up with the holder's state color.
 */
export function Fork({ fork, cx, cy, angleDeg, holder }: ForkProps) {
  const isHeld = fork.value === 0;
  const color = holder ? getStateColor(holder.state) : '#94a3b8';

  return (
    <g transform={`translate(${cx} ${cy}) rotate(${angleDeg})`}>
      <motion.rect
        x={-3}
        y={-18}
        width={6}
        height={36}
        rx={2}
        animate={{
          fill: isHeld ? color : '#cbd5e1',
          opacity: isHeld ? 1 : 0.85,
        }}
        transition={{ duration: 0.25 }}
        style={{
          filter: isHeld ? `drop-shadow(0 0 8px ${color})` : undefined,
        }}
      />
      <text
        y={32}
        textAnchor="middle"
        transform={`rotate(${-angleDeg})`}
        className="fill-slate-400 text-[9px] font-mono"
      >
        F{fork.id}
      </text>
    </g>
  );
}
