/**
 * Strategy: DEADLOCK DEMO
 * -----------------------
 * The naive textbook approach: every philosopher picks up their LEFT fork
 * first, then their RIGHT fork. When all philosophers grab their left fork
 * simultaneously, no right fork is ever available → circular wait → deadlock.
 *
 * Coffman's four conditions all met:
 *   1. Mutual exclusion  — forks are exclusive resources
 *   2. Hold and wait     — philosopher keeps left fork while waiting for right
 *   3. No preemption     — we never forcibly reclaim a fork
 *   4. Circular wait     — P0→F1←P1→F2←P2→...→P(n-1)→F0←P0
 *
 * CRITICAL design: tryAcquire is split into TWO distinct phases so that
 * grabbing the left fork and attempting the right fork can never happen in the
 * same engine tick. Without this split, the first philosopher processed each
 * tick would find both forks free (its neighbours haven't moved yet) and eat
 * immediately, breaking the circular-wait setup.
 *
 * Phase 1  (heldForks is empty)  — grab left fork only, return false.
 *   → Engine sees false + heldForks.length=1 → moves philosopher to WAITING.
 *
 * Phase 2  (left fork already held)  — attempt right fork only.
 *   → In DEADLOCK Demo all right forks are held by neighbours, so this always
 *      returns false and the philosopher stays WAITING forever → deadlock.
 */

import type { Strategy } from '../types';

export const deadlockStrategy: Strategy = {
  name: 'Deadlock Demo',
  description:
    'Every philosopher grabs LEFT fork first, then waits for RIGHT. Guaranteed deadlock when all become hungry simultaneously.',

  tryAcquire(philo, forks) {
    const left = forks[philo.leftForkId];
    const right = forks[philo.rightForkId];

    // ── Phase 1: no forks held yet — grab the left fork ONLY ──────────────
    // Returning false (not true) forces the engine to place the philosopher
    // into WAITING before we ever attempt the right fork.  This ensures all
    // philosophers grab their left fork in the same tick before any right-fork
    // attempt is made, guaranteeing simultaneous circular wait.
    if (philo.heldForks.length === 0) {
      if (left.value === 1) {
        left.value = 0;
        left.ownerId = philo.id;
        philo.heldForks = [left.id];
      }
      // Whether or not we got the left fork, do NOT proceed to right fork
      // this tick — always return false to enter/stay in WAITING.
      return false;
    }

    // ── Phase 2: left fork held — attempt the right fork ──────────────────
    // In the Deadlock Demo each philosopher's right fork is held by their
    // right neighbour, so this always fails, keeping everyone in WAITING.
    if (!philo.heldForks.includes(right.id)) {
      if (right.value === 1) {
        right.value = 0;
        right.ownerId = philo.id;
        philo.heldForks.push(right.id);
        return true; // got both — can eat (this path never fires in deadlock)
      }
      return false; // hold and wait: keep left, can't get right
    }

    // Both forks already recorded as held (shouldn't normally reach here).
    return philo.heldForks.length === 2;
  },

  release(philo, forks) {
    // Called only when a philosopher finishes EATING (both forks held).
    philo.heldForks.forEach((fid) => {
      forks[fid].value = 1;
      forks[fid].ownerId = null;
    });
    philo.heldForks = [];
  },
};
