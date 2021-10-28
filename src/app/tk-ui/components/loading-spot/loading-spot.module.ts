import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpotComponent } from './loading-spot.component';



@NgModule({
  declarations: [LoadingSpotComponent],
  exports: [
    LoadingSpotComponent
  ],
  imports: [
    CommonModule
  ]
})
export class LoadingSpotModule { }
