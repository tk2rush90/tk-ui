import {ChangeDetectorRef, Component, ElementRef, OnInit, Optional, Self} from '@angular/core';
import {SelectBaseComponent} from '@tk-ui/components/select-base/select-base.component';
import {NgControl} from '@angular/forms';
import {OptionItem} from '@tk-ui/models/option-item';

@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: [
    '../select/select.component.scss',
    './multi-select.component.scss'
  ]
})
export class MultiSelectComponent<T> extends SelectBaseComponent<T> implements OnInit {
  /**
   * selected values
   */
  value: T[] = [];

  /**
   * override default value
   */
  protected _defaultValue: T[] = [];

  constructor(
    @Self() @Optional() public ngControl: NgControl,
    public elementRef: ElementRef<HTMLElement>,
    protected changeDetectorRef: ChangeDetectorRef,
  ) {
    super(ngControl, elementRef, changeDetectorRef);
  }

  ngOnInit(): void {
  }

  /**
   * override `open()` method
   * do not set `focusedIndex` when opened
   */
  open(): void {
    this.opened = true;
    this._setFocusedIndex();
    this._addKeyboardControlEvents();
  }

  /**
   * set `focusedIndex` with last value
   */
  private _setFocusedIndex(): void {
    const last = [...this.value].pop();
    this.focusedIndex = this._options.findIndex(item => item.value === last);
  }

  /**
   * override `writeValue()` method
   * @param value value to write
   */
  writeValue(value: any): void {
    super.writeValue(value || []);
  }

  /**
   * override `onOptionClicked()` method
   * @param option option
   */
  onOptionClicked(option: OptionItem<T>): void {
    this.setValue(this._getNewValue(option.value));
  }

  /**
   * return the new value to set
   * @param value value
   */
  private _getNewValue(value: T): T[] {
    if (this.isValueSelected(value)) {
      return this.value.filter(item => item !== value);
    } else {
      return [...this.value, value];
    }
  }

  /**
   * return `true` when value is already selected
   * @param value value to check
   */
  isValueSelected(value: T): boolean {
    return this.value.indexOf(value) !== -1;
  }

  /**
   * override `_setSelectedLabel()` method
   */
  protected _setSelectedLabel(): void {
    const options = this._options.filter(item => this.value.indexOf(item.value) !== -1);

    if (options.length > 0) {
      this.label = options.map(item => item.label).join(', ');
    } else {
      this.label = '';
    }
  }
}
