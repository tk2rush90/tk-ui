import {AfterViewInit, ChangeDetectorRef, Directive, Optional, Self} from '@angular/core';
import {AbstractControl, ControlValueAccessor, NgControl, ValidationErrors} from '@angular/forms';

@Directive({
  selector: '[appFormControlBase]'
})
export class FormControlBaseDirective<T> implements AfterViewInit, ControlValueAccessor {
  /**
   * registered `onChange()` function
   */
  private _onChange: any;

  /**
   * registered `onTouched()` function
   */
  private _onTouched: any;

  /**
   * default value of form control
   */
  protected _defaultValue: any;

  constructor(
    @Self() @Optional() public ngControl: NgControl,
    protected changeDetectorRef: ChangeDetectorRef,
  ) {
    if (ngControl) {
      ngControl.valueAccessor = this;
    }
  }

  /**
   * write current value when view init
   */
  ngAfterViewInit(): void {
    this.writeValue(this.getValue() || this._defaultValue);
    this.changeDetectorRef.detectChanges();
  }

  /**
   * return the touched state
   */
  get touched(): boolean {
    return this._getControlField('touched');
  }

  /**
   * return the dirty state
   */
  get dirty(): boolean {
    return this._getControlField('dirty');
  }

  /**
   * return the invalid state
   */
  get invalid(): boolean {
    return this._getControlField('invalid');
  }

  /**
   * set value
   * @param value value to set
   */
  setValue(value: any): void {
    this.markAsDirty(value);
    this._callControlMethod('setValue', value);
  }

  /**
   * return form control value
   */
  getValue(): any {
    return this._getControlField('value');
  }

  /**
   * disable the control
   */
  setDisable(): void {
    this._callControlMethod('disable');
  }

  /**
   * enable the control
   */
  setEnable(): void {
    this._callControlMethod('enable');
  }

  /**
   * should override this method from the extended component
   * @param value value to set
   */
  writeValue(value: any): void {
  }

  /**
   * register change function
   * @param fn change function
   */
  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  /**
   * register touched function
   * @param fn touched function
   */
  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
  }

  /**
   * mark as touched
   */
  markAsTouched(): void {
    if (this._onTouched) {
      this._onTouched();
    }
  }

  /**
   * mark as dirty
   * @param value new value
   */
  markAsDirty(value?: any): void {
    if (this._onChange) {
      this._onChange(value);
    }
  }

  /**
   * set validation errors
   * @param errors errors
   */
  setErrors(errors: ValidationErrors): void {
    this._callControlMethod('setErrors', errors);
  }

  /**
   * get errors from control
   */
  getErrors(): ValidationErrors {
    const errors: any = {};
    const previousErrors = this._getControlField('errors') || {};

    Object.keys(previousErrors).forEach(key => {
      errors[key] = previousErrors[key];
    });

    return errors;
  }

  /**
   * return host control
   */
  getControl(): AbstractControl | void {
    if (this.ngControl && this.ngControl.control) {
      return this.ngControl.control;
    }
  }

  /**
   * get control field with checking control existence
   * @param field field of control
   */
  private _getControlField(field: keyof AbstractControl): any {
    const control = this.getControl();

    if (control) {
      return control[field];
    }
  }

  /**
   * call control method with checking control existence
   * @param method method to call
   * @param params params for method
   */
  private _callControlMethod(method: keyof AbstractControl, ...params: any): void {
    const control = this.getControl();

    if (control) {
      control[method](...params);
    }
  }
}
