import type { ChangeEvent, ReactNode } from 'react';
import { cn } from '../../lib/utils';

export interface SliderProps {
  label?: ReactNode;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (v: number) => void;
  formatValue?: (v: number) => string;
  className?: string;
}

export function Slider({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  formatValue,
  className,
}: SliderProps) {
  const onInput = (e: ChangeEvent<HTMLInputElement>): void => {
    onChange(parseFloat(e.target.value));
  };
  const displayed = formatValue ? formatValue(value) : value.toString();
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {(label || formatValue) && (
        <div className="flex items-center justify-between text-xs text-slate-400">
          {label && <span>{label}</span>}
          <span className="font-mono text-slate-200">{displayed}</span>
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onInput}
        className="w-full accent-indigo-500 h-1.5 cursor-pointer appearance-none rounded-full bg-white/10
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-indigo-400
          [&::-webkit-slider-thumb]:shadow-md
          [&::-webkit-slider-thumb]:shadow-indigo-500/40
          [&::-webkit-slider-thumb]:border
          [&::-webkit-slider-thumb]:border-white/20"
      />
    </div>
  );
}
