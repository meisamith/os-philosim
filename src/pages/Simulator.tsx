import { useEffect, useMemo, useState } from 'react';
import { BarChart3, Terminal } from 'lucide-react';
import { useSimulation } from '../hooks/useSimulation';
import { useToast } from '../components/ui/Toast';
import { ModeSelector } from '../components/simulator/ModeSelector';
import { Table } from '../components/simulator/Table';
import { ControlPanel } from '../components/simulator/ControlPanel';
import { EventLog } from '../components/simulator/EventLog';
import { StatsPanel } from '../components/simulator/StatsPanel';
import { ModeExplainer } from '../components/simulator/ModeExplainer';
import { Tabs } from '../components/ui/Tabs';
import { Card } from '../components/ui/Card';
import type { StrategyMode } from '../engine/types';

const SIDEBAR_TABS = [
  { id: 'events', label: 'Events', icon: <Terminal className="w-3.5 h-3.5" /> },
  { id: 'stats', label: 'Stats', icon: <BarChart3 className="w-3.5 h-3.5" /> },
];

export function Simulator() {
  const sim = useSimulation();
  const toast = useToast();
  const [sidebarTab, setSidebarTab] = useState<string>('events');

  const lastDeadlockCount = useMemo(() => ({ value: 0 }), []);

  useEffect(() => {
    if (sim.context.stats.deadlockCount > lastDeadlockCount.value) {
      lastDeadlockCount.value = sim.context.stats.deadlockCount;
      toast.push({
        type: 'error',
        title: 'Deadlock detected',
        message: 'All philosophers are stuck holding one fork — classic circular wait.',
      });
    }
  }, [sim.context.stats.deadlockCount, lastDeadlockCount, toast]);

  const handleModeChange = (m: StrategyMode): void => {
    sim.setMode(m);
    toast.push({ type: 'info', title: `Strategy switched to ${m}` });
  };

  return (
    <main className="max-w-7xl mx-auto px-5 py-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Simulator</h1>
        <p className="text-sm text-slate-400 mt-0.5">
          Choose a synchronization strategy and hit Start to run the simulation.
        </p>
      </div>

      <ModeSelector value={sim.mode} onChange={handleModeChange} />

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        <Card className="xl:col-span-3 !p-3 sm:!p-5">
          <Table context={sim.context} />
        </Card>

        <Card className="xl:col-span-2 flex flex-col min-h-[640px]">
          <Tabs items={SIDEBAR_TABS} activeId={sidebarTab} onChange={setSidebarTab} />
          <div className="mt-4 flex-1 min-h-0 overflow-hidden">
            {sidebarTab === 'events' && <EventLog events={sim.events} />}
            {sidebarTab === 'stats' && <StatsPanel context={sim.context} />}
          </div>
        </Card>
      </div>

      <ControlPanel
        isRunning={sim.isRunning}
        onStart={sim.start}
        onPause={sim.pause}
        onReset={sim.reset}
        speed={sim.speed}
        onSpeedChange={sim.setSpeed}
        philosopherCount={sim.philosopherCount}
        onPhilosopherCountChange={sim.setPhilosopherCount}
        randomTimings={sim.randomTimings}
        onRandomTimingsChange={sim.setRandomTimings}
      />

      <ModeExplainer mode={sim.mode} />
    </main>
  );
}
