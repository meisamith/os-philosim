/**
 * OS-PhiloSim: Core Type Definitions
 * ----------------------------------
 * All shared types used across the simulation engine, strategies, and UI live here.
 * Strict TypeScript is enforced: every field is typed and unions are discriminated.
 */

/** All possible states a philosopher can be in (deadlock is derived, not stored). */
export type PhilosopherState = 'THINKING' | 'HUNGRY' | 'WAITING' | 'EATING';

/** All strategies the engine can run with. */
export type StrategyMode = 'DEADLOCK' | 'SEMAPHORE';

/**
 * A fork represents a shared resource on the table.
 * - `value`: 1 = available, 0 = held (binary semaphore semantics).
 * - `ownerId`: which philosopher currently holds it (null if free).
 */
export interface Fork {
  id: number;
  value: 0 | 1;
  ownerId: number | null;
}

/**
 * A philosopher is an autonomous "process" that cycles through states.
 * - `leftForkId`, `rightForkId`: the two adjacent forks they need.
 * - `heldForks`: ids of forks currently in possession (0, 1, or 2).
 * - `stateTimer`: time remaining (in sim ms) before the current state expires.
 * - `thinkingDuration` / `eatingDuration`: randomized per cycle, used when transitioning.
 */
export interface Philosopher {
  id: number;
  name: string;
  state: PhilosopherState;
  leftForkId: number;
  rightForkId: number;
  heldForks: number[];
  stateTimer: number;
  thinkingDuration: number;
  eatingDuration: number;
}

/** A loggable event emitted from the engine. */
export interface SimEvent {
  timestamp: number;
  philosopherId: number | null;
  type: string;
  message: string;
  color: string;
}

/** Aggregated statistics tracked over a run. */
export interface SimStats {
  meals: number[];
  totalWaitTime: number[];
  totalHungryTime: number[];
  totalThinkingTime: number[];
  totalEatingTime: number[];
  deadlockCount: number;
  forkUtilization: number[];
  simTime: number;
}

/** The full simulation context passed to strategies and exposed to the UI. */
export interface EngineContext {
  philosophers: Philosopher[];
  forks: Fork[];
  stats: SimStats;
  mode: StrategyMode;
  simTime: number;
  isDeadlocked: boolean;
  waitingTime: number[];
}

/**
 * A strategy implements a synchronization policy. It decides whether a hungry
 * philosopher may acquire forks, and how forks are released after eating.
 */
export interface Strategy {
  name: string;
  description: string;
  tryAcquire: (philo: Philosopher, forks: Fork[], ctx: EngineContext) => boolean;
  release: (philo: Philosopher, forks: Fork[], ctx: EngineContext) => void;
}
