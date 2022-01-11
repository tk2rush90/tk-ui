import {ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, Optional, Self} from '@angular/core';
import {NgControl} from '@angular/forms';
import {FormControlBaseDirective} from '@tk-ui/components/form-control-base/form-control-base.directive';
import {AvailableKey, EventUtil} from '@tk-ui/utils/event.util';
import {OptionItem} from '@tk-ui/models/option-item';

@Component({
  selector: 'app-select-base',
  template: '',
})
export class SelectBaseComponent<T> extends FormControlBaseDirective<T> implements OnInit, OnDestroy {
  /**
   * set placeholder
   */
  @Input() placeholder = 'Select...';

  /**
   * set options for select
   * @param options options
   */
  @Input() set options(options: OptionItem<T>[]) {
    this._options = options || [];
    this._setSelectedLabel();
  }

  /**
   * opened state
   */
  opened = false;

  /**
   * selected item's label
   */
  label = '';

  /**
   * selected item's value
   */
  value: any;

  /**
   * focused item's index
   */
  focusedIndex = -1;

  /**
   * option list for select component
   */
  protected _options: OptionItem<T>[] = [];

  /**
   * flag to check keyboard event added
   */
  protected _keyboardEventAdded = false;

  constructor(
    @Self() @Optional() public ngControl: NgControl,
    public elementRef: ElementRef<HTMLElement>,
    protected changeDetectorRef: ChangeDetectorRef,
  ) {
    super(ngControl, changeDetectorRef);
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this._removeKeyboardControlEvents();
  }

  /**
   * return the options
   */
  get options(): OptionItem<T>[] {
    return this._options;
  }

  /**
   * open with input element
   * @param target target
   */
  openWithInput(target: HTMLInputElement): void {
    target.blur();
    this.open();
  }

  /**
   * open the options
   */
  open(): void {
    this.focusedIndex = this._options.findIndex(item => item.value === this.value);
    this.opened = true;
    this._addKeyboardControlEvents();
  }

  /**
   * close the options
   */
  close(): void {
    this.opened = false;
    this.markAsTouched();
    this._removeKeyboardControlEvents();
  }

  /**
   * write value to component
   * @param value new value
   */
  writeValue(value: any): void {
    this.value = value;
    this._setSelectedLabel();
  }

  /**
   * set selected label with value
   */
  protected _setSelectedLabel(): void {
    const option = this._options.find(item => item.value === this.value);

    if (option) {
      this.label = option.label;
    } else {
      this.label = '';
    }
  }

  /**
   * update component value with option
   * @param option option
   */
  onOptionClicked(option: OptionItem<T>): void {
    this.setValue(option.value);
    this.close();
  }

  /**
   * add keyboard control events when options opened
   */
  protected _addKeyboardControlEvents(): void {
    if (!this._keyboardEventAdded) {
      window.addEventListener('keydown', this._handleKeydownEvent);
      this._keyboardEventAdded = true;
    }
  }

  /**
   * handle keydown event
   * @param event keyboard event
   */
  protected _handleKeydownEvent = (event: KeyboardEvent): void => {
    event.preventDefault();

    this._onEsc(event);
    this._onArrowDown(event);
    this._onArrowUp(event);
    this._onEnter(event);
  }

  /**
   * handle esc event
   * @param event event
   */
  protected _onEsc(event: KeyboardEvent): void {
    if (EventUtil.isKey(event, AvailableKey.Escape)) {
      this.close();
    }
  }

  /**
   * handle arrow down event
   * @param event event
   */
  protected _onArrowDown(event: KeyboardEvent): void {
    if (EventUtil.isKey(event, AvailableKey.ArrowDown)) {
      this.focusedIndex = Math.min(this.focusedIndex + 1, this._options.length - 1);
    }
  }

  /**
   * handle arrow up event
   * @param event event
   */
  protected _onArrowUp(event: KeyboardEvent): void {
    if (EventUtil.isKey(event, AvailableKey.ArrowUp)) {
      this.focusedIndex = Math.max(this.focusedIndex - 1, 0);
    }
  }

  /**
   * handle enter event
   * @param event event
   */
  protected _onEnter(event: KeyboardEvent): void {
    if (EventUtil.isKey(event, AvailableKey.Enter)) {
      const option = this._options[this.focusedIndex];

      if (option) {
        this.onOptionClicked(option);
      }
    }
  }

  /**
   * remove keyboard control events
   */
  protected _removeKeyboardControlEvents(): void {
    if (this._keyboardEventAdded) {
      window.removeEventListener('keydown', this._handleKeydownEvent);
      this._keyboardEventAdded = false;
    }
  }

  /**
   * reset `focusedIndex`
   */
  resetFocusedIndex(): void {
    this.focusedIndex = -1;
  }
}
