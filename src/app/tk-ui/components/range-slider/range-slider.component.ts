import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, Optional, Self} from '@angular/core';
import {FormControlBaseDirective} from '@tk-ui/components/form-control-base/form-control-base.directive';
import {NgControl} from '@angular/forms';
import {EventUtil} from '@tk-ui/utils/event.util';
import {EventListenerService} from '@tk-ui/services/common/event-listener.service';

@Component({
  selector: 'app-range-slider',
  templateUrl: './range-slider.component.html',
  styleUrls: ['./range-slider.component.scss'],
  providers: [
    EventListenerService,
  ]
})
export class RangeSliderComponent extends FormControlBaseDirective<number> implements OnInit, AfterViewInit {
  // Min value
  @Input() min = 0;

  // Max value
  @Input() max = 0;

  // Current value
  private _value = 0;

  constructor(
    @Self() @Optional() public override ngControl: NgControl,
    protected override changeDetectorRef: ChangeDetectorRef,
    private elementRef: ElementRef<HTMLElement>,
    private eventListenerService: EventListenerService,
  ) {
    super(ngControl, changeDetectorRef);
  }

  // Button left position
  private _percent = 0;

  /**
   * Get percent value
   */
  get percent(): string {
    return `${this._percent}%`;
  }

  /**
   * Return host element
   */
  get element(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  ngOnInit(): void {
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
  }

  /**
   * Handle button mouse down
   * @param event mouse event
   */
  onButtonMouseDown(event: MouseEvent | TouchEvent): void {
    this._calculateValueByPosition(event);
    this._addWindowEvents();
  }

  /**
   * Override write value
   * @param value value
   */
  override writeValue(value: any) {
    this._value = value;
    this._calculatePositionByValue();
  }

  /**
   * Add window events
   */
  private _addWindowEvents(): void {
    this.eventListenerService.addEvent(window, 'mousemove', this._onWindowMouseMove);
    this.eventListenerService.addEvent(window, 'mouseup', this._onWindowMouseUp);
    this.eventListenerService.addEvent(window, 'touchmove', this._onWindowMouseMove);
    this.eventListenerService.addEvent(window, 'touchend', this._onWindowMouseUp);
  }

  /**
   * Handle window mousemove event
   * @param event mouse event
   */
  private _onWindowMouseMove = (event: MouseEvent | TouchEvent): void => {
    this._calculateValueByPosition(event);
  }

  /**
   * Handle window mouseup event
   */
  private _onWindowMouseUp = (): void => {
    this.eventListenerService.removeEvent(window, 'mousemove', this._onWindowMouseMove);
    this.eventListenerService.removeEvent(window, 'mouseup', this._onWindowMouseUp);
    this.eventListenerService.removeEvent(window, 'touchmove', this._onWindowMouseMove);
    this.eventListenerService.removeEvent(window, 'touchend', this._onWindowMouseUp);
  }

  /**
   * Calculate button position by value
   */
  private _calculatePositionByValue(): void {
    this._percent = (this._value - this.min) / (this.max - this.min) * 100;
  }

  /**
   * Calculate value by button position
   * @param event mouse event
   */
  private _calculateValueByPosition(event: MouseEvent | TouchEvent): void {
    const domRect = this.element.getBoundingClientRect();
    const {x} = EventUtil.getMouseOrTouchXY(event);
    let value = Math.round((x - domRect.x) / domRect.width * (this.max - this.min) + this.min);

    if (value < this.min) {
      value = this.min;
    }

    if (value > this.max) {
      value = this.max;
    }

    this.setValue(value);
  }
}
