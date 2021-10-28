import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoPositionerDirective } from './auto-positioner.directive';



@NgModule({
  declarations: [AutoPositionerDirective],
  exports: [
    AutoPositionerDirective
  ],
  imports: [
    CommonModule
  ]
})
export class AutoPositionerModule { }
