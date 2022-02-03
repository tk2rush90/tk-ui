import {ComponentRef, EventEmitter, Injector, Type, ViewContainerRef} from '@angular/core';
import {ModalGroupComponent} from '@tk-ui/components/modal/components/modal-group/modal-group.component';
import {ModalBackdropComponent} from '@tk-ui/components/modal/components/modal-backdrop/modal-backdrop.component';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';
import {ModalWrapperComponent} from '@tk-ui/components/modal/components/modal-wrapper/modal-wrapper.component';

export class ModalRef<T> {
  /**
   * emit after the modal closed
   */
  closed: EventEmitter<void> = new EventEmitter<void>();

  /**
   * subscription service to manage observable events
   */
  private _subscriptionService: SubscriptionService;

  /**
   * modal group component ref
   */
  private _modalGroupRef: ComponentRef<ModalGroupComponent> | undefined;

  /**
   * modal backdrop component ref
   */
  private _modalBackdropRef: ComponentRef<ModalBackdropComponent> | undefined;

  /**
   * modal wrapper component ref
   */
  private _modalWrapperRef: ComponentRef<ModalWrapperComponent> | undefined;

  /**
   * modal component ref
   */
  private _modalComponentRef: ComponentRef<T> | undefined;

  /**
   * modal options
   */
  private _modalOptions: ModalOptions;

  /**
   * modal component
   */
  private readonly _component: T;

  constructor(options: ModalRefOptions<T>) {
    this._component = options.component;
    this._subscriptionService = options.subscriptionService;
    this._modalOptions = options.modalOptions;
  }

  /**
   * subscription key for modal group
   */
  get modalGroupId(): string {
    let key = '';

    if (this._modalGroupRef) {
      key = this._modalGroupRef.instance.id;
    }

    return key;
  }

  /**
   * should close the modal on navigating
   */
  get shouldCloseOnNavigating(): boolean {
    return this._modalOptions.closeOnNavigating || false;
  }

  /**
   * create modal group ref for component
   * @param viewContainerRef viewContainerRef of `ModalGroup`
   */
  createModalGroupRef(viewContainerRef: ViewContainerRef): void {
    this._modalGroupRef = viewContainerRef.createComponent(ModalGroupComponent);
    this._modalGroupRef.changeDetectorRef.detectChanges();
    this._createGroupChildren();
  }

  /**
   * create children for modalGroup
   */
  private _createGroupChildren(): void {
    if (this._modalGroupRef?.instance.viewContainerRef) {
      const ref = this._modalGroupRef?.instance.viewContainerRef;
      this._createModalBackdrop(ref);
      this._createModalWrapper(ref);
    }
  }

  /**
   * create modal backdrop for group
   * @param viewContainerRef modalGroup viewContainerRef
   */
  private _createModalBackdrop(viewContainerRef: ViewContainerRef): void {
    if (this._modalGroupRef) {
      this._modalBackdropRef = viewContainerRef.createComponent(ModalBackdropComponent);
      this._modalBackdropRef.changeDetectorRef.detectChanges();
      this._subscribeBackdropClick();
    }
  }

  /**
   * subscribe `backdropClick` emitter of backdrop
   */
  private _subscribeBackdropClick(): void {
    if (this._modalBackdropRef) {
      const sub = this._modalBackdropRef.instance.backdropClick
        .subscribe(() => {
          this.close();
        });

      this._subscriptionService.store(`_subscribeBackdropClick${this.modalGroupId}`, sub);
    }
  }

  /**
   * create modal wrapper for group
   * @param viewContainerRef modalGroup viewContainerRef
   */
  private _createModalWrapper(viewContainerRef: ViewContainerRef): void {
    if (this._modalGroupRef) {
      this._modalWrapperRef = viewContainerRef.createComponent(ModalWrapperComponent);
      this._modalWrapperRef.changeDetectorRef.detectChanges();

      if (this._modalWrapperRef.instance.viewContainerRef) {
        this._createModalComponent(this._modalWrapperRef.instance.viewContainerRef);
      }
    }
  }

  /**
   * create modal component for group
   * @param viewContainerRef modalWrapper viewContainerRef
   */
  private _createModalComponent(viewContainerRef: ViewContainerRef): void {
    if (this._modalGroupRef) {
      const injector = this._createModalInjector();

      this._modalComponentRef = viewContainerRef.createComponent(this._component as unknown as Type<T>, {
        injector,
      });

      this._modalComponentRef.changeDetectorRef.detectChanges();
    }
  }

  /**
   * create modal injector
   */
  private _createModalInjector(): Injector {
    return Injector.create({
      providers: [
        {
          provide: MODAL_DATA,
          useValue: this._modalOptions.data,
        },
        {
          provide: MODAL_REF,
          useValue: this,
        },
      ],
      // Add parent injector.
      // From the Angular 13.2.0, when the parent injector is not specified,
      // 'Cannot inject Renderer2 when the application uses Renderer3!' error is occurred.
      parent: this._modalWrapperRef?.injector,
    });
  }

  /**
   * close current modal
   * @param result result data
   */
  close(result?: any): void {
    if (this._modalOptions.onClose) {
      this._modalOptions.onClose(result);
    }

    this._modalGroupRef?.destroy();
    this.closed.emit();

    this._unSubscribeBackdropClick();
  }

  /**
   * unsubscribe `backdropClick` emitter of backdrop
   */
  private _unSubscribeBackdropClick(): void {
    this._subscriptionService.unSubscribe(`_subscribeBackdropClick${this.modalGroupId}`);
  }
}

/**
 * constant for the name of modal data injector
 */
export const MODAL_DATA = 'MODAL_DATA';

/**
 * constant for the name of modal ref injector
 */
export const MODAL_REF = 'MODAL_REF';

/**
 * modal creating options
 */
export interface ModalOptions {
  /**
   * set any data to pass to modal
   */
  data?: any;

  /**
   * set `true` to close modal on navigating
   */
  closeOnNavigating?: boolean;

  /**
   * callback function which will be called after modal closed
   * @param result result value passed from the modal
   */
  onClose?(result: any): void;
}

/**
 * modal ref options
 */
export interface ModalRefOptions<T> {
  /**
   * modal component
   */
  component: T;

  /**
   * subscription service
   */
  subscriptionService: SubscriptionService;

  /**
   * modal options
   */
  modalOptions: ModalOptions;
}
