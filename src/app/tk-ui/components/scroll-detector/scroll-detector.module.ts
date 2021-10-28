import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollDetectorDirective } from './scroll-detector.directive';



@NgModule({
  declarations: [ScrollDetectorDirective],
  exports: [
    ScrollDetectorDirective
  ],
  imports: [
    CommonModule
  ]
})
export class ScrollDetectorModule { }
