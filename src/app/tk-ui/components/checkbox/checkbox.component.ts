import {ChangeDetectorRef, Component, HostBinding, HostListener, OnInit, Optional, Self} from '@angular/core';
import {FormControlBaseDirective} from '@tk-ui/components/form-control-base/form-control-base.directive';
import {NgControl} from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent extends FormControlBaseDirective<boolean> implements OnInit {
  // value
  // bind to checked class
  @HostBinding('class.tk-checked') value = false;

  constructor(
    @Self() @Optional() public ngControl: NgControl,
    protected changeDetectorRef: ChangeDetectorRef,
  ) {
    super(
      ngControl,
      changeDetectorRef,
    );

    this._defaultValue = false;
  }

  ngOnInit(): void {
  }

  /**
   * override write value
   * @param value value
   */
  writeValue(value: boolean): void {
    this.value = value || false;
  }

  /**
   * listen host click event
   */
  @HostListener('click')
  onHostClick(): void {
    this.setValue(!this.value);
    this.markAsTouched();
  }
}
