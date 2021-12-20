import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoFocusDirective } from './auto-focus.directive';



@NgModule({
  declarations: [
    AutoFocusDirective
  ],
  exports: [
    AutoFocusDirective
  ],
  imports: [
    CommonModule
  ]
})
export class AutoFocusModule { }
