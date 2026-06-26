/**
 * OS-PhiloSim: Statistics tracker
 * -------------------------------
 * Pure functions that create and mutate the SimStats record. Kept separate from
 * the simulation engine so the engine code stays focused on the FSM.
 */

import type { Philosopher, PhilosopherState, SimStats } from './types';

/** Create a fresh stats record for `n` philosophers, zero-initialized. */
export function createStats(n: number): SimStats {
  return {
    meals: new Array<number>(n).fill(0),
    totalWaitTime: new Array<number>(n).fill(0),
    totalHungryTime: new Array<number>(n).fill(0),
    totalThinkingTime: new Array<number>(n).fill(0),
    totalEatingTime: new Array<number>(n).fill(0),
    deadlockCount: 0,
    forkUtilization: new Array<number>(n).fill(0),
    simTime: 0,
  };
}

/**
 * Update aggregated time-in-state counters. Called on every tick BEFORE the
 * philosopher's state potentially changes, so the delta accrues to the state
 * it is in right now. Meals are incremented separately when a philosopher
 * enters EATING.
 */
export function updateStats(
  stats: SimStats,
  philo: Philosopher,
  newState: PhilosopherState,
  delta: number,
): void {
  switch (philo.state) {
    case 'THINKING':
      stats.totalThinkingTime[philo.id] += delta;
      break;
    case 'HUNGRY':
      stats.totalHungryTime[philo.id] += delta;
      stats.totalWaitTime[philo.id] += delta;
      break;
    case 'WAITING':
      stats.totalWaitTime[philo.id] += delta;
      break;
    case 'EATING':
      stats.totalEatingTime[philo.id] += delta;
      break;
  }
  // If transitioning into EATING, count it as a meal.
  if (philo.state !== 'EATING' && newState === 'EATING') {
    stats.meals[philo.id] += 1;
  }
}
