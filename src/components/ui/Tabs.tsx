import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ items, activeId, onChange, className }: TabsProps) {
  return (
    <div className={cn('flex items-center gap-1 border-b border-white/10', className)}>
      {items.map((item) => {
        const active = item.id === activeId;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={cn(
              'relative inline-flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors',
              active ? 'text-white' : 'text-slate-400 hover:text-slate-200',
            )}
          >
            {item.icon}
            <span>{item.label}</span>
            {active && (
              <motion.div
                layoutId="tab-underline"
                className="absolute -bottom-px left-0 right-0 h-0.5 bg-indigo-400"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
