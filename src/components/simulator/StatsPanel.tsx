import type { EngineContext } from '../../engine/types';
import { formatMs } from '../../lib/utils';

export interface StatsPanelProps {
  context: EngineContext;
}

export function StatsPanel({ context }: StatsPanelProps) {
  const { stats, simTime, philosophers } = context;
  const totalMeals = stats.meals.reduce((a, b) => a + b, 0);
  const avgWait =
    stats.totalWaitTime.length === 0
      ? 0
      : stats.totalWaitTime.reduce((a, b) => a + b, 0) / stats.totalWaitTime.length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <KpiTile label="Sim Time" value={formatMs(simTime)} />
        <KpiTile label="Total Meals" value={String(totalMeals)} />
        <KpiTile label="Avg Wait" value={formatMs(avgWait)} />
        <KpiTile
          label="Deadlocks"
          value={String(stats.deadlockCount)}
          accent={stats.deadlockCount > 0 ? 'text-rose-300' : undefined}
        />
      </div>

      <div className="rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-white/5 text-slate-400 uppercase text-[10px] tracking-wider">
            <tr>
              <th className="text-left px-3 py-2 font-medium">Philo</th>
              <th className="text-right px-3 py-2 font-medium">Meals</th>
              <th className="text-right px-3 py-2 font-medium">Wait</th>
              <th className="text-right px-3 py-2 font-medium">Think</th>
              <th className="text-right px-3 py-2 font-medium">Eat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {philosophers.map((p) => (
              <tr key={p.id} className="text-slate-200 font-mono">
                <td className="px-3 py-1.5">{p.name}</td>
                <td className="px-3 py-1.5 text-right">{stats.meals[p.id]}</td>
                <td className="px-3 py-1.5 text-right text-slate-400">
                  {formatMs(stats.totalWaitTime[p.id])}
                </td>
                <td className="px-3 py-1.5 text-right text-blue-300">
                  {formatMs(stats.totalThinkingTime[p.id])}
                </td>
                <td className="px-3 py-1.5 text-right text-emerald-300">
                  {formatMs(stats.totalEatingTime[p.id])}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <div className="text-xs text-slate-400 mb-2">Fork Utilization</div>
        <div className="space-y-1.5">
          {context.forks.map((f) => {
            const totalSim = Math.max(simTime, 1);
            const pct = (stats.forkUtilization[f.id] / totalSim) * 100;
            const clamped = Math.min(100, Math.max(0, pct));
            return (
              <div key={f.id} className="flex items-center gap-2 text-[11px]">
                <span className="w-8 font-mono text-slate-400">F{f.id}</span>
                <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full bg-indigo-400/80"
                    style={{ width: `${clamped}%` }}
                  />
                </div>
                <span className="w-12 text-right font-mono text-slate-300">
                  {clamped.toFixed(0)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function KpiTile({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
      <div className={`mt-1 text-lg font-semibold font-mono ${accent ?? 'text-slate-100'}`}>
        {value}
      </div>
    </div>
  );
}
