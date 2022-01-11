import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {OptionItem} from '@tk-ui/models/option-item';

export type OptionControlType = 'boolean' | 'select' | 'number' | 'text' | 'number[]' | 'text[]';

export interface OptionControl {
  // option control type
  type: OptionControlType;
  // option name
  name: string;
  // option value
  value: any;
  // required field or not
  required?: boolean;
  // options for select type
  options?: OptionItem<string>[];
}

@Component({
  selector: 'app-option-control-item',
  templateUrl: './option-control-item.component.html',
  styleUrls: ['./option-control-item.component.scss']
})
export class OptionControlItemComponent implements OnInit {
  // option control data
  @Input() data!: OptionControl;

  constructor() { }

  ngOnInit(): void {
  }

  @HostBinding('class.has-multi') get hasMulti(): boolean {
    return this.data.type === 'number[]' || this.data.type === 'text[]';
  }

  onMultiValueChange(data: any[], change: any, index: number): void {
    data.splice(index, 1, change);
  }

  trackBy(index: number) {
    return index;
  }
}
