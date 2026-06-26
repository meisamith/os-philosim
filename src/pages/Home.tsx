import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertOctagon, Lock } from 'lucide-react';

const MODES = [
  {
    icon: <AlertOctagon className="w-5 h-5 text-rose-400" />,
    title: 'Deadlock Demo',
    description:
      'Every philosopher grabs their left fork first, then waits for the right. When all are hungry simultaneously, a circular wait forms and nobody eats — forever.',
    accent: 'border-rose-500/30 bg-rose-500/5',
  },
  {
    icon: <Lock className="w-5 h-5 text-indigo-400" />,
    title: 'Semaphore Solution',
    description:
      'A binary semaphore guards each fork. A philosopher only picks up forks when both are free simultaneously (atomic check), eliminating partial acquisition and deadlock.',
    accent: 'border-indigo-500/30 bg-indigo-500/5',
  },
];

export function Home() {
  return (
    <main className="flex flex-col items-center px-5">
      <section className="w-full max-w-3xl pt-24 pb-16 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-white to-emerald-400 bg-clip-text text-transparent"
        >
          OS-PhiloSim
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-4 text-lg text-slate-400"
        >
          Visualizing the Dining Philosophers problem
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8"
        >
          <Link
            to="/simulator"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-base transition-colors shadow-lg shadow-indigo-600/30"
          >
            Launch Simulator
          </Link>
        </motion.div>
      </section>

      <section className="w-full max-w-3xl pb-24 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {MODES.map((m, i) => (
          <motion.div
            key={m.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.45 + i * 0.1 }}
            className={`glass rounded-2xl border p-6 ${m.accent}`}
          >
            <div className="flex items-center gap-3 mb-3">
              {m.icon}
              <h2 className="font-semibold text-white">{m.title}</h2>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">{m.description}</p>
          </motion.div>
        ))}
      </section>

      <footer className="border-t border-white/5 w-full py-6 text-center text-xs text-slate-500">
        Made by Amith Choudhary
      </footer>
    </main>
  );
}
