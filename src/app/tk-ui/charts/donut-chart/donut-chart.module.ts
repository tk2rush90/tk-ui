import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DonutChartComponent } from './donut-chart.component';



@NgModule({
  declarations: [
    DonutChartComponent
  ],
  exports: [
    DonutChartComponent
  ],
  imports: [
    CommonModule
  ]
})
export class DonutChartModule { }
