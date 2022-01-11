import {AfterViewInit, Directive, ElementRef, EventEmitter, Input, OnDestroy, Output} from '@angular/core';

@Directive({
  selector: '[appAutoCloser]'
})
export class AutoCloserDirective implements AfterViewInit, OnDestroy {
  /**
   * set closer container
   * @param container container
   */
  @Input() set closerContainer(container: HTMLElement) {
    this._closerContainer = container;
  }

  /**
   * set closer control button
   * @param button button
   */
  @Input() set closerButton(button: HTMLElement) {
    this._closerButton = button;
  }

  /**
   * set the `closeOnScroll` flag
   * @param status set `true` to close the container when scrolled
   */
  @Input() set closeOnScroll(status: boolean) {
    this._closeOnScroll = status;

    if (this._closeOnScroll) {
      this._appendWheelEvent();
    } else {
      this._removeWheelEvent();
    }
  }

  /**
   * emit when the component should be automatically closed
   */
  @Output() autoClose: EventEmitter<void> = new EventEmitter<void>();

  /**
   * closer container ref
   */
  private _closerContainer!: HTMLElement;

  /**
   * closer toggle button
   */
  private _closerButton?: HTMLElement;

  /**
   * set this field to `true` to emit `autoClose` emitter when wheel event triggered
   */
  private _closeOnScroll = false;

  /**
   * check wheel event appended
   */
  private _wheelEventAppended = false;

  /**
   * check click event appended
   */
  private _clickEventAppended = false;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
  ) {
  }

  ngAfterViewInit(): void {
    this._checkCloserContainer();
    this._appendClickEvent();
  }

  ngOnDestroy(): void {
    this._removeWheelEvent();
    this._removeClickEvent();
  }

  get element(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  get button(): HTMLElement | undefined {
    return this._closerButton;
  }

  private _checkCloserContainer(): void {
    if (!this._closerContainer) {
      throw new Error(`'closerContainer' for AutoCloser is required`);
    }
  }

  private _appendClickEvent(): void {
    if (!this._clickEventAppended) {
      window.addEventListener('click', this._detectEventTarget, {capture: true});
      this._clickEventAppended = true;
    }
  }

  private _removeClickEvent(): void {
    if (this._clickEventAppended) {
      window.removeEventListener('click', this._detectEventTarget, {capture: true});
      this._clickEventAppended = false;
    }
  }

  /**
   * detect event target to emit `autoClose`
   * @param event mouse event
   */
  private _detectEventTarget = (event: Event): void => {
    const target = event.target as HTMLElement;

    if (this.button) {
      if (this.button.contains(target)) {
        event.stopPropagation();
        this._emitAutoClose();
        return;
      }
    }

    if (!this._closerContainer.contains(target)) {
      this._emitAutoClose();
    }
  }

  /**
   * set wheel event to window to emit `autoClose`
   */
  private _appendWheelEvent(): void {
    if (!this._wheelEventAppended) {
      window.addEventListener('wheel', this._wheelEventHandler, {capture: true});
      this._wheelEventAppended = true;
    }
  }

  /**
   * remove the wheel event from the window
   */
  private _removeWheelEvent(): void {
    if (this._wheelEventAppended) {
      window.removeEventListener('wheel', this._wheelEventHandler, {capture: true});
      this._wheelEventAppended = false;
    }
  }

  /**
   * wheel event handler
   * @param event event
   */
  private _wheelEventHandler = (event: WheelEvent) => {
    this._handleInsideWheelingEvent(event);
  }

  /**
   * handle the inside wheeling event
   * @param event
   */
  private _handleInsideWheelingEvent(event: WheelEvent): void {
    const target = event.target as HTMLElement;

    if (this.element.contains(target)) {
      if (event.deltaY > 0 && this.isElementScrollOnBottom) {
        this._emitAutoClose();
      }

      if (event.deltaY < 0 && this.isElementScrollOnTop) {
        this._emitAutoClose();
      }
    } else {
      this._emitAutoClose();
    }
  }

  private _emitAutoClose(): void {
    this.autoClose.emit();
  }

  /**
   * return `true` when element scroll is on bottom
   */
  get isElementScrollOnBottom(): boolean | void {
    return this.element.scrollHeight <= this.element.scrollTop + this.element.offsetHeight;
  }

  /**
   * return `true` when element scroll is on top
   */
  get isElementScrollOnTop(): boolean | void {
    return this.element.scrollTop <= 0;
  }
}
