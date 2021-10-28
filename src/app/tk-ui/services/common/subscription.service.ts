import {Injectable, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';

@Injectable()
export class SubscriptionService implements OnDestroy {
  // storage for items
  private storage: {[key: string]: Subscription | Subscription[]} = {};

  ngOnDestroy(): void {
    this.unSubscribeAll();
  }

  /**
   * wrapper method for observable
   * @param key identifier key
   * @param item subscription or subscriptions
   */
  store(key: string, item: Subscription | Subscription[]): void {
    // unsubscribe before store
    this.unSubscribe(key);
    this.storage[key] = item;
  }

  /**
   * append subscription to store
   * @param key identifier key
   * @param item subscription or subscriptions
   */
  append(key: string, item: Subscription | Subscription[]): void {
    if (!this.storage[key]) {
      this.storage[key] = [];
    }

    if (item instanceof Array) {
      (this.storage[key] as Subscription[]).push(...item);
    } else {
      (this.storage[key] as Subscription[]).push(item);
    }
  }

  /**
   * unsubscribe item by key
   * @param key identifier key
   */
  unSubscribe(key: string): void {
    const item = this.storage[key];

    if (item) {
      (item instanceof Array ? item : [item]).forEach(sub => sub.unsubscribe());
      delete this.storage[key];
    }
  }

  /**
   * unsubscribe all items
   */
  unSubscribeAll(): void {
    Object.keys(this.storage).forEach(key => this.unSubscribe(key));
  }
}
