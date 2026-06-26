/**
 * OS-PhiloSim: Simulation Engine
 * ==============================
 * The core finite-state-machine driving every philosopher.
 *
 * Time model
 * ----------
 * The engine ticks on requestAnimationFrame. Real wall-clock delta is scaled
 * by `speedMultiplier` to produce a "simulation delta" expressed in ms of
 * simulated time. All counters (state timers, sim time, statistics) operate
 * in simulated time so that the 1x speed corresponds to real time.
 *
 * FSM
 * ---
 *  THINKING ---(timer expires)---> HUNGRY
 *  HUNGRY   ---(strategy.tryAcquire == true)---> EATING
 *           ---(false, picks up partial fork)---> WAITING
 *  WAITING  ---(strategy.tryAcquire == true)---> EATING
 *  EATING   ---(timer expires)---> THINKING (release forks)
 *
 * Deadlock detection
 * ------------------
 * If every philosopher has been in WAITING (with at least one held fork) for
 * more than DEADLOCK_THRESHOLD ms of sim time, we flag a deadlock and emit a
 * DEADLOCK event. The strategy is responsible for whether this can happen at
 * all - only the DEADLOCK demo strategy permits it in practice.
 */

import type {
  EngineContext,
  Fork,
  Philosopher,
  PhilosopherState,
  SimStats,
  StrategyMode,
} from './types';
import { strategies } from './strategies';
import { eventBus } from './eventBus';
import { createStats, updateStats } from './stats';

/** Sim ms of "stuck WAITING" before we declare a deadlock. */
const DEADLOCK_THRESHOLD = 2000;

/** Default thinking / eating duration ranges, in sim ms. */
const THINK_MIN = 2000;
const THINK_MAX = 5000;
const EAT_MIN = 1500;
const EAT_MAX = 3500;

/** Single tick of forced "step" mode (in sim ms). */
const STEP_TICK_MS = 100;

