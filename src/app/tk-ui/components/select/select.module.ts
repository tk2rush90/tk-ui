import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectComponent } from './select.component';
import {InputModule} from '@tk-ui/components/input/input.module';
import {FormControlBaseModule} from '@tk-ui/components/form-control-base/form-control-base.module';
import {FormsModule} from '@angular/forms';
import {AutoPositionerModule} from '@tk-ui/components/auto-positioner/auto-positioner.module';
import {AutoCloserModule} from '@tk-ui/components/auto-closer/auto-closer.module';
import {AutoScrollerModule} from '@tk-ui/components/auto-scroller/auto-scroller.module';
import {IconModule} from '@tk-ui/components/icon/icon.module';
import {SelectBaseModule} from '@tk-ui/components/select-base/select-base.module';



@NgModule({
  declarations: [SelectComponent],
  exports: [
    SelectComponent
  ],
  imports: [
    CommonModule,
    SelectBaseModule,
  ]
})
export class SelectModule { }
