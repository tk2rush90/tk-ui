import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineButtonDirective } from './inline-button.directive';



@NgModule({
  declarations: [InlineButtonDirective],
  exports: [
    InlineButtonDirective
  ],
  imports: [
    CommonModule
  ]
})
export class InlineButtonModule { }
