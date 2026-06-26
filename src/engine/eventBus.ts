/**
 * OS-PhiloSim: Event Bus
 * ----------------------
 * Tiny pub/sub bus with a bounded ring buffer. The engine publishes SimEvents
 * (state changes, fork acquisitions, deadlocks, etc.) and the UI subscribes to
 * render them in the EventLog.
 *
 * The ring buffer caps memory growth during long runs (cap = 500 events).
 */

import type { SimEvent } from './types';

type EventHandler = (event: SimEvent) => void;

const RING_CAPACITY = 500;

class EventBus {
  private handlers: Map<string, Set<EventHandler>> = new Map();
  private buffer: SimEvent[] = [];

  /**
   * Subscribe to events. Pass type='*' to subscribe to ALL events.
   * Returns an unsubscribe function.
   */
  subscribe(type: string, handler: EventHandler): () => void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    this.handlers.get(type)!.add(handler);
    return () => {
      this.handlers.get(type)?.delete(handler);
    };
  }

  /**
   * Publish an event. Notifies handlers for the specific type AND '*' wildcard
   * subscribers, then appends to the ring buffer.
   */
  publish(event: SimEvent): void {
    const typed = this.handlers.get(event.type);
    if (typed) {
      typed.forEach((h) => h(event));
    }
    const wildcard = this.handlers.get('*');
    if (wildcard) {
      wildcard.forEach((h) => h(event));
    }
    this.buffer.push(event);
    if (this.buffer.length > RING_CAPACITY) {
      this.buffer.splice(0, this.buffer.length - RING_CAPACITY);
    }
  }

  /** Return a shallow copy of the current buffer. */
  getBuffer(): SimEvent[] {
    return this.buffer.slice();
  }

  /** Drop all buffered events (called on reset). */
  clear(): void {
    this.buffer = [];
  }
}

export const eventBus = new EventBus();
