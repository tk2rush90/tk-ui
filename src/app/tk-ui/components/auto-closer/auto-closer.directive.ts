import {AfterViewInit, Directive, ElementRef, EventEmitter, HostListener, Input, OnDestroy, Output} from '@angular/core';

@Directive({
  selector: '[appAutoCloser]'
})
export class AutoCloserDirective implements AfterViewInit, OnDestroy {
  /**
   * set closer container
   * @param container container
   */
  @Input() set closerContainer(container: ElementRef<HTMLElement> | HTMLElement) {
    this._closerContainerRef = container;
    this._setCloserContainer();
  }

  /**
   * set the `closeOnScroll` flag
   * @param status set `true` to close the container when scrolled
   */
  @Input() set closeOnScroll(status: boolean) {
    this._closeOnScroll = status;
    this._setWheelEvent();
  }

  /**
   * emit when the component should be automatically closed
   */
  @Output() autoClose: EventEmitter<void> = new EventEmitter<void>();

  /**
   * closer container ref
   */
  private _closerContainerRef: ElementRef<HTMLElement> | HTMLElement | undefined;

  /**
   * closer container element
   */
  private _closerContainer: HTMLElement | undefined;

  /**
   * host element
   */
  private _element: HTMLElement | undefined;

  /**
   * set this field to `true` to emit `autoClose` emitter when wheel event triggered
   */
  private _closeOnScroll = false;

  /**
   * flag to detect event appended state
   */
  private _eventAppended = false;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
  ) { }

  ngAfterViewInit(): void {
    this._setElement();
    this._setWheelEvent();
  }

  ngOnDestroy(): void {
    this._removeWheelEvent();
  }

  /**
   * set host element
   */
  private _setElement(): void {
    if (this.elementRef) {
      this._element = this.elementRef.nativeElement;
    }
  }

  /**
   * set closer container element
   */
  private _setCloserContainer(): void {
    if (this._closerContainerRef) {
      if (this._closerContainerRef instanceof ElementRef) {
        this._closerContainer = this._closerContainerRef.nativeElement;
      } else {
        this._closerContainer = this._closerContainerRef;
      }
    }
  }

  /**
   * detect window clicked event
   * @param event event
   */
  @HostListener('window:click', ['$event'])
  onWindowClicked(event: MouseEvent): void {
    this._detectEventTarget(event);
  }

  /**
   * detect event target to emit `autoClose`
   * @param event mouse event
   */
  private _detectEventTarget(event: Event): void {
    if (this._closerContainer) {
      const target = event.target as HTMLElement;

      if (!this._closerContainer.contains(target)) {
        this.autoClose.emit();
      }
    }
  }

  /**
   * set wheel event to window to emit `autoClose`
   */
  private _setWheelEvent(): void {
    if (!this._eventAppended && this._closeOnScroll) {
      window.addEventListener('wheel', this._wheelEventHandler, {capture: true});
      this._eventAppended = true;
    }
  }

  /**
   * wheel event handler
   * @param event event
   */
  private _wheelEventHandler = (event: WheelEvent) => {
    this._detectEventTarget(event);
    this._handleInsideWheelingEvent(event);
  }

  /**
   * handle the inside wheeling event
   * @param event
   */
  private _handleInsideWheelingEvent(event: WheelEvent): void {
    if (this._element && this._closerContainer) {
      const target = event.target as HTMLElement;

      if (this._element.contains(target)) {
        if (event.deltaY > 0 && this.isElementScrollOnBottom) {
          this.autoClose.emit();
        }

        if (event.deltaY < 0 && this.isElementScrollOnTop) {
          this.autoClose.emit();
        }
      }
    }
  }

  /**
   * return `true` when element scroll is on bottom
   */
  get isElementScrollOnBottom(): boolean | void {
    if (this._element) {
      return this._element.scrollHeight <= this._element.scrollTop + this._element.offsetHeight;
    }
  }

  /**
   * return `true` when element scroll is on top
   */
  get isElementScrollOnTop(): boolean | void {
    if (this._element) {
      return this._element.scrollTop <= 0;
    }
  }

  /**
   * remove the wheel event from the window
   */
  private _removeWheelEvent(): void {
    if (this._eventAppended) {
      window.removeEventListener('wheel', this._wheelEventHandler, {capture: true});
    }
  }
}
