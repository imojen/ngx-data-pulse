import { Injectable, WritableSignal, computed, signal } from "@angular/core";
import {
  EventCallback,
  EventConfig,
  EventType,
  EventWithHistory,
} from "./events.types";

/**
 * Service de gestion d'événements global
 */
@Injectable({ providedIn: "root" })
export class EventsService {
  private events = new Map<
    EventType,
    {
      signal: WritableSignal<EventWithHistory>;
      callbacks: Set<EventCallback>;
    }
  >();

  /**
   * Crée ou récupère un événement
   */
  create<T>(config: EventConfig<T>) {
    const existingEvent = this.events.get(config.type);
    if (existingEvent) {
      return {
        data: computed(
          () => (existingEvent.signal() as EventWithHistory<T>).data
        ),
        history: computed(
          () => (existingEvent.signal() as EventWithHistory<T>).history
        ),
        lastEmitted: computed(
          () => (existingEvent.signal() as EventWithHistory<T>).lastEmitted
        ),
        emit: (data: T) => this.emit(config.type, data),
        on: (callback: EventCallback<T>) => this.on(config.type, callback),
        off: (callback: EventCallback<T>) => this.off(config.type, callback),
      };
    }

    const eventSignal = signal<EventWithHistory<T>>({
      data: config.initialData as T,
      history: [],
      lastEmitted: undefined,
    });

    this.events.set(config.type, {
      signal: eventSignal,
      callbacks: new Set(),
    });

    return {
      data: computed(() => eventSignal().data),
      history: computed(() => eventSignal().history),
      lastEmitted: computed(() => eventSignal().lastEmitted),
      emit: (data: T) => this.emit(config.type, data),
      on: (callback: EventCallback<T>) => this.on(config.type, callback),
      off: (callback: EventCallback<T>) => this.off(config.type, callback),
    };
  }

  /**
   * Émet un événement
   */
  private emit<T>(type: EventType, data: T): void {
    const event = this.events.get(type);
    if (!event) return;

    const currentEvent = event.signal() as EventWithHistory<T>;
    const now = Date.now();

    event.signal.set({
      data,
      history: [...currentEvent.history, currentEvent.data].slice(-10),
      lastEmitted: now,
    });

    event.callbacks.forEach((callback) => callback(data));
  }

  /**
   * S'abonne à un événement
   */
  private on<T>(type: EventType, callback: EventCallback<T>): () => void {
    const event = this.events.get(type);
    if (!event) return () => {};

    event.callbacks.add(callback as EventCallback);
    return () => this.off(type, callback);
  }

  /**
   * Se désabonne d'un événement
   */
  private off<T>(type: EventType, callback: EventCallback<T>): void {
    const event = this.events.get(type);
    if (!event) return;

    event.callbacks.delete(callback as EventCallback);
  }

  /**
   * Supprime un événement
   */
  remove(type: EventType): void {
    this.events.delete(type);
  }

  /**
   * Supprime tous les événements
   */
  clear(): void {
    this.events.clear();
  }
}
