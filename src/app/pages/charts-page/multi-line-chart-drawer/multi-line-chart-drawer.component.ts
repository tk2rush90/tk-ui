import { Component, OnInit } from '@angular/core';
import {OptionsController} from '../../../components/common/options-controller/options-controller.component';
import {OptionItem} from '@tk-ui/models/option-item';
import {RandomUtil} from '@tk-ui/utils/random.util';
import {GridChartData} from '@tk-ui/charts/grid-chart-base/grid-chart-base';
import {MultiLineChartOptions} from '@tk-ui/charts/multi-line-chart/multi-line-chart.component';
import {
  OptionControl
} from '../../../components/common/options-controller/option-control-item/option-control-item.component';

@Component({
  selector: 'app-multi-line-chart-drawer',
  templateUrl: './multi-line-chart-drawer.component.html',
  styleUrls: ['./multi-line-chart-drawer.component.scss']
})
export class MultiLineChartDrawerComponent implements OnInit {
  // line options
  multiLineChartOptions!: MultiLineChartOptions;

  private _lineColors: OptionControl = {
    name: 'lineColors',
    type: 'text[]',
    value: [],
  };

  private _lineWidths: OptionControl = {
    name: 'lineWidths',
    type: 'number[]',
    value: [],
  };

  private _pointRadius: OptionControl = {
    name: 'pointRadius',
    type: 'number[]',
    value: [],
  };

  private _pointColors: OptionControl = {
    name: 'pointColors',
    type: 'text[]',
    value: [],
  };

  private _pointStrokeWidths: OptionControl = {
    name: 'pointStrokeWidths',
    type: 'number[]',
    value: [],
  };

  private _pointStrokeColors: OptionControl = {
    name: 'pointStrokeColors',
    type: 'text[]',
    value: [],
  };

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
    this._lineColors,
    this._lineWidths,
    this._pointRadius,
    this._pointColors,
    this._pointStrokeWidths,
    this._pointStrokeColors,
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

  constructor() {
  }

  ngOnInit(): void {
    this.createChart();
  }

  /**
   * create line chart data
   */
  createChart(): void {
    const length = RandomUtil.number(2, 20);
    const length2 = RandomUtil.number(2, 4);
    const data: GridChartData<number[]>[] = [];

    for (let i = 0; i < length; i++) {
      const values = [];
      this._lineColors.value = [];
      this._lineWidths.value = [];
      this._pointRadius.value = [];
      this._pointColors.value = [];
      this._pointStrokeWidths.value = [];
      this._pointStrokeColors.value = [];

      for (let j = 0; j < length2; j++) {
        values.push(RandomUtil.number(0, 300));
        this._lineColors.value.push(RandomUtil.color());
        this._lineWidths.value.push(RandomUtil.number(1, 3));
        this._pointRadius.value.push(RandomUtil.number(5, 10));
        this._pointColors.value.push(RandomUtil.color());
        this._pointStrokeWidths.value.push(RandomUtil.number(1, 5));
        this._pointStrokeColors.value.push(RandomUtil.color());
      }

      data.push({
        label: `Data ${i + 1}`,
        value: values,
      });
    }

    this.multiLineChartOptions = {
      ...this.optionsController.optionValues,
      data,
    };
  }
}
