import {
  AfterViewChecked,
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  Inject,
  Input,
  Renderer2
} from '@angular/core';
import {DOCUMENT} from '@angular/common';

@Directive({
  selector: '[appAutoPositioner]'
})
export class AutoPositionerDirective implements AfterViewInit, AfterViewChecked {
  /**
   * set position container to bound
   * @param positionContainer position container
   */
  @Input() set positionContainer(positionContainer: HTMLElement) {
    this._positionContainer = positionContainer;
    this._checkPositionContainer();

    if (this._viewInitialized) {
      this._setPosition();
    }
  }

  /**
   * set horizontal position priority
   * @param priority priority
   */
  @Input() set horizontalPriority(priority: HorizontalPriority) {
    this._horizontalPriority = priority;
  }

  /**
   * set vertical position priority
   * @param priority priority
   */
  @Input() set verticalPriority(priority: VerticalPriority) {
    this._verticalPriority = priority;
  }

  /**
   * set horizontal bind position
   * @param position bind position
   */
  @Input() set horizontalBindPosition(position: BindPosition) {
    this._horizontalBindPosition = position;
  }

  /**
   * set vertical bind position
   * @param position bind position
   */
  @Input() set verticalBindPosition(position: BindPosition) {
    this._verticalBindPosition = position;
  }

  /**
   * set width in pixel
   * @param width width
   */
  @Input() set width(width: number) {
    this._width = width;
  }

  /**
   * position container ref
   */
  private _positionContainer!: HTMLElement;

  /**
   * horizontal priority
   * default is `left`
   */
  private _horizontalPriority: HorizontalPriority = 'left';

  /**
   * vertical priority
   * default is `bottom`
   */
  private _verticalPriority: VerticalPriority = 'bottom';

  /**
   * horizontal bind position
   * default is `inside`
   */
  private _horizontalBindPosition: BindPosition = 'inside';

  /**
   * vertical bind position
   * default is `inside`
   */
  private _verticalBindPosition: BindPosition = 'inside';

  /**
   * element width in pixel (or `auto`)
   * default is `auto` and it will fit the width to container width
   * if value is number, width is fixed in pixel
   */
  private _width: string | number = 'auto';

