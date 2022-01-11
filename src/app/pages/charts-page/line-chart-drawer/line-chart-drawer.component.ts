import { Component, OnInit } from '@angular/core';
import {LineChartOptions} from '@tk-ui/charts/line-chart/line-chart.component';
import {RandomUtil} from '@tk-ui/utils/random.util';
import {
  GridChartData,
} from '@tk-ui/charts/grid-chart-base/grid-chart-base';
import {OptionsController} from '../../../components/common/options-controller/options-controller.component';
import {OptionItem} from '@tk-ui/models/option-item';

@Component({
  selector: 'app-line-chart-drawer',
  templateUrl: './line-chart-drawer.component.html',
  styleUrls: ['./line-chart-drawer.component.scss']
})
export class LineChartDrawerComponent implements OnInit {
  // line options
  lineChartOptions!: LineChartOptions;

  // options controller
  optionsController: OptionsController = new OptionsController([
    {
      name: 'animate',
      type: 'boolean',
      value: true,
    },
    {
      name: 'animationDuration',
      type: 'number',
      value: 300,
    },
    {
      name: 'min',
      type: 'number',
      value: 0,
    },
    {
      name: 'max',
      type: 'number',
      value: 300,
      required: true,
    },
    {
      name: 'grid',
      type: 'select',
      value: 'none',
      options: [
        new OptionItem<string>('None', 'none'),
        new OptionItem<string>('Vertical', 'vertical'),
        new OptionItem<string>('Horizontal', 'horizontal'),
        new OptionItem<string>('Both', 'both'),
      ],
    },
    {
      name: 'label',
      type: 'select',
      value: 'both',
      options: [
        new OptionItem<string>('None', 'none'),
        new OptionItem<string>('Data', 'data'),
        new OptionItem<string>('Grid', 'grid'),
        new OptionItem<string>('Both', 'both'),
      ],
    },
    {
      name: 'direction',
      type: 'select',
      value: 'vertical',
      options: [
        new OptionItem<string>('Vertical', 'vertical'),
        new OptionItem<string>('Horizontal', 'horizontal'),
      ],
    },
    {
      name: 'scaleLength',
      type: 'number',
      value: 5,
    },
    {
      name: 'gridColor',
      type: 'text',
      value: '#ccc',
    },
    {
      name: 'gridWidth',
      type: 'number',
      value: 1,
    },
    {
      name: 'labelColor',
      type: 'text',
      value: '#000',
    },
    {
      name: 'labelSize',
      type: 'number',
      value: 10,
    },
    {
      name: 'lineColor',
      type: 'text',
      value: '#000',
    },
    {
      name: 'lineWidth',
      type: 'number',
      value: 1,
    },
    {
      name: 'pointRadius',
      type: 'number',
      value: 5,
    },
    {
      name: 'pointColor',
      type: 'text',
      value: '#000',
    },
    {
      name: 'pointStrokeWidth',
      type: 'number',
      value: 0,
    },
    {
      name: 'pointStrokeColor',
      type: 'text',
      value: '#fff',
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
   * create line chart data
   */
  createChart(): void {
    const length = RandomUtil.number(2, 20);
    const data: GridChartData[] = [];

    for (let i = 0; i < length; i++) {
      data.push({
        label: `Data ${i + 1}`,
        value: RandomUtil.number(0, 300),
      });
    }

    this.lineChartOptions = {
      ...this.optionsController.optionValues,
      data,
    };
  }
}
