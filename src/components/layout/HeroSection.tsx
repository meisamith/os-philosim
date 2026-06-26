import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-gradient-radial from-indigo-500/15 via-emerald-500/5 to-transparent blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-5 pt-20 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300 mb-6"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
          University Operating Systems Project
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-5xl sm:text-7xl font-extrabold tracking-tight"
        >
          <span className="bg-gradient-to-r from-indigo-300 via-white to-emerald-300 bg-clip-text text-transparent">
            OS-PhiloSim
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="mt-5 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto"
        >
          Interactive Operating System Synchronization Laboratory. Watch processes deadlock,
          starve, and cooperate — in real time.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-9 flex items-center justify-center gap-3"
        >
          <Link
            to="/simulator"
            className="inline-flex items-center gap-2 px-5 h-11 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-medium shadow-lg shadow-indigo-500/30 transition-colors"
          >
            Launch Simulator <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/theory"
            className="inline-flex items-center gap-2 px-5 h-11 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-medium transition-colors"
          >
            Read the Theory
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
