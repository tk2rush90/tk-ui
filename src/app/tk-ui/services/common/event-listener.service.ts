import {Injectable, OnDestroy} from '@angular/core';
import {environment} from '../../../../environments/environment';

const {
  production,
} = environment;

export interface RegisteredEvent {
  // Event target
  target: EventTarget;
  // Event type
  type: keyof WindowEventMap;
  // Event handler
  handler: EventHandler;
  // Event options
  options?: boolean | AddEventListenerOptions;
}

export type EventHandler = (event: any) => void;

/**
 * Handle event listeners those need to be removed when component destroy.
 * Call `addEvent()` method to register event to manage.
 * Then, if the component is destroyed, it will call
 */
@Injectable()
export class EventListenerService implements OnDestroy {
  // Registered events to be removed on destroy
  private _registeredEvents: RegisteredEvent[] = [];

  constructor() {
  }

  ngOnDestroy(): void {
    this._removeAllRegisteredEvents();
  }

  /**
   * Add event to target.
   * @param target event target
   * @param type event type
   * @param handler event handler
   * @param options event options
   */
  addEvent(target: EventTarget, type: keyof WindowEventMap, handler: EventHandler, options?: boolean | AddEventListenerOptions): void {
    // Remove existing event.
    this.removeEvent(target, type, handler);

    // Add new event.
    target.addEventListener(type, handler, options);

    // Register event
    this._registerEvent({
      target,
      type,
      handler,
      options,
    });
  }

  /**
   * Remove event from the target.
   * @param target event target
   * @param type event type
   * @param handler event handler
   */
  removeEvent(target: EventTarget, type: keyof WindowEventMap, handler: EventHandler): void {
    const registeredEvent = this._getRegisteredEvent(target, type, handler);

    if (registeredEvent) {
      const {target, type, handler, options} = registeredEvent;

      target.removeEventListener(type, handler, options);

      this._unregisterEvent(registeredEvent);
    } else {
      if (!production) {
        console.warn(`Trying to remove event which isn't registered in EventListenerService. This action is ignored.`, {
          target,
          type,
          handler,
        });
      }
    }
  }

  /**
   * Register event
   * @param registeredEvent event to register
   */
  private _registerEvent(registeredEvent: RegisteredEvent): void {
    this._registeredEvents.push(registeredEvent);
  }

  /**
   * Unregister event
   * @param registeredEvent event to unregister
   */
  private _unregisterEvent(registeredEvent?: RegisteredEvent): void {
    this._registeredEvents = this._registeredEvents.filter(item => item !== registeredEvent);
  }

  /**
   * Find and return registered event.
   * It only checks target, type, and handler.
   * @param target event target
   * @param type event type
   * @param handler event handler
   */
  private _getRegisteredEvent(target: EventTarget, type: keyof WindowEventMap, handler: EventHandler): RegisteredEvent | undefined {
    return this._registeredEvents.find(item => {
      return item.target === target
        && item.type === type
        && item.handler === handler;
    });
  }

  /**
   * Remove all registered events.
   */
  private _removeAllRegisteredEvents(): void {
    this._registeredEvents.forEach(({target, type, handler, options}) => {
      target.removeEventListener(type, handler, options);
    });

    this._registeredEvents = [];
  }
}
