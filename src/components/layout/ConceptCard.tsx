import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

export interface ConceptCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function ConceptCard({ icon, title, description }: ConceptCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 240, damping: 22 }}
      className="glass rounded-2xl border border-white/10 p-5 hover:border-indigo-400/40 hover:shadow-xl hover:shadow-indigo-500/10 transition-colors"
    >
      <div className="h-10 w-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-200 flex items-center justify-center mb-3">
        {icon}
      </div>
      <h3 className="font-semibold text-slate-100 tracking-tight">{title}</h3>
      <p className="mt-1.5 text-sm text-slate-400 leading-relaxed">{description}</p>
    </motion.div>
  );
}
