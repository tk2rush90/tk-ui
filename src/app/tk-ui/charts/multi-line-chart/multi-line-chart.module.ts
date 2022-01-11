import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiLineChartComponent } from './multi-line-chart.component';



@NgModule({
  declarations: [
    MultiLineChartComponent
  ],
  exports: [
    MultiLineChartComponent
  ],
  imports: [
    CommonModule
  ]
})
export class MultiLineChartModule { }
