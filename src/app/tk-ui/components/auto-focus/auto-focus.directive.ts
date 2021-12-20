import {AfterViewInit, Directive, ElementRef} from '@angular/core';

@Directive({
  selector: '[appAutoFocus]'
})
export class AutoFocusDirective implements AfterViewInit {

  constructor(
    private elementRef: ElementRef<HTMLElement>,
  ) { }

  ngAfterViewInit(): void {
    this.setFocus();
  }

  /**
   * return element
   */
  get element(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  /**
   * set focus to element
   */
  setFocus(): void {
    this.element.focus();
  }
}
