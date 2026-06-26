import { useEffect, useRef } from 'react';
import type { SimEvent } from '../../engine/types';
import { formatMs } from '../../lib/utils';

export interface EventLogProps {
  events: SimEvent[];
}

const MAX_SHOWN = 200;

export function EventLog({ events }: EventLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const slice = events.slice(-MAX_SHOWN);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [slice.length]);

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="text-xs text-slate-400 font-mono mb-2">{slice.length} entries</div>
      <div
        ref={scrollRef}
        className="max-h-[500px] overflow-y-auto rounded-xl border border-white/10 bg-black/30 p-2 font-mono text-[11px] leading-relaxed"
      >
        {slice.length === 0 && (
          <div className="text-slate-500 text-center py-8">No events yet. Press Start.</div>
        )}
        {slice.map((e, i) => (
          <div key={i} className="flex items-start gap-2 py-0.5">
            <span className="text-slate-500 shrink-0 w-16 text-right">
              {formatMs(e.timestamp)}
            </span>
            <span
              className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: e.color }}
            />
            <span className="text-slate-200 break-words">{e.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
