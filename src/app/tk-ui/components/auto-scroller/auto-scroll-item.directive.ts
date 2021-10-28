import {Directive, ElementRef, EventEmitter, Input} from '@angular/core';

@Directive({
  selector: '[appAutoScrollItem]'
})
export class AutoScrollItemDirective {
  /**
   * set focused state
   * @param focused focused state
   */
  @Input() set focused(focused: boolean) {
    this._focused = focused;
    this._emitHasFocus();
  }

  /**
   * emit when the element is focused
   */
  hasFocus: EventEmitter<void> = new EventEmitter<void>();

  /**
   * focused state
   */
  private _focused = false;

  constructor(
    public elementRef: ElementRef<HTMLElement>,
  ) { }

  /**
   * return the focused state
   */
  get focused(): boolean {
    return this._focused;
  }

  /**
   * emit `hasFocus` emitter when it focused
   */
  private _emitHasFocus(): void {
    if (this._focused) {
      this.hasFocus.emit();
    }
  }
}