/** Pick a uniformly random duration within [min, max]. */
function randDuration(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

/** Color helper - matches the design system. */
const COLORS: Record<PhilosopherState | 'DEADLOCK' | 'INFO', string> = {
  THINKING: '#3b82f6',
  HUNGRY: '#f59e0b',
  WAITING: '#64748b',
  EATING: '#10b981',
  DEADLOCK: '#f43f5e',
  INFO: '#6366f1',
};

export class SimulationEngine {
  private ctx: EngineContext;
  private lastTime: number;
  private rafId: number | null = null;
  private speedMultiplier: number = 1;
  private deadlockTimer: number = 0;
  private randomTimings: boolean = true;

  constructor(n: number, mode: StrategyMode) {
    this.lastTime = 0;
    this.ctx = {
      philosophers: [],
      forks: [],
      stats: createStats(n),
      mode,
      simTime: 0,
      isDeadlocked: false,
      waitingTime: new Array<number>(n).fill(0),
    };
    this.init(n);
  }

  /**
   * Build N philosophers seated at a circular table.
   * Fork i sits between philosopher i and philosopher (i+1) % n, so:
   *   philosopher i has left fork = i, right fork = (i+1) % n.
   */
  private init(n: number): void {
    const forks: Fork[] = [];
    for (let i = 0; i < n; i++) {
      forks.push({ id: i, value: 1, ownerId: null });
    }
    // In DEADLOCK mode all philosophers start directly in HUNGRY state so that
    // every single one calls tryAcquire on the very first tick.  If even one
    // philosopher is still THINKING while others are HUNGRY, it will find both
    // neighbours' forks free and eat before the circle closes — breaking the
    // circular-wait condition.  Starting in HUNGRY guarantees that all N
    // philosophers grab their left fork in tick 1, setting up the deadlock.
    const isDeadlockMode = this.ctx.mode === 'DEADLOCK';
    const philosophers: Philosopher[] = [];
    for (let i = 0; i < n; i++) {
      philosophers.push({
        id: i,
        name: `P${i}`,
        state: isDeadlockMode ? 'HUNGRY' : 'THINKING',
        leftForkId: i,
        rightForkId: (i + 1) % n,
        heldForks: [],
        stateTimer: isDeadlockMode ? 0 : randDuration(THINK_MIN, THINK_MAX),
        thinkingDuration: randDuration(THINK_MIN, THINK_MAX),
        eatingDuration: randDuration(EAT_MIN, EAT_MAX),
      });
    }
    this.ctx.philosophers = philosophers;
    this.ctx.forks = forks;
    this.ctx.waitingTime = new Array<number>(n).fill(0);
    this.ctx.stats = createStats(n);
    this.ctx.simTime = 0;
    this.ctx.isDeadlocked = false;
    this.deadlockTimer = 0;
  }

  /**
   * Advance the simulation by `deltaMs` of WALL CLOCK time. The internal
   * speed multiplier converts this into a simulated delta.
   */
  tick(deltaMs: number): void {
    // Guard: after deadlock the RAF is already cancelled; this path is only
    // reachable via the step() call. Return immediately — nothing moves.
    if (this.ctx.isDeadlocked) return;

    const simDelta = deltaMs * this.speedMultiplier;
    this.ctx.simTime += simDelta;
    this.ctx.stats.simTime = this.ctx.simTime;

    // Per-philosopher FSM tick.
    this.ctx.philosophers.forEach((p) => this.tickPhilosopher(p, simDelta));

    // Fork utilization snapshot: fraction of forks currently held.
    this.ctx.forks.forEach((f) => {
      if (f.value === 0) {
        this.ctx.stats.forkUtilization[f.id] += simDelta;
      }
    });

    // Detect deadlock condition AFTER all transitions.
    this.checkDeadlock(simDelta);
  }

  /**
   * Per-philosopher state-machine transition. Mutates the philosopher and
   * forks array in place and emits SimEvents for any transition.
   */
  private tickPhilosopher(philo: Philosopher, simDelta: number): void {
    const strategy = strategies[this.ctx.mode];
    philo.stateTimer -= simDelta;

    switch (philo.state) {
      case 'THINKING': {
        // Counter for time spent in current state.
        updateStats(this.ctx.stats, philo, 'THINKING', simDelta);
        if (philo.stateTimer <= 0) {
          philo.state = 'HUNGRY';
          philo.stateTimer = 0;
          this.emit('STATE', philo.id, `${philo.name} is HUNGRY`, COLORS.HUNGRY);
        }
        break;
      }

      case 'HUNGRY': {
        updateStats(this.ctx.stats, philo, 'HUNGRY', simDelta);
        const acquired = strategy.tryAcquire(philo, this.ctx.forks, this.ctx);
        if (acquired) {
          updateStats(this.ctx.stats, philo, 'EATING', 0);
          philo.state = 'EATING';
          philo.eatingDuration = this.nextEatDuration();
          philo.stateTimer = philo.eatingDuration;
          this.emit('EAT', philo.id, `${philo.name} starts EATING`, COLORS.EATING);
        } else if (philo.heldForks.length > 0) {
          // Holds one fork but can't get the other -> WAITING.
          philo.state = 'WAITING';
          this.emit(
            'WAIT',
            philo.id,
            `${philo.name} holds fork ${philo.heldForks[0]} and waits`,
            COLORS.WAITING,
          );
        }
        break;
      }

      case 'WAITING': {
        updateStats(this.ctx.stats, philo, 'WAITING', simDelta);
        const acquired = strategy.tryAcquire(philo, this.ctx.forks, this.ctx);
        if (acquired) {
          updateStats(this.ctx.stats, philo, 'EATING', 0);
          philo.state = 'EATING';
          philo.eatingDuration = this.nextEatDuration();
          philo.stateTimer = philo.eatingDuration;
          this.emit('EAT', philo.id, `${philo.name} starts EATING`, COLORS.EATING);
        }
        break;
      }

      case 'EATING': {
        updateStats(this.ctx.stats, philo, 'EATING', simDelta);
        if (philo.stateTimer <= 0) {
          strategy.release(philo, this.ctx.forks, this.ctx);
          philo.state = 'THINKING';
          philo.thinkingDuration = this.nextThinkDuration();
          philo.stateTimer = philo.thinkingDuration;
          this.emit('THINK', philo.id, `${philo.name} returns to THINKING`, COLORS.THINKING);
        }
        break;
      }
    }
  }

  private nextThinkDuration(): number {
    return this.randomTimings ? randDuration(THINK_MIN, THINK_MAX) : (THINK_MIN + THINK_MAX) / 2;
  }

  private nextEatDuration(): number {
    return this.randomTimings ? randDuration(EAT_MIN, EAT_MAX) : (EAT_MIN + EAT_MAX) / 2;
  }

  /**
   * Deadlock detector: only active in DEADLOCK Demo mode.
   * Every philosopher must be WAITING holding exactly 1 fork (their left).
   * When this holds for > DEADLOCK_THRESHOLD ms of sim time, we declare
   * deadlock, freeze the tick loop, and emit a DEADLOCK event.
   *
   * Semaphore mode intentionally never enters this condition (no partial
   * acquisition), so deadlock detection is disabled there to avoid false
   * positives when the user switches modes mid-run.
   */
  private checkDeadlock(simDelta: number): void {
    // Only the DEADLOCK Demo strategy can produce a deadlock — skip for all others.
    if (this.ctx.mode !== 'DEADLOCK') {
      this.deadlockTimer = 0;
      return;
    }

    const all = this.ctx.philosophers;
    const stuck =
      all.length > 0 &&
      all.every(
        (p) =>
          p.state === 'WAITING' &&
          p.heldForks.length === 1,
      );

    if (stuck) {
      this.deadlockTimer += simDelta;
      if (this.deadlockTimer >= DEADLOCK_THRESHOLD && !this.ctx.isDeadlocked) {
        this.ctx.isDeadlocked = true;
        this.ctx.stats.deadlockCount += 1;
        this.emit(
          'DEADLOCK',
          null,
          `DEADLOCK detected! All ${all.length} philosophers hold their left fork and wait forever.`,
          COLORS.DEADLOCK,
        );
        // Stop the RAF loop — simulation is permanently frozen.
        this.pause();
      }
    } else {
      this.deadlockTimer = 0;
    }
  }

  /** Publish a SimEvent to the global eventBus. */
  private emit(type: string, philosopherId: number | null, message: string, color: string): void {
    eventBus.publish({
      timestamp: this.ctx.simTime,
      philosopherId,
      type,
      message,
      color,
    });
  }

  /** Kick off the requestAnimationFrame loop. */
  start(): void {
    if (this.rafId !== null) return;
    this.lastTime = performance.now();

    const loop = (now: number): void => {
      const dt = now - this.lastTime;
      this.lastTime = now;
      // Clamp to avoid huge jumps when tab was backgrounded.
      const clamped = Math.min(dt, 100);
      this.tick(clamped);
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
    this.emit('CTRL', null, 'Simulation started', COLORS.INFO);
  }

  /** Stop the RAF loop. */
  pause(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
      this.emit('CTRL', null, 'Simulation paused', COLORS.INFO);
    }
  }

  /** Reset to a fresh state with optional new size and mode. */
  reset(n: number, mode: StrategyMode): void {
    this.pause();
    this.ctx.mode = mode;
    this.init(n);
    eventBus.clear();
    this.emit('CTRL', null, `Reset: N=${n}, mode=${strategies[mode].name}`, COLORS.INFO);
  }

  /** Advance the simulation by a fixed STEP_TICK_MS without running RAF. */
  step(): void {
    this.tick(STEP_TICK_MS);
  }

  /** Update playback speed (e.g. 0.25, 0.5, 1, 2, 4). */
  setSpeed(multiplier: number): void {
    this.speedMultiplier = multiplier;
    this.emit('CTRL', null, `Speed set to ${multiplier}x`, COLORS.INFO);
  }

  /** Switch strategy and fully reset so stale philosopher/fork state from the
   *  previous mode (e.g. WAITING philosophers holding forks after a deadlock)
   *  cannot bleed into the new mode and trigger false deadlock detection. */
  setMode(mode: StrategyMode): void {
    this.pause();
    this.ctx.mode = mode;
    this.init(this.ctx.philosophers.length);
    eventBus.clear();
    this.emit('CTRL', null, `Strategy changed to ${strategies[mode].name}`, COLORS.INFO);
  }

  /** Toggle randomized vs deterministic timings. */
  setRandomTimings(value: boolean): void {
    this.randomTimings = value;
  }

  /** Snapshot of the current engine context (mutable - treat as read-only in UI). */
  getContext(): EngineContext {
    return this.ctx;
  }

  /** Get a cloned snapshot of stats. */
  getStatsSnapshot(): SimStats {
    return { ...this.ctx.stats };
  }
}
