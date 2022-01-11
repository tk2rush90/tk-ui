import { Component, OnInit } from '@angular/core';
import {BarChartData, BarChartOptions} from '@tk-ui/charts/bar-chart/bar-chart.component';
import {OptionsController} from '../../../components/common/options-controller/options-controller.component';
import {RandomUtil} from '@tk-ui/utils/random.util';
import {OptionItem} from '@tk-ui/models/option-item';

@Component({
  selector: 'app-bar-chart-drawer',
  templateUrl: './bar-chart-drawer.component.html',
  styleUrls: ['./bar-chart-drawer.component.scss']
})
export class BarChartDrawerComponent implements OnInit {
  // chart options
  barChartOptions!: BarChartOptions;

  // option controller
  optionController: OptionsController = new OptionsController([
    {
      name: 'animate',
      type: 'boolean',
      value: true,
    },
    {
      name: 'animationDuration',
      type: 'number',
      value: '300',
    },
    {
      name: 'min',
      type: 'number',
      value: '0',
    },
    {
      name: 'max',
      type: 'number',
      value: '300',
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
      name: 'scaleLength',
      type: 'number',
      value: 5,
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
   * create bar chart data
   */
  createChart(): void {
    const length = RandomUtil.number(2, 20);
    const data: BarChartData[] = [];

    for (let i = 0; i < length; i++) {
      data.push({
        label: `Data ${i + 1}`,
        value: RandomUtil.number(0, 300),
        color: RandomUtil.color(),
      });
    }

    this.barChartOptions = {
      ...this.optionController.optionValues,
      data,
    };
  }
}
