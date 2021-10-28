import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiSelectComponent } from './multi-select.component';
import {SelectBaseModule} from '@tk-ui/components/select-base/select-base.module';



@NgModule({
  declarations: [MultiSelectComponent],
  exports: [
    MultiSelectComponent
  ],
  imports: [
    CommonModule,
    SelectBaseModule,
  ]
})
export class MultiSelectModule { }
