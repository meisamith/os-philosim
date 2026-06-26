import { NavLink, Link } from 'react-router-dom';
import { GitBranch, Cpu } from 'lucide-react';
import { cn } from '../../lib/utils';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/simulator', label: 'Simulator' },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#0a0a0f]/70 border-b border-white/5">
      <nav className="max-w-7xl mx-auto px-5 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Cpu className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-indigo-300 via-white to-emerald-300 bg-clip-text text-transparent">
            OS-PhiloSim
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                cn(
                  'px-3 py-1.5 text-sm rounded-lg transition-colors',
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/5',
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="ml-2 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="GitHub"
          >
            <GitBranch className="w-4 h-4" />
          </a>
        </div>
      </nav>
    </header>
  );
}
