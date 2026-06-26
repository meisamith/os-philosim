/**
 * React hook wrapping the SimulationEngine.
 *
 * - Engine is stored in a ref (mutable, not part of React state).
 * - A version counter forces re-renders at ~10Hz so the UI stays in sync with
 *   the engine state without subscribing every philosopher individually.
 * - Events are mirrored from the global eventBus into local state.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { SimulationEngine } from '../engine/simulation';
import { eventBus } from '../engine/eventBus';
import type { EngineContext, SimEvent, StrategyMode } from '../engine/types';

const DEFAULT_N = 5;
const DEFAULT_MODE: StrategyMode = 'SEMAPHORE';
const RENDER_INTERVAL_MS = 100;

export interface UseSimulationApi {
  context: EngineContext;
  events: SimEvent[];
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
  step: () => void;
  setSpeed: (s: number) => void;
  setMode: (m: StrategyMode) => void;
  setPhilosopherCount: (n: number) => void;
  setRandomTimings: (v: boolean) => void;
  philosopherCount: number;
  mode: StrategyMode;
  speed: number;
  randomTimings: boolean;
}

export function useSimulation(): UseSimulationApi {
  const engineRef = useRef<SimulationEngine | null>(null);
  if (engineRef.current === null) {
    engineRef.current = new SimulationEngine(DEFAULT_N, DEFAULT_MODE);
  }

  const [, setVersion] = useState(0);
  const [events, setEvents] = useState<SimEvent[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [philosopherCount, setPhilosopherCountState] = useState(DEFAULT_N);
  const [mode, setModeState] = useState<StrategyMode>(DEFAULT_MODE);
  const [speed, setSpeedState] = useState(1);
  const [randomTimings, setRandomTimingsState] = useState(true);

  // Mirror eventBus into local state. Use the buffer-replace approach to
  // batch updates and keep the EventLog scroll smooth.
  useEffect(() => {
    const unsub = eventBus.subscribe('*', () => {
      setEvents(eventBus.getBuffer());
    });
    setEvents(eventBus.getBuffer());
    return unsub;
  }, []);

  // Tick a re-render bump every RENDER_INTERVAL_MS so visuals follow engine.
  // Also sync isRunning — the engine can stop itself (e.g. on deadlock) without
  // going through the hook's pause() callback, so we poll the engine's RAF state.
  useEffect(() => {
    const id = window.setInterval(() => {
      setVersion((v) => (v + 1) % 1_000_000);
      if (engineRef.current?.getContext().isDeadlocked) {
        setIsRunning(false);
      }
    }, RENDER_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  const start = useCallback(() => {
    engineRef.current?.start();
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    engineRef.current?.pause();
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    engineRef.current?.reset(philosopherCount, mode);
    setEvents([]);
    setIsRunning(false);
  }, [philosopherCount, mode]);

  const step = useCallback(() => {
    engineRef.current?.pause();
    setIsRunning(false);
    engineRef.current?.step();
  }, []);

  const setSpeed = useCallback((s: number) => {
    engineRef.current?.setSpeed(s);
    setSpeedState(s);
  }, []);

  const setMode = useCallback((m: StrategyMode) => {
    engineRef.current?.setMode(m);
    setModeState(m);
    setEvents([]);
    setIsRunning(false);
  }, []);

  const setPhilosopherCount = useCallback(
    (n: number) => {
      engineRef.current?.reset(n, mode);
      setEvents([]);
      setIsRunning(false);
      setPhilosopherCountState(n);
    },
    [mode],
  );

  const setRandomTimings = useCallback((v: boolean) => {
    engineRef.current?.setRandomTimings(v);
    setRandomTimingsState(v);
  }, []);

  return {
    context: engineRef.current.getContext(),
    events,
    isRunning,
    start,
    pause,
    reset,
    step,
    setSpeed,
    setMode,
    setPhilosopherCount,
    setRandomTimings,
    philosopherCount,
    mode,
    speed,
    randomTimings,
  };
}