  /**
   * flag to check view initialized
   */
  private _viewInitialized = false;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private elementRef: ElementRef<HTMLElement>,
  ) {
  }

  ngAfterViewInit(): void {
    this._checkPositionContainer();
    this._setPosition();
    this._viewInitialized = true;
  }

  ngAfterViewChecked(): void {
    if (this._viewInitialized) {
      this._checkPositionContainer();
      this._setPosition();
    }
  }

  /**
   * get element from `elementRef`
   */
  get element(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  /**
   * get `DOMRect` from `element`
   */
  get elementDomRect(): DOMRect {
    return this.element.getBoundingClientRect();
  }

  /**
   * get `DOMRect` from `container`
   */
  get containerDomRect(): DOMRect {
    return this._positionContainer.getBoundingClientRect();
  }

  /**
   * check position container existence
   */
  private _checkPositionContainer(): void {
    if (!this._positionContainer) {
      throw new Error(`'positionContainer' for AutoPositioner is required`);
    }
  }

  /**
   * set position
   */
  private _setPosition(): void {
    const width = this._width === 'auto' ? this.containerDomRect.width + 'px' : this._width + 'px';

    // set position fixed
    this.renderer.setStyle(this.element, 'position', 'fixed');
    // set width
    this.renderer.setStyle(this.element, 'width', width);
    // hide element
    this.renderer.setStyle(this.element, 'opacity', '0');

    this._setHorizontalPosition();
    this._setVerticalPosition();

    // show element
    this.renderer.setStyle(this.element, 'opacity', '1');
  }

  /**
   * set horizontal position
   */
  private _setHorizontalPosition(): void {
    switch (this._horizontalBindPosition) {
      case 'inside': {
        this._setHorizontalInsidePosition();
        break;
      }

      case 'outside': {
        this._setHorizontalOutsidePosition();
        break;
      }
    }
  }

  /**
   * set horizontal inside position
   */
  private _setHorizontalInsidePosition(): void {
    const elementDomRect = this.elementDomRect;
    const containerDomRect = this.containerDomRect;
    const leftRemains = window.innerWidth - (containerDomRect.left + elementDomRect.width);
    const rightRemains = containerDomRect.right - elementDomRect.width;

    switch (this._horizontalPriority) {
      case 'left': {
        if (leftRemains > 0 || rightRemains < 0) {
          // left is available or right is unavailable
          this.renderer.setStyle(this.element, 'left', containerDomRect.left + 'px');
        } else {
          // left is unavailable and right is available
          this.renderer.setStyle(this.element, 'left', rightRemains + 'px');
        }

        break;
      }

      case 'right': {
        if (rightRemains > 0 || leftRemains < 0) {
          // right is available or left is unavailable
          this.renderer.setStyle(this.element, 'left', rightRemains + 'px');
        } else {
          // right is unavailable and left is available
          this.renderer.setStyle(this.element, 'left', containerDomRect.left + 'px');
        }

        break;
      }
    }
  }

  /**
   * set horizontal outside position
   */
  private _setHorizontalOutsidePosition(): void {
    const elementDomRect = this.elementDomRect;
    const containerDomRect = this.containerDomRect;
    const leftRemains = containerDomRect.left - elementDomRect.width;
    const rightRemains = window.innerWidth - (containerDomRect.right + elementDomRect.width);

    switch (this._horizontalPriority) {
      case 'left': {
        if (leftRemains > 0 || rightRemains < 0) {
          // left is available or right is unavailable
          this.renderer.setStyle(this.element, 'left', leftRemains + 'px');
        } else {
          // left is unavailable and right is available
          this.renderer.setStyle(this.element, 'left', containerDomRect.right + 'px');
        }

        break;
      }

      case 'right': {
        if (rightRemains > 0 || leftRemains < 0) {
          // right is available or left is unavailable
          this.renderer.setStyle(this.element, 'left', containerDomRect.right + 'px');
        } else {
          // right is unavailable and left is available
          this.renderer.setStyle(this.element, 'left', leftRemains + 'px');
        }

        break;
      }
    }
  }

  /**
   * set vertical position
   */
  private _setVerticalPosition(): void {
    switch (this._verticalBindPosition) {
      case 'inside': {
        this._setVerticalInsidePosition();
        break;
      }

      case 'outside': {
        this._setVerticalOutsidePosition();
        break;
      }
    }
  }

  /**
   * set vertical inside position
   */
  private _setVerticalInsidePosition(): void {
    const elementDomRect = this.elementDomRect;
    const containerDomRect = this.containerDomRect;
    const topRemains = containerDomRect.bottom - elementDomRect.height;
    const bottomRemains = window.innerHeight - (containerDomRect.top + elementDomRect.height);

    switch (this._verticalPriority) {
      case 'top': {
        if (topRemains > 0 || bottomRemains < 0) {
          // top is available or bottom is unavailable
          this.renderer.setStyle(this.element, 'top', topRemains + 'px');
        } else {
          // top is unavailable and bottom is available
          this.renderer.setStyle(this.element, 'top', containerDomRect.top + 'px');
        }

        break;
      }

      case 'bottom': {
        if (bottomRemains > 0 || topRemains < 0) {
          // bottom is available or top is unavailable
          this.renderer.setStyle(this.element, 'top', containerDomRect.top + 'px');
        } else {
          // bottom is unavailable and top is available
          this.renderer.setStyle(this.element, 'top', topRemains + 'px');
        }

        break;
      }
    }
  }

  /**
   * set vertical outside position
   */
  private _setVerticalOutsidePosition(): void {
    const elementDomRect = this.elementDomRect;
    const containerDomRect = this.containerDomRect;
    const topRemains = containerDomRect.top - elementDomRect.height;
    const bottomRemains = window.innerHeight - (containerDomRect.bottom + elementDomRect.height);

    switch (this._verticalPriority) {
      case 'top': {
        if (topRemains > 0 || bottomRemains < 0) {
          // top is available or bottom is unavailable
          this.renderer.setStyle(this.element, 'top', topRemains + 'px');
        } else {
          // top is unavailable and bottom is available
          this.renderer.setStyle(this.element, 'top', containerDomRect.bottom + 'px');
        }

        break;
      }

      case 'bottom': {
        if (bottomRemains > 0 || topRemains < 0) {
          // bottom is available or top is unavailable
          this.renderer.setStyle(this.element, 'top', containerDomRect.bottom + 'px');
        } else {
          // bottom is unavailable and top is available
          this.renderer.setStyle(this.element, 'top', topRemains + 'px');
        }
      }
    }
  }

  /**
   * listen window scroll event to reposition element
   */
  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (this._viewInitialized) {
      this._setPosition();
    }
  }

  /**
   * listen window resize event to reposition element
   */
  @HostListener('window:resize')
  onWindowResize(): void {
    if (this._viewInitialized) {
      this._setPosition();
    }
  }
}

export type HorizontalPriority = 'left' | 'right';
export type VerticalPriority = 'top' | 'bottom';
export type BindPosition = 'inside' | 'outside';
