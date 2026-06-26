import { Pause, Play, RefreshCw, Gauge } from 'lucide-react';
import { Button } from '../ui/Button';
import { Slider } from '../ui/Slider';
import { Switch } from '../ui/Switch';

export interface ControlPanelProps {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  speed: number;
  onSpeedChange: (s: number) => void;
  philosopherCount: number;
  onPhilosopherCountChange: (n: number) => void;
  randomTimings: boolean;
  onRandomTimingsChange: (v: boolean) => void;
}

const SPEED_STEPS = [0.5, 1, 2];

export function ControlPanel({
  isRunning,
  onStart,
  onPause,
  onReset,
  speed,
  onSpeedChange,
  philosopherCount,
  onPhilosopherCountChange,
  randomTimings,
  onRandomTimingsChange,
}: ControlPanelProps) {
  const speedIndex = Math.max(0, SPEED_STEPS.indexOf(speed) === -1 ? 1 : SPEED_STEPS.indexOf(speed));

  return (
    <div className="glass rounded-2xl border border-white/10 px-4 py-3 flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        {isRunning ? (
          <Button
            variant="secondary"
            size="md"
            leftIcon={<Pause className="w-4 h-4" />}
            onClick={onPause}
            className="!bg-amber-500/20 !text-amber-200 !border-amber-500/40 hover:!bg-amber-500/30"
          >
            Pause
          </Button>
        ) : (
          <Button
            variant="primary"
            size="md"
            leftIcon={<Play className="w-4 h-4" />}
            onClick={onStart}
            className="!bg-emerald-500 !border-emerald-400/60 hover:!bg-emerald-400"
          >
            Start
          </Button>
        )}
        <Button
          variant="secondary"
          size="md"
          leftIcon={<RefreshCw className="w-4 h-4" />}
          onClick={onReset}
        >
          Reset
        </Button>
      </div>

      <div className="h-8 w-px bg-white/10 hidden sm:block" />

      <div className="flex-1 min-w-[180px] max-w-xs">
        <Slider
          label={
            <span className="inline-flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5" /> Speed
            </span>
          }
          min={0}
          max={SPEED_STEPS.length - 1}
          step={1}
          value={speedIndex}
          onChange={(v) => onSpeedChange(SPEED_STEPS[Math.round(v)])}
          formatValue={(v) => `${SPEED_STEPS[Math.round(v)]}x`}
        />
      </div>

      <div className="flex-1 min-w-[180px] max-w-xs">
        <Slider
          label="Philosophers"
          min={5}
          max={7}
          step={1}
          value={philosopherCount}
          onChange={(v) => onPhilosopherCountChange(Math.round(v))}
          formatValue={(v) => `${Math.round(v)}`}
        />
      </div>

      <div className="ml-auto">
        <Switch
          checked={randomTimings}
          onChange={onRandomTimingsChange}
          label="Random timings"
        />
      </div>
    </div>
  );
}
