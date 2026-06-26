import { motion, AnimatePresence } from 'framer-motion';
import { AlertOctagon, Lock, Users, ArrowDownNarrowWide } from 'lucide-react';
import type { StrategyMode } from '../../engine/types';
import { Card } from '../ui/Card';

export interface ModeExplainerProps {
  mode: StrategyMode;
}

const CONTENT: Record<
  StrategyMode,
  { title: string; icon: typeof Lock; lead: string; body: React.ReactNode }
> = {
  DEADLOCK: {
    title: 'Why this deadlocks',
    icon: AlertOctagon,
    lead:
      'When all N philosophers grab their LEFT fork simultaneously, every philosopher then waits on a right fork that another philosopher already holds. This satisfies all four Coffman conditions at once.',
    body: (
      <pre className="font-mono text-[11px] leading-relaxed text-slate-300 bg-black/30 border border-white/10 rounded-xl p-3 overflow-x-auto">
{`P0 --(holds F0)--> waits F1
P1 --(holds F1)--> waits F2
P2 --(holds F2)--> waits F3
P3 --(holds F3)--> waits F4
P4 --(holds F4)--> waits F0
        ^________________|
            circular wait`}
      </pre>
    ),
  },
  SEMAPHORE: {
    title: 'Binary semaphores, atomic acquisition',
    icon: Lock,
    lead:
      'Each fork is wait(S)/signal(S) on a binary semaphore. A philosopher checks BOTH neighbours before committing — never holds one fork while waiting for the other. This eliminates Coffman condition #2 (hold-and-wait).',
    body: (
      <pre className="font-mono text-[11px] leading-relaxed text-slate-300 bg-black/30 border border-white/10 rounded-xl p-3 overflow-x-auto">
{`procedure eat(i):
  atomic {
    if S[left]==1 and S[right]==1:
      wait(S[left]); wait(S[right])
      return EATING
    else return WAITING
  }`}
      </pre>
    ),
  },
  WAITER: {
    title: 'Central waiter (monitor)',
    icon: Users,
    lead:
      'A single arbitrator grants "permission to dine". By capping concurrent diners at N-1, at least one fork is always free for SOME philosopher, breaking the circular wait.',
    body: (
      <pre className="font-mono text-[11px] leading-relaxed text-slate-300 bg-black/30 border border-white/10 rounded-xl p-3 overflow-x-auto">
{`monitor Waiter:
  activeDiners: 0
  procedure request(i):
    while activeDiners >= N-1: wait
    activeDiners++
  procedure release(i):
    activeDiners--; signal`}
      </pre>
    ),
  },
  ORDERING: {
    title: 'Resource hierarchy',
    icon: ArrowDownNarrowWide,
    lead:
      'Every philosopher acquires the LOWER-numbered fork before the higher one. The last philosopher reverses their natural order, breaking the cycle. This is Dijkstra\'s ordered-resource approach.',
    body: (
      <pre className="font-mono text-[11px] leading-relaxed text-slate-300 bg-black/30 border border-white/10 rounded-xl p-3 overflow-x-auto">
{`P0: F0 then F1
P1: F1 then F2
P2: F2 then F3
P3: F3 then F4
P4: F0 then F4   <-- reversed
   (lowest id first, always)`}
      </pre>
    ),
  },
};

export function ModeExplainer({ mode }: ModeExplainerProps) {
  const c = CONTENT[mode];
  const Icon = c.icon;
  return (
    <Card>
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col md:flex-row gap-5"
        >
          <div className="flex md:flex-col items-start gap-3 md:w-48 shrink-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-200">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-400">Strategy</div>
              <div className="font-semibold text-slate-100">{c.title}</div>
            </div>
          </div>
          <div className="flex-1 min-w-0 space-y-3">
            <p className="text-sm text-slate-300 leading-relaxed">{c.lead}</p>
            {c.body}
          </div>
        </motion.div>
      </AnimatePresence>
    </Card>
  );
}
