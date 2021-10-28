import {Directive, HostBinding, Input} from '@angular/core';

export type StrokeButtonColor = 'default';

@Directive({
  selector: '[appStrokeButton]'
})
export class StrokeButtonDirective {
  /**
   * bind button color scheme
   */
  @Input() @HostBinding('attr.tk-color') color: StrokeButtonColor = 'default';

  /**
   * bind stroke button class
   */
  @HostBinding('class.tk-stroke-button') baseClass = true;

  constructor() { }

}
