import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlatButtonDirective } from './flat-button.directive';



@NgModule({
  declarations: [FlatButtonDirective],
  exports: [
    FlatButtonDirective
  ],
  imports: [
    CommonModule
  ]
})
export class FlatButtonModule { }
