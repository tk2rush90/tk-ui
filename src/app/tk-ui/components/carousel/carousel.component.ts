import {
  AfterContentInit, AfterViewInit,
  Component,
  ContentChildren,
  ElementRef,
  HostBinding, HostListener,
  Input, OnDestroy,
  OnInit, QueryList,
} from '@angular/core';
import {CarouselContentDirective} from '@tk-ui/components/carousel/carousel-content.directive';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit, AfterContentInit, AfterViewInit, OnDestroy {
  /**
   * carousel view style
   * default is `sliding`
   */
  @Input() view: CarouselView = 'sliding';

  /**
   * changing delay in `ms`
   */
  @Input() delay = 1000;

  /**
   * transition speed in `ms`
   */
  @Input() speed = 300;

  /**
   * carousel direction
   * default is `horizontal`
   * only works for `sliding` view
   */
  @Input() direction: CarouselDirection = 'horizontal';

  /**
   * ready when initial position is set
   */
  @HostBinding('class.tk-ready') ready = false;

  /**
   * carousel content children
   */
  @ContentChildren(CarouselContentDirective) carouselContentChildren!: QueryList<CarouselContentDirective>;

  /**
   * current index
   */
  index = 0;

  /**
   * timeout timer
   */
  private _timer!: number;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
  ) { }

  ngOnInit(): void {
  }

  ngAfterContentInit(): void {
    this._setPosition();
  }

  ngAfterViewInit(): void {
    this._startCarousel();
  }

  ngOnDestroy(): void {
    this._stopCarousel();
  }

  /**
   * container width
   */
  get width(): number {
    return this.elementRef.nativeElement.getBoundingClientRect().width;
  }

  /**
   * container height
   */
  get height(): number {
    return this.elementRef.nativeElement.getBoundingClientRect().height;
  }

  /**
   * contents length
   */
  get length(): number {
    return this.carouselContentChildren.length;
  }

  /**
   * set contents position
   */
  private _setPosition(): void {
    switch (this.view) {
      case 'fading': {
        this._setFadingPosition();
        break;
      }

      case 'sliding': {
        this._setSlidingPosition();
        break;
      }
    }
  }

  /**
   * set contents position on fading view
   */
  private _setFadingPosition(): void {
    const length = this.length;

    this.carouselContentChildren.forEach((content, index) => {
      content.zIndex = length - index;
      content.speed = this.speed;
      content.opacity = index === this.index ? 1 : 0;
    });
  }

  /**
   * set contents position on sliding view
   */
  private _setSlidingPosition(): void {
    const length = this.length;

    switch (this.direction) {
      case 'horizontal': {
        this._setHorizontalPosition(length);
        break;
      }

      case 'vertical': {
        this._setVerticalPosition(length);
        break;
      }
    }
  }

  /**
   * set horizontal position
   * @param length contents length
   */
  private _setHorizontalPosition(length: number): void {
    const width = this.width;

    this.carouselContentChildren.forEach((content, index) => {
      content.zIndex = length - index;
      content.speed = this.speed;
      content.x = width * (index - this.index);
    });
  }

  /**
   * set vertical position
   * @param length contents length
   */
  private _setVerticalPosition(length: number): void {
    const height = this.height;

    this.carouselContentChildren.forEach((content, index) => {
      content.zIndex = length - index;
      content.speed = this.speed;
      content.y = height * (index - this.index);
    });
  }

  /**
   * handle pointer click event
   * @param index clicked index
   */
  onPointerClick(index: number) {
    this._stopCarousel();
    this._changeIndex(index);
    this._startCarousel();
  }

  /**
   * change index
   * @param index changed index
   */
  private _changeIndex(index: number): void {
    this.index = index;
    this._setPosition();
  }

  /**
   * get next index number
   */
  get nextIndex(): number {
    const nextIndex = this.index + 1;

    if (nextIndex > this.length - 1) {
      return 0;
    } else {
      return nextIndex;
    }
  }

  /**
   * resize carousel
   */
  @HostListener('window:resize')
  onWindowResize(): void {
    this._stopCarousel();
    this._setPosition();
    this._startCarousel();
  }

  /**
   * start carousel
   */
  private _startCarousel(): void {
    this._timer = setTimeout(() => {
      clearTimeout(this._timer);

      this._changeIndex(this.nextIndex);
      this._startCarousel();
    }, this.delay);
  }

  /**
   * stop carousel
   */
  private _stopCarousel(): void {
    clearTimeout(this._timer);
  }
}

/**
 * carousel direction
 */
export type CarouselDirection = 'vertical' | 'horizontal';

/**
 * carousel view style
 */
export type CarouselView = 'sliding' | 'fading';
