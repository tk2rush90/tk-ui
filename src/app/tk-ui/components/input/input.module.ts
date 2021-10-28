import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputDirective } from './input.directive';
import {FormControlBaseModule} from '@tk-ui/components/form-control-base/form-control-base.module';



@NgModule({
  declarations: [InputDirective],
  exports: [
    InputDirective
  ],
  imports: [
    CommonModule,
    FormControlBaseModule,
  ]
})
export class InputModule { }
