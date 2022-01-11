import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxComponent } from './checkbox.component';
import {IconModule} from '@tk-ui/components/icon/icon.module';



@NgModule({
  declarations: [
    CheckboxComponent
  ],
  exports: [
    CheckboxComponent
  ],
  imports: [
    CommonModule,
    IconModule
  ]
})
export class CheckboxModule { }
