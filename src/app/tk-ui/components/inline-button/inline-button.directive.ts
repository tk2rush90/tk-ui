import {Directive, HostBinding, Input} from '@angular/core';

export type InlineButtonColor = 'default';

@Directive({
  selector: '[appInlineButton]'
})
export class InlineButtonDirective {
  /**
   * bind color attribute
   */
  @Input() @HostBinding('attr.tk-color') color: InlineButtonColor = 'default';

  /**
   * bind base class
   */
  @HostBinding('class.tk-inline-button') baseClass = true;

  constructor() { }

}
