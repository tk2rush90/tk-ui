import {ChangeDetectorRef, Directive, ElementRef, HostBinding, HostListener, Input, Optional, Self} from '@angular/core';
import {FormControlBaseDirective} from '@tk-ui/components/form-control-base/form-control-base.directive';
import {NgControl} from '@angular/forms';

@Directive({
  selector: 'input[appInput], textarea[appInput]'
})
export class InputDirective extends FormControlBaseDirective<string> {
  /**
   * bind input type
   */
  @Input() @HostBinding('attr.type') type = 'text';

  /**
   * bind spellcheck attribute
   */
  @Input() @HostBinding('attr.spellcheck') spellcheck = false;

  /**
   * bind autocomplete attribute
   */
  @Input() @HostBinding('attr.autocomplete') autocomplete = 'off';

  /**
   * bind placeholder attribute
   */
  @Input() @HostBinding('attr.placeholder') placeholder = '';

  /**
   * max value for number type
   */
  @Input() max: number | undefined;

  /**
   * min value for number type
   */
  @Input() min: number | undefined;

  /**
   * bind base class
   */
  @HostBinding('class.tk-input-field') baseClass = true;

  constructor(
    @Self() @Optional() public ngControl: NgControl,
    protected changeDetectorRef: ChangeDetectorRef,
    private elementRef: ElementRef<HTMLInputElement>,
  ) {
    super(ngControl, changeDetectorRef);
  }

  /**
   * write value to input
   * @param value new value
   */
  writeValue(value: string | undefined): void {
    const el = this.elementRef?.nativeElement;

    if (el) {
      if (this.type === 'number') {
        el.value = value || '0';
      } else {
        el.value = value || '';
      }
    }
  }

  /**
   * add `input` listener to update FormControl's value
   */
  @HostListener('input', ['$event'])
  onHostInput(event: InputEvent): void {
    const el = this.elementRef?.nativeElement;

    if (el) {
      switch (this.type) {
        case 'number': {
          if (event.data === '-') {
            if (el.value) {
              this.setValue(el.value);
            }
          } else {
            this.setValue(el.value);
          }

          break;
        }

        default: {
          this.setValue(el.value);
        }
      }
    }
  }

  /**
   * add `blur` listener to call `markAsTouched()`
   */
  @HostListener('blur')
  onHostBlur(): void {
    this.markAsTouched();
  }
}
