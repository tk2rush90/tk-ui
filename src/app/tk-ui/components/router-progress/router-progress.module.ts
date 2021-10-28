import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterProgressComponent } from './router-progress.component';



@NgModule({
  declarations: [RouterProgressComponent],
  exports: [
    RouterProgressComponent
  ],
  imports: [
    CommonModule
  ]
})
export class RouterProgressModule { }
