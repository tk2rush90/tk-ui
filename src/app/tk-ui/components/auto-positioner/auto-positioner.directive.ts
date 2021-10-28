import {AfterViewChecked, AfterViewInit, Directive, ElementRef, Inject, Input, OnDestroy, Renderer2} from '@angular/core';
import {DOCUMENT} from '@angular/common';

@Directive({
  selector: '[appAutoPositioner]'
})
export class AutoPositionerDirective implements AfterViewInit, AfterViewChecked, OnDestroy {
  /**
   * set position container to bound
   * @param positionContainer position container
   */
  @Input() set positionContainer(positionContainer: ElementRef<HTMLElement> | HTMLElement) {
    this._positionContainerRef = positionContainer;
    this._setPositionContainerElement();
    this._autoPositioningTheElement();
  }

  /**
   * horizontal position priority
   */
  @Input() horizontalPosition: HorizontalPositions | undefined;

  /**
   * vertical position priority
   */
  @Input() verticalPosition: VerticalPositions | undefined;

  /**
   * bind width for element
   * if no width value is bound, width will be same with container
   */
  @Input() width: string | undefined;

  /**
   * position container element
   */
  private _positionContainer: HTMLElement | undefined;

  /**
   * position container ref or element
   */
  private _positionContainerRef: ElementRef<HTMLElement> | HTMLElement | undefined;

  /**
   * host element
   */
  private _element: HTMLElement | undefined;

  /**
   * scroll container
   */
  private _scrollContainer: HTMLElement | undefined;

