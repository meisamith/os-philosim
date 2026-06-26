/**
 * Strategy registry. Maps StrategyMode -> Strategy implementation.
 */

import type { Strategy, StrategyMode } from '../types';
import { deadlockStrategy } from './deadlock';
import { semaphoreStrategy } from './semaphore';

export const strategies: Record<StrategyMode, Strategy> = {
  DEADLOCK: deadlockStrategy,
  SEMAPHORE: semaphoreStrategy,
};
