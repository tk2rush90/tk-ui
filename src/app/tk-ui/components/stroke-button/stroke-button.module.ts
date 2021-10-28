import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StrokeButtonDirective } from './stroke-button.directive';



@NgModule({
  declarations: [StrokeButtonDirective],
  exports: [
    StrokeButtonDirective
  ],
  imports: [
    CommonModule
  ]
})
export class StrokeButtonModule { }
