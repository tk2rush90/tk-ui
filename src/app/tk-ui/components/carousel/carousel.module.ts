import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselComponent } from './carousel.component';
import { CarouselContentDirective } from './carousel-content.directive';



@NgModule({
  declarations: [
    CarouselComponent,
    CarouselContentDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CarouselComponent,
    CarouselContentDirective,
  ]
})
export class CarouselModule { }
