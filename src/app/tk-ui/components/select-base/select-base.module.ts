import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectBaseComponent } from './select-base.component';
import {InputModule} from '@tk-ui/components/input/input.module';
import {FormControlBaseModule} from '@tk-ui/components/form-control-base/form-control-base.module';
import {FormsModule} from '@angular/forms';
import {AutoPositionerModule} from '@tk-ui/components/auto-positioner/auto-positioner.module';
import {AutoCloserModule} from '@tk-ui/components/auto-closer/auto-closer.module';
import {AutoScrollerModule} from '@tk-ui/components/auto-scroller/auto-scroller.module';
import {IconModule} from '@tk-ui/components/icon/icon.module';



@NgModule({
  declarations: [SelectBaseComponent],
  imports: [
    CommonModule,
    InputModule,
    FormControlBaseModule,
    FormsModule,
    AutoPositionerModule,
    AutoCloserModule,
    AutoScrollerModule,
    IconModule,
  ],
  exports: [
    SelectBaseComponent,
    InputModule,
    FormControlBaseModule,
    FormsModule,
    AutoPositionerModule,
    AutoCloserModule,
    AutoScrollerModule,
    IconModule,
  ]
})
export class SelectBaseModule { }
