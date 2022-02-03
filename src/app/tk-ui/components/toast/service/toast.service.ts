import {ComponentRef, Injectable, ViewContainerRef} from '@angular/core';
import {ToastOutletComponent} from '@tk-ui/components/toast/components/toast-outlet/toast-outlet.component';
import {ToastMessageComponent} from '@tk-ui/components/toast/components/toast-message/toast-message.component';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  /**
   * registered toast outlets
   * `k` is the id of each toast outlet
   */
  private _outlets: {[k: string]: ToastOutletComponent} = {};

  /**
   * displaying toast component
   */
  private _toast: ComponentRef<ToastMessageComponent> | undefined;

  constructor(
    private subscriptionService: SubscriptionService,
  ) { }

  /**
   * register toast outlet
   * @param outlet outlet
   */
  registerOutlet(outlet: ToastOutletComponent): void {
    this._outlets[outlet.id] = outlet;
  }

  /**
   * open the toast message for all registered outlets
   * @param options toast options
   */
  open(options: ToastOptions): void {
    Object.keys(this._outlets).forEach(key => {
      if (this._outlets[key].viewContainerRef) {
        this._createToast(this._outlets[key].viewContainerRef as ViewContainerRef, options);
      }
    });
  }

  /**
   * create toast for view container ref
   * @param viewContainerRef view container ref
   * @param options toast options
   */
  private _createToast(viewContainerRef: ViewContainerRef, options: ToastOptions): void {
    const toast = viewContainerRef.createComponent(ToastMessageComponent);

    toast.instance.message = options.message;
    toast.instance.type = options.type || ToastType.default;
    toast.instance.count = options.timer || 5000;
    toast.changeDetectorRef.detectChanges();

    this._destroyExistingToast();

    this._toast = toast;
    this._subscribeCloseToast();
  }

  /**
   * subscribe close toast
   */
  private _subscribeCloseToast(): void {
    if (this._toast) {
      const sub = this._toast.instance.closeToast
        .subscribe(() => {
          this._destroyExistingToast();
        });

      this.subscriptionService.store(`_subscribeCloseToast${this._toast.instance.id}`, sub);
    }
  }

  /**
   * destroy existing toast message
   */
  private _destroyExistingToast(): void {
    if (this._toast) {
      this._toast.destroy();
      this.subscriptionService.unSubscribe(`_subscribeCloseToast${this._toast.instance.id}`);
    }
  }
}

/**
 * toast type enum
 */
export enum ToastType {
  default = 'default',
  success = 'success',
  error = 'error',
}

export interface ToastOptions {
  /**
   * toast message to display
   */
  message: string;

  /**
   * toast type enum
   */
  type?: ToastType;

  /**
   * closing timer in milliseconds
   */
  timer?: number;
}
