import {Directive, ElementRef, HostBinding} from '@angular/core';

@Directive({
  selector: '[appCarouselContent]'
})
export class CarouselContentDirective {
  /**
   * bind content left position
   */
  @HostBinding('style.left') get left(): string {
    return this._x + 'px';
  }

  /**
   * bind content top position
   */
  @HostBinding('style.top') get top(): string {
    return this._y + 'px';
  }

  /**
   * bind z-index
   */
  @HostBinding('style.z-index') get zIndex(): number {
    return this._zIndex;
  }

  /**
   * bind transition
   */
  @HostBinding('style.transition') get transition(): string {
    return `all ${this._speed}ms`;
  }

  /**
   * bind opacity
   */
  @HostBinding('style.opacity') get opacity(): number {
    return this._opacity;
  }

  /**
   * content x position
   */
  private _x = 0;

  /**
   * content y position
   */
  private _y = 0;

  /**
   * z index
   */
  private _zIndex = 0;

  /**
   * transition delay
   */
  private _speed = 0;

  /**
   * content opacity
   */
  private _opacity = 1;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
  ) { }

  /**
   * return the element
   */
  get element(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  /**
   * set x position
   * @param x x
   */
  set x(x: number) {
    this._x = x;
  }

  /**
   * set y position
   * @param y y
   */
  set y(y: number) {
    this._y = y;
  }

  /**
   * set z index for content
   * @param index z-index
   */
  set zIndex(index: number) {
    this._zIndex = index;
  }

  /**
   * set transition speed in milliseconds
   * @param speed speed
   */
  set speed(speed: number) {
    this._speed = speed;
  }

  /**
   * set opacity
   * @param opacity opacity
   */
  set opacity(opacity: number) {
    this._opacity = opacity;
  }
}
