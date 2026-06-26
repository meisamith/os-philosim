/**
 * Strategy: BINARY SEMAPHORE (ATOMIC ACQUISITION)
 * -----------------------------------------------
 * Each fork is modeled as a binary semaphore (value 0 or 1). A philosopher
 * only attempts pickup if BOTH adjacent forks are available, and the pickup
 * happens atomically. If either fork is unavailable, no fork is acquired -
 * there is no "hold and wait" because the philosopher never holds a partial
 * resource set.
 *
 * Removing the hold-and-wait condition breaks Coffman's necessary set, so
 * deadlock cannot occur. Starvation is still possible under adversarial
 * scheduling but is unlikely with random timings.
 */

import type { Strategy } from '../types';

export const semaphoreStrategy: Strategy = {
  name: 'Binary Semaphore',
  description:
    'Each fork is a binary semaphore. A philosopher acquires BOTH forks atomically or none at all. This eliminates "hold and wait".',

  tryAcquire(philo, forks) {
    const left = forks[philo.leftForkId];
    const right = forks[philo.rightForkId];

    // ATOMIC CHECK: both forks must be free at the same instant.
    if (left.value === 1 && right.value === 1) {
      left.value = 0;
      left.ownerId = philo.id;
      right.value = 0;
      right.ownerId = philo.id;
      philo.heldForks = [left.id, right.id];
      return true;
    }

    // Otherwise, hold no forks and keep waiting.
    return false;
  },

  release(philo, forks) {
    philo.heldForks.forEach((fid) => {
      forks[fid].value = 1;
      forks[fid].ownerId = null;
    });
    philo.heldForks = [];
  },
};