  /**
   * timeout timer
   */
  private _timer: any;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private elementRef: ElementRef<HTMLElement>,
  ) { }

  ngAfterViewInit(): void {
    this._setHostElement();
    this._setScrollContainer();
    this._autoPositioningTheElement();
  }

  ngAfterViewChecked(): void {
    this._calculatePosition();
  }

  ngOnDestroy(): void {
    clearTimeout(this._timer);
  }

  /**
   * return `true` when both `_element` and `_positionContainer` are ready
   */
  get isReady(): boolean {
    return !!(this._element && this._positionContainer && this._scrollContainer);
  }

  /**
   * return `true` when vertical priority is 'inner'
   */
  get isInnerVertical(): boolean {
    return this.verticalPosition === INNER_TOP || this.verticalPosition === INNER_BOTTOM;
  }

  /**
   * return `true` when horizontal priority is 'inner'
   */
  get isInnerHorizontal(): boolean {
    return this.horizontalPosition === INNER_LEFT || this.horizontalPosition === INNER_RIGHT;
  }

  /**
   * set container element
   */
  private _setPositionContainerElement(): void {
    if (this._positionContainerRef) {
      if (this._positionContainerRef instanceof ElementRef) {
        this._positionContainer = this._positionContainerRef.nativeElement;
      } else {
        this._positionContainer = this._positionContainerRef;
      }
    }
  }

  /**
   * set host element
   */
  private _setHostElement(): void {
    if (this.elementRef) {
      this._element = this.elementRef.nativeElement;
    }
  }

  /**
   * set scroll container
   */
  private _setScrollContainer(): void {
    if (this.elementRef) {
      let parent = this.elementRef.nativeElement.parentElement as HTMLElement;

      while (parent) {
        const overflow = getComputedStyle(parent).getPropertyValue('overflow');

        if (overflow === 'scroll' || overflow === 'auto') {
          this._scrollContainer = parent;
          break;
        } else {
          parent = parent.parentElement as HTMLElement;
        }
      }

      if (!parent) {
        this._scrollContainer = this.document.body;
      }
    }
  }

  /**
   * set the proper position for element
   */
  private _autoPositioningTheElement(): void {
    this._hideElement();

    this._timer = setTimeout(() => {
      this._setElementWidth();
      this._calculatePosition();
      this._showElement();
    });
  }

  /**
   * hide element before positioning
   */
  private _hideElement(): void {
    if (this._element) {
      this.renderer.setStyle(this._element, 'position', 'fixed');
      this.renderer.setStyle(this._element, 'visibility', 'hidden');
    }
  }

  /**
   * set element width
   */
  private _setElementWidth(): void {
    if (this.isReady) {
      const rect = (this._positionContainer as HTMLElement).getBoundingClientRect();

      if (this.width !== undefined && this.width !== null) {
        this.renderer.setStyle(this._element, 'width', this.width);
      } else {
        this.renderer.setStyle(this._element, 'width', rect.width + 'px');
      }
    }
  }

  /**
   * calculate the position
   */
  private _calculatePosition(): void {
    this._setVerticalPosition();
    this._setHorizontalPosition();
  }

  /**
   * set vertical position of element
   */
  private _setVerticalPosition(): void {
    if (this.isInnerVertical) {
      this._setInnerVerticalPosition();
    } else {
      this._setOuterVerticalPosition();
    }
  }

  /**
   * set inner vertical position
   */
  private _setInnerVerticalPosition(): void {
    if (this.isReady) {
      switch (this.verticalPosition) {
        case INNER_TOP: {
          this._calculateInnerTopPriorityPosition();
          break;
        }

        case INNER_BOTTOM: {
          this._calculateInnerBottomPriorityPosition();
          break;
        }
      }
    }
  }

  /**
   * calculate the position for 'inner-top' priority
   */
  private _calculateInnerTopPriorityPosition(): void {
    if (this.isInnerTopAvailable) {
      this._setInnerTopPosition();
    } else if (this.isInnerBottomAvailable) {
      this._setInnerBottomPosition();
    } else {
      this._setInnerTopPosition();
    }
  }

  /**
   * calculate the position for 'inner-bottom' priority
   */
  private _calculateInnerBottomPriorityPosition(): void {
    if (this.isInnerBottomAvailable) {
      this._setInnerBottomPosition();
    } else if (this.isInnerTopAvailable) {
      this._setInnerTopPosition();
    } else {
      this._setInnerBottomPosition();
    }
  }

  /**
   * return `true` when 'inner-top' position is available
   */
  get isInnerTopAvailable(): boolean | void {
    if (this.isReady) {
      const containerRect = (this._positionContainer as HTMLElement).getBoundingClientRect();
      const elementRect = (this._element as HTMLElement).getBoundingClientRect();
      const scrollRect = (this._scrollContainer as HTMLElement).getBoundingClientRect();

      const containerTop = containerRect.top;
      const elementBottom = containerTop + elementRect.height;

      return elementBottom <= scrollRect.top + scrollRect.height;
    }
  }

  /**
   * return `true` when 'inner-bottom' position is available
   */
  get isInnerBottomAvailable(): boolean | void {
    if (this.isReady) {
      const containerRect = (this._positionContainer as HTMLElement).getBoundingClientRect();
      const elementRect = (this._element as HTMLElement).getBoundingClientRect();
      const scrollRect = (this._scrollContainer as HTMLElement).getBoundingClientRect();

      const containerBottom = containerRect.top + containerRect.height;
      const elementTop = containerBottom - elementRect.height;

      return elementTop >= scrollRect.top;
    }
  }

  /**
   * set inner top position to element
   */
  private _setInnerTopPosition(): void {
    if (this.isReady) {
      const containerRect = (this._positionContainer as HTMLElement).getBoundingClientRect();

      this.renderer.setStyle(this._element, 'top', containerRect.top + 'px');
    }
  }

  /**
   * set inner bottom position to element
   */
  private _setInnerBottomPosition(): void {
    if (this.isReady) {
      const containerRect = (this._positionContainer as HTMLElement).getBoundingClientRect();
      const elementBottom = window.innerHeight - containerRect.bottom;

      this.renderer.setStyle(this._element, 'bottom', elementBottom + 'px');
    }
  }

  /**
   * set outer vertical position
   */
  private _setOuterVerticalPosition(): void {
    if (this.isReady) {
      switch (this.verticalPosition) {
        case OUTER_TOP: {
          this._calculateOuterTopPriorityPosition();
          break;
        }

        case OUTER_BOTTOM: {
          this._calculateOuterBottomPriorityPosition();
          break;
        }
      }
    }
  }

  /**
   * calculate the position for 'outer-top' priority
   */
  private _calculateOuterTopPriorityPosition(): void {
    if (this.isOuterTopAvailable) {
      this._setOuterTopPosition();
    } else if (this.isOuterBottomAvailable) {
      this._setOuterBottomPosition();
    } else {
      this._setOuterTopPosition();
    }
  }

  /**
   * calculate the position for 'outer-bottom' priority
   */
  private _calculateOuterBottomPriorityPosition(): void {
    if (this.isOuterBottomAvailable) {
      this._setOuterBottomPosition();
    } else if (this.isOuterTopAvailable) {
      this._setOuterTopPosition();
    } else {
      this._setOuterBottomPosition();
    }
  }

  /**
   * return `true` when 'outer-top' position is available
   */
  get isOuterTopAvailable(): boolean | void {
    if (this.isReady) {
      const containerRect = (this._positionContainer as HTMLElement).getBoundingClientRect();
      const elementRect = (this._element as HTMLElement).getBoundingClientRect();
      const scrollRect = (this._scrollContainer as HTMLElement).getBoundingClientRect();

      const containerTop = containerRect.top;
      const elementTop = containerTop - elementRect.height;

      return elementTop >= scrollRect.top;
    }
  }

  /**
   * return `true` when 'outer-bottom' position is available
   */
  get isOuterBottomAvailable(): boolean | void {
    if (this.isReady) {
      const containerRect = (this._positionContainer as HTMLElement).getBoundingClientRect();
      const elementRect = (this._element as HTMLElement).getBoundingClientRect();
      const scrollRect = (this._scrollContainer as HTMLElement).getBoundingClientRect();

      const containerBottom = containerRect.top + containerRect.height;
      const elementBottom = containerBottom + elementRect.height;

      return elementBottom <= scrollRect.top + scrollRect.height;
    }
  }

  /**
   * set outer top position to element
   */
  private _setOuterTopPosition(): void {
    if (this.isReady) {
      const containerRect = (this._positionContainer as HTMLElement).getBoundingClientRect();
      const elementBottom = window.innerHeight - containerRect.top;

      this.renderer.setStyle(this._element, 'bottom', elementBottom + 'px');
    }
  }

  /**
   * set outer bottom position to element
   */
  private _setOuterBottomPosition(): void {
    if (this.isReady) {
      const containerRect = (this._positionContainer as HTMLElement).getBoundingClientRect();

      this.renderer.setStyle(this._element, 'top', containerRect.bottom + 'px');
    }
  }

  /**
   * set horizontal position of element
   */
  private _setHorizontalPosition(): void {
    if (this.isInnerHorizontal) {
      this._setInnerHorizontalPosition();
    } else {
      this._setOuterHorizontalPosition();
    }
  }

  /**
   * set inner horizontal position
   */
  private _setInnerHorizontalPosition(): void {
    if (this.isReady) {
      switch (this.horizontalPosition) {
        case INNER_LEFT: {
          this._calculateInnerLeftPriorityPosition();
          break;
        }

        case INNER_RIGHT: {
          this._calculateInnerRightPriorityPosition();
          break;
        }
      }
    }
  }

  /**
   * calculate the position for 'inner-left' priority
   */
  private _calculateInnerLeftPriorityPosition(): void {
    if (this.isInnerLeftAvailable) {
      this._setInnerLeftPosition();
    } else if (this.isInnerRightAvailable) {
      this._setInnerRightPosition();
    } else {
      this._setInnerLeftPosition();
    }
  }

  /**
   * calculate the position for 'inner-right' priority
   */
  private _calculateInnerRightPriorityPosition(): void {
    if (this.isInnerRightAvailable) {
      this._setInnerRightPosition();
    } else if (this.isInnerLeftAvailable) {
      this._setInnerLeftPosition();
    } else {
      this._setInnerRightPosition();
    }
  }

  /**
   * return `true` when 'inner-left' position is available
   */
  get isInnerLeftAvailable(): boolean | void {
    if (this.isReady) {
      const containerRect = (this._positionContainer as HTMLElement).getBoundingClientRect();
      const elementRect = (this._element as HTMLElement).getBoundingClientRect();
      const scrollRect = (this._scrollContainer as HTMLElement).getBoundingClientRect();

      const containerLeft = containerRect.left;
      const elementRight = containerLeft + elementRect.width;

      return elementRight <= scrollRect.left + scrollRect.width;
    }
  }

  /**
   * return `true` when 'inner-right' position is available
   */
  get isInnerRightAvailable(): boolean | void {
    if (this.isReady) {
      const containerRect = (this._positionContainer as HTMLElement).getBoundingClientRect();
      const elementRect = (this._element as HTMLElement).getBoundingClientRect();
      const scrollRect = (this._scrollContainer as HTMLElement).getBoundingClientRect();

      const containerRight = containerRect.left + containerRect.width;
      const elementLeft = containerRight - elementRect.width;

      return elementLeft >= scrollRect.left;
    }
  }

  /**
   * set inner left position to element
   */
  private _setInnerLeftPosition(): void {
    if (this.isReady) {
      const containerRect = (this._positionContainer as HTMLElement).getBoundingClientRect();

      this.renderer.setStyle(this._element, 'left', containerRect.left + 'px');
    }
  }

  /**
   * set inner right position to element
   */
  private _setInnerRightPosition(): void {
    if (this.isReady) {
      const containerRect = (this._positionContainer as HTMLElement).getBoundingClientRect();
      const elementRight = window.innerWidth - containerRect.right;

      this.renderer.setStyle(this._element, 'right', elementRight + 'px');
    }
  }

  /**
   * set outer horizontal position
   */
  private _setOuterHorizontalPosition(): void {
    if (this.isReady) {
      switch (this.horizontalPosition) {
        case OUTER_LEFT: {
          this._calculateOuterLeftPriorityPosition();
          break;
        }

        case OUTER_RIGHT: {
          this._calculateOuterRightPriorityPosition();
          break;
        }
      }
    }
  }

  /**
   * calculate the position for 'outer-left' priority
   */
  private _calculateOuterLeftPriorityPosition(): void {
    if (this.isOuterLeftAvailable) {
      this._setOuterLeftPosition();
    } else if (this.isOuterRightAvailable) {
      this._setOuterRightPosition();
    } else {
      this._setOuterLeftPosition();
    }
  }

  /**
   * calculate the position for 'outer-right' priority
   */
  private _calculateOuterRightPriorityPosition(): void {
    if (this.isOuterRightAvailable) {
      this._setOuterRightPosition();
    } else if (this.isOuterLeftAvailable) {
      this._setOuterLeftPosition();
    } else {
      this._setOuterRightPosition();
    }
  }

  /**
   * return `true` when 'outer-left' position is available
   */
  get isOuterLeftAvailable(): boolean | void {
    if (this.isReady) {
      const containerRect = (this._positionContainer as HTMLElement).getBoundingClientRect();
      const elementRect = (this._element as HTMLElement).getBoundingClientRect();
      const scrollRect = (this._scrollContainer as HTMLElement).getBoundingClientRect();

      const containerLeft = containerRect.left;
      const elementLeft = containerLeft - elementRect.width;

      return elementLeft >= scrollRect.left;
    }
  }

  /**
   * return `true` when 'outer-right' position is available
   */
  get isOuterRightAvailable(): boolean | void {
    if (this.isReady) {
      const containerRect = (this._positionContainer as HTMLElement).getBoundingClientRect();
      const elementRect = (this._element as HTMLElement).getBoundingClientRect();
      const scrollRect = (this._scrollContainer as HTMLElement).getBoundingClientRect();

      const containerRight = containerRect.left + containerRect.width;
      const elementRight = containerRight + elementRect.width;

      return elementRight <= scrollRect.left + scrollRect.width;
    }
  }

  /**
   * set outer left position to element
   */
  private _setOuterLeftPosition(): void {
    if (this.isReady) {
      const containerRect = (this._positionContainer as HTMLElement).getBoundingClientRect();
      const elementRight = window.innerWidth - containerRect.left;

      this.renderer.setStyle(this._element, 'right', elementRight + 'px');
    }
  }

  /**
   * set outer right position to element
   */
  private _setOuterRightPosition(): void {
    if (this.isReady) {
      const containerRect = (this._positionContainer as HTMLElement).getBoundingClientRect();
      const elementLeft = containerRect.left + containerRect.width;

      this.renderer.setStyle(this._element, 'left', elementLeft + 'px');
    }
  }

  /**
   * show element after positioning
   */
  private _showElement(): void {
    if (this._element) {
      this.renderer.setStyle(this._element, 'visibility', 'visible');
    }
  }
}

export type VerticalPositions = 'inner-top' | 'inner-bottom' | 'outer-top' | 'outer-bottom';
export const INNER_TOP = 'inner-top';
export const INNER_BOTTOM = 'inner-bottom';
export const OUTER_TOP = 'outer-top';
export const OUTER_BOTTOM = 'outer-bottom';

export type HorizontalPositions = 'inner-left' | 'inner-right' | 'outer-left' | 'outer-right';
export const INNER_LEFT = 'inner-left';
export const INNER_RIGHT = 'inner-right';
export const OUTER_LEFT = 'outer-left';
export const OUTER_RIGHT = 'outer-right';
