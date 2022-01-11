import { Component, OnInit } from '@angular/core';
import {DonutChartOptions} from '@tk-ui/charts/donut-chart/donut-chart.component';
import {RandomUtil} from '@tk-ui/utils/random.util';
import {OptionsController} from '../../../components/common/options-controller/options-controller.component';

@Component({
  selector: 'app-donut-chart-drawer',
  templateUrl: './donut-chart-drawer.component.html',
  styleUrls: ['./donut-chart-drawer.component.scss']
})
export class DonutChartDrawerComponent implements OnInit {
  // donut chart options
  donutChartOptions!: DonutChartOptions;

  // options controller
  optionsController: OptionsController = new OptionsController([
    {
      name: 'radiusWidth',
      type: 'number',
      value: '10',
    },
    {
      name: 'showLabel',
      type: 'boolean',
      value: true,
    },
    {
      name: 'animate',
      type: 'boolean',
      value: true,
    },
    {
      name: 'animationDuration',
      type: 'number',
      value: '1000',
    },
    {
      name: 'labelColor',
      type: 'text',
      value: '#000',
    },
    {
      name: 'labelSize',
      type: 'number',
      value: '10',
    },
    {
      name: 'paddings.top',
      type: 'number',
      value: 20,
    },
    {
      name: 'paddings.right',
      type: 'number',
      value: 20,
    },
    {
      name: 'paddings.bottom',
      type: 'number',
      value: 20,
    },
    {
      name: 'paddings.left',
      type: 'number',
      value: 20,
    },
  ]);

  constructor() { }

  ngOnInit(): void {
    this.createChart();
  }

  /**
   * create chart
   */
  createChart(): void {
    const data = [];
    const length = RandomUtil.number(2, 20);

    for (let i = 0; i < length; i++) {
      data.push({
        label: `Data ${i + 1}`,
        value: RandomUtil.number(10, 50),
        color: RandomUtil.color(),
      });
    }

    this.donutChartOptions = {
      ...this.optionsController.optionValues,
      data,
    };
  }
}
