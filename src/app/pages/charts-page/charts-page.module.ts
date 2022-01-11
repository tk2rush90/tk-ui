import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChartsPageRoutingModule } from './charts-page-routing.module';
import { ChartsPageComponent } from './charts-page.component';
import {BarChartModule} from '@tk-ui/charts/bar-chart/bar-chart.module';
import {DonutChartModule} from '@tk-ui/charts/donut-chart/donut-chart.module';
import {LineChartModule} from '@tk-ui/charts/line-chart/line-chart.module';
import { DonutChartDrawerComponent } from './donut-chart-drawer/donut-chart-drawer.component';
import {FlatButtonModule} from '@tk-ui/components/flat-button/flat-button.module';
import {OptionsControllerModule} from '../../components/common/options-controller/options-controller.module';
import {CodeViewerModule} from '../../components/common/code-viewer/code-viewer.module';
import { BarChartDrawerComponent } from './bar-chart-drawer/bar-chart-drawer.component';
import { LineChartDrawerComponent } from './line-chart-drawer/line-chart-drawer.component';
import { MultiLineChartDrawerComponent } from './multi-line-chart-drawer/multi-line-chart-drawer.component';
import {MultiLineChartModule} from '@tk-ui/charts/multi-line-chart/multi-line-chart.module';


@NgModule({
  declarations: [
    ChartsPageComponent,
    DonutChartDrawerComponent,
    BarChartDrawerComponent,
    LineChartDrawerComponent,
    MultiLineChartDrawerComponent,
  ],
  imports: [
    CommonModule,
    ChartsPageRoutingModule,
    BarChartModule,
    DonutChartModule,
    LineChartModule,
    FlatButtonModule,
    OptionsControllerModule,
    CodeViewerModule,
    MultiLineChartModule
  ]
})
export class ChartsPageModule { }
