import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {OptionControl} from './option-control-item/option-control-item.component';
import {ObjectUtil} from '@tk-ui/utils/object.util';

export class OptionsController {
  // options
  options: OptionControl[] = [];

  constructor(options: OptionControl[]) {
    this.options = options;
  }

  /**
   * return option values
   */
  get optionValues(): any {
    const values: any = {};

    this.options.forEach(option => {
      const value = option.type === 'number' ? parseFloat(option.value) : option.value;

      ObjectUtil.setObjectValue(values, option.name, value);
    });

    return values;
  }
}

@Component({
  selector: 'app-options-controller',
  templateUrl: './options-controller.component.html',
  styleUrls: ['./options-controller.component.scss']
})
export class OptionsControllerComponent implements OnInit {
  // options controller
  @Input() controller: OptionsController = new OptionsController([]);

  // confirm click emitter
  @Output() confirmClick: EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * handle confirm click event
   */
  onConfirmClick(): void {
    this._emitConfirmClick();
  }

  /**
   * emit confirm click
   */
  private _emitConfirmClick(): void {
    this.confirmClick.emit();
  }
}
