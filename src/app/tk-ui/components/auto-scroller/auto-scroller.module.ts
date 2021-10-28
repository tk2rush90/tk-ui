import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoScrollContainerDirective } from './auto-scroll-container.directive';
import { AutoScrollItemDirective } from './auto-scroll-item.directive';



@NgModule({
  declarations: [AutoScrollContainerDirective, AutoScrollItemDirective],
  exports: [
    AutoScrollContainerDirective,
    AutoScrollItemDirective
  ],
  imports: [
    CommonModule
  ]
})
export class AutoScrollerModule { }
