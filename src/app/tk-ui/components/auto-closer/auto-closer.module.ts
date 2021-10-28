import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoCloserDirective } from './auto-closer.directive';



@NgModule({
  declarations: [AutoCloserDirective],
  exports: [
    AutoCloserDirective
  ],
  imports: [
    CommonModule
  ]
})
export class AutoCloserModule { }
