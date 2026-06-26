import { motion, AnimatePresence } from 'framer-motion';
import type { EngineContext } from '../../engine/types';
import { Philosopher } from './Philosopher';
import { Fork } from './Fork';

export interface TableProps {
  context: EngineContext;
  onPhilosopherClick?: (id: number) => void;
}

const VIEW = 600;
const CENTER = VIEW / 2;
const PHILO_RADIUS = 220;
const FORK_RADIUS = 150;

/**
 * Master visualization. Lays out philosophers around a circle and forks
 * between them. Pure SVG so it scales crisply at any size.
 */
export function Table({ context, onPhilosopherClick }: TableProps) {
  const n = context.philosophers.length;

  return (
    <div className="relative w-full aspect-square max-w-[640px] mx-auto">
      <svg viewBox={`0 0 ${VIEW} ${VIEW}`} className="w-full h-full">
        <defs>
          <radialGradient id="tableGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(99,102,241,0.18)" />
            <stop offset="60%" stopColor="rgba(99,102,241,0.05)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.0)" />
          </radialGradient>
          <radialGradient id="tableInner" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.06)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
          </radialGradient>
        </defs>

        {/* Backdrop glow */}
        <circle cx={CENTER} cy={CENTER} r={260} fill="url(#tableGrad)" />

        {/* Table top */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={120}
          fill="url(#tableInner)"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={1.5}
        />
        <circle
          cx={CENTER}
          cy={CENTER}
          r={90}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={1}
          strokeDasharray="3 6"
        />
        <text
          x={CENTER}
          y={CENTER + 4}
          textAnchor="middle"
          className="fill-slate-500 text-xs font-mono uppercase tracking-[0.2em]"
        >
          {context.mode}
        </text>

        {/* Forks (drawn first so philosophers appear on top) */}
        {context.forks.map((f) => {
          // Fork i sits between philo i and philo (i+1)%n. Use the midpoint angle.
          const a1 = (f.id / n) * Math.PI * 2 - Math.PI / 2;
          const a2 = (((f.id + 1) % n) / n) * Math.PI * 2 - Math.PI / 2;
          // Average angle, taking the shorter arc.
          let mid = (a1 + a2) / 2;
          if (Math.abs(a1 - a2) > Math.PI) {
            mid += Math.PI;
          }
          const cx = CENTER + Math.cos(mid) * FORK_RADIUS;
          const cy = CENTER + Math.sin(mid) * FORK_RADIUS;
          const angleDeg = (mid * 180) / Math.PI + 90;
          const holder =
            f.ownerId !== null ? context.philosophers[f.ownerId] : undefined;
          return (
            <Fork key={f.id} fork={f} cx={cx} cy={cy} angleDeg={angleDeg} holder={holder} />
          );
        })}

        {/* Philosophers */}
        {context.philosophers.map((p) => {
          const angle = (p.id / n) * Math.PI * 2 - Math.PI / 2;
          const cx = CENTER + Math.cos(angle) * PHILO_RADIUS;
          const cy = CENTER + Math.sin(angle) * PHILO_RADIUS;
          return (
            <Philosopher
              key={p.id}
              philo={p}
              cx={cx}
              cy={cy}
              isDeadlocked={context.isDeadlocked}
              onClick={onPhilosopherClick}
            />
          );
        })}
      </svg>

      {/* Deadlock overlay — shown when engine sets isDeadlocked */}
      <AnimatePresence>
        {context.isDeadlocked && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl"
            style={{ background: 'rgba(10,10,15,0.82)', backdropFilter: 'blur(6px)' }}
          >
            <motion.div
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              className="text-5xl mb-4 select-none"
            >
              ❌
            </motion.div>
            <div className="text-2xl font-extrabold text-rose-400 tracking-tight">
              DEADLOCK DETECTED
            </div>
            <div className="mt-2 text-sm text-slate-400 text-center max-w-[260px] leading-relaxed">
              All philosophers hold their left fork and wait for right.
              <br />
              <span className="text-rose-300 font-medium">Circular wait — system frozen.</span>
            </div>
            <div className="mt-4 px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 font-mono">
              Reset to try a different strategy
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
