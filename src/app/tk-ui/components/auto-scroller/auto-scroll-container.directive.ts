import {AfterViewInit, ContentChildren, Directive, ElementRef, QueryList} from '@angular/core';
import {AutoScrollItemDirective} from '@tk-ui/components/auto-scroller/auto-scroll-item.directive';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';

@Directive({
  selector: '[appAutoScrollContainer]',
  providers: [
    SubscriptionService,
  ],
})
export class AutoScrollContainerDirective implements AfterViewInit {
  /**
   * get scroll list items as content children
   */
  @ContentChildren(AutoScrollItemDirective, {descendants: true}) autoScrollItemList: QueryList<AutoScrollItemDirective> | undefined;

  /**
   * focused scroll item
   */
  private _focused: AutoScrollItemDirective | undefined;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private subscriptionService: SubscriptionService,
  ) { }

  ngAfterViewInit(): void {
    this._subscribeHasFocus();
    this._initializeFocus();
  }

  /**
   * subscribe `hasFocus` emitter of scroll item
   */
  private _subscribeHasFocus(): void {
    if (this.autoScrollItemList) {
      const subs = this.autoScrollItemList.map(item => {
        return item.hasFocus.subscribe(() => {
          this._focused = item;
          this._scrollIntoView();
        });
      });

      this.subscriptionService.store('_subscribeHasFocus', subs);
    }
  }

  /**
   * initialize focus when view init
   */
  private _initializeFocus(): void {
    if (this.autoScrollItemList) {
      this._focused = this.autoScrollItemList.find(item => item.focused);
      this._scrollIntoView();
    }
  }

  /**
   * scroll into view to show element
   */
  private _scrollIntoView(): void {
    const container = this.elementRef?.nativeElement;
    const element = this._focused?.elementRef?.nativeElement;

    if (element && container) {
      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();

      const containerRelativeCenter = containerRect.height * .5;
      const elementRelativeTop = elementRect.top - containerRect.top;
      const elementRelativeCenter = elementRelativeTop + (elementRect.height * .5);

      container.scrollTop = container.scrollTop - (containerRelativeCenter - elementRelativeCenter);
    }
  }
}
