import {ChangeDetectorRef, Component, ElementRef, OnInit, Optional, Self} from '@angular/core';
import {NgControl} from '@angular/forms';
import {SelectBaseComponent} from '@tk-ui/components/select-base/select-base.component';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent<T> extends SelectBaseComponent<T> implements OnInit {
  /**
   * override value type from SelectBaseComponent
   */
  value: T | undefined;

  constructor(
    @Self() @Optional() public ngControl: NgControl,
    public elementRef: ElementRef<HTMLElement>,
    protected changeDetectorRef: ChangeDetectorRef,
  ) {
    super(ngControl, elementRef, changeDetectorRef);
  }

  ngOnInit(): void {
  }
}
