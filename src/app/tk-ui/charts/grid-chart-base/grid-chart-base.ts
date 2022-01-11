import * as d3 from 'd3';
import {ElementRef} from '@angular/core';
import {ChartPaddings} from '@tk-ui/charts/models/chart-paddings';

export interface GridChartData<T = number> {
  label: string;
  value: T;
}

export interface GridChartGrid {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface GridChartLabel {
  label: string | string[];
  x: number;
  y: number;
}

export type GridChartDirection = 'vertical' | 'horizontal';
export type GridChartGridType = 'vertical' | 'horizontal' | 'both' | 'none';
export type GridChartLabelType = 'data' | 'grid' | 'none' | 'both';

export interface GridChartOptions<T = number> {
  // min value
  // default is `0`
  min?: number;
  // max value
  // this should be calculated from outer component
  max: number;
  // grid display type
  // default is `none`
  grid?: GridChartGridType;
  // set value scale length
  // default is `5`
  scaleLength?: number;
  // bar chart direction
  // default is `vertical`
  direction?: GridChartDirection;
  // label display type
  // default is `both`
  label?: GridChartLabelType;
  // bar chart data
  data: GridChartData<T>[];
  // grid color
  // default is `#ccc`
  gridColor?: string;
  // grid width
  // default is `1`
  gridWidth?: number;
  // label color
  // default is `#000`
  labelColor?: string;
  // label size
  // default is `14`
  labelSize?: number;
  // set paddings
  // default is all to `20`
  paddings?: ChartPaddings;
}

export class GridChartBase<T = number> {
  // x labels
  xLabels: GridChartLabel[] = [];

  // y labels
  yLabels: GridChartLabel[] = [];

  // x grids
  xGrids: GridChartGrid[] = [];

  // y grids
  yGrids: GridChartGrid[] = [];

  // chart options
  protected _options!: GridChartOptions<T>;

  // label group width for y labels
  protected _labelWidth = 50;

  // label group height for x labels
  protected _labelHeight = 40;

  // data scale
  protected _dataScale!: d3.ScaleLinear<any, any>;

  // grid scale
  protected _gridScale!: d3.ScaleLinear<any, any>;

  constructor(
    protected elementRef: ElementRef<HTMLElement>
  ) { }

  /**
   * return chart paddings
   */
  get paddings(): ChartPaddings {
    return this.options.paddings || {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20,
    };
  }

  /**
   * return left padding
   */
  get leftPadding(): number {
    return this.paddings.left;
  }

  /**
   * return right padding
   */
  get rightPadding(): number {
    return this.paddings.right;
  }

  /**
   * return top padding
   */
  get topPadding(): number {
    return this.paddings.top;
  }

  /**
   * return bottom padding
   */
  get bottomPadding(): number {
    return this.paddings.bottom;
  }

  /**
   * return vertical paddings
   */
  get verticalPaddings(): number {
    return this.topPadding + this.bottomPadding;
  }

  /**
   * return horizontal paddings
   */
  get horizontalPaddings(): number {
    return this.leftPadding + this.rightPadding;
  }

  /**
   * return chart drawable area width
   * excluding label area and paddings
   */
  get chartWidth(): number {
    return this.width - this.labelWidth - this.horizontalPaddings;
  }

  /**
   * return chart drawable area height
   * excluding label area and paddings
   */
  get chartHeight(): number {
    return this.height - this.labelHeight - this.verticalPaddings;
  }

  /**
   * return chart drawable area right
   * excluding label area
   */
  get chartRight(): number {
    return this.width - this.rightPadding;
  }

  /**
   * return chart drawable area bottom
   * excluding bottom label area and bottom padding
   */
  get chartBottom(): number {
    return this.height - this.labelHeight - this.bottomPadding;
  }

  /**
   * return chart drawable area left
   */
  get chartLeft(): number {
    return this.labelWidth + this.leftPadding;
  }

  /**
   * return label width
   */
  get labelWidth(): number {
    switch (this.direction) {
      case 'vertical': {
        return this.showGridLabel ? this._labelWidth : 0;
      }

      case 'horizontal': {
        return this.showDataLabel ? this._labelWidth : 0;
      }
    }
  }

  /**
   * return label height
   */
  get labelHeight(): number {
    switch (this.direction) {
      case 'vertical': {
        return this.showDataLabel ? this._labelHeight : 0;
      }

      case 'horizontal': {
        return this.showGridLabel ? this._labelHeight : 0;
      }
    }
  }

  /**
   * return direction
   */
  get direction(): GridChartDirection {
    return this.options.direction || 'vertical';
  }

  /**
   * return width
   */
  get width(): number {
    return this.elementRef.nativeElement.getBoundingClientRect().width;
  }

  /**
   * return height
   */
  get height(): number {
    return this.elementRef.nativeElement.getBoundingClientRect().height;
  }

  /**
   * return show grid state
   */
  get showGrid(): boolean {
    return this.grid !== 'none';
  }

  /**
   * return true when having x labels
   */
  get canShowXLabels(): boolean {
    return this.xLabels.length > 0;
  }

  /**
   * return true when having y labels
   */
  get canShowYLabels(): boolean {
    return this.yLabels.length > 0;
  }

  /**
   * return true when having x grids
   */
  get canShowXGrids(): boolean {
    return this.xGrids.length > 0;
  }

  /**
   * return true when having y grids
   */
  get canShowYGrids(): boolean {
    return this.yGrids.length > 0;
  }

  /**
   * return true when chart can show data label
   */
  get showDataLabel(): boolean {
    return this.label === 'data' || this.label === 'both';
  }

  /**
   * return true when chart can show grid label
   */
  get showGridLabel(): boolean {
    return this.label === 'grid' || this.label === 'both';
  }

  /**
   * return label type
   */
  get label(): GridChartLabelType {
    return this.options.label || 'both';
  }

  /**
   * return grid type
   */
  get grid(): GridChartGridType {
    return this.options.grid || 'none';
  }

  /**
   * return bar chart options
   */
  get options(): GridChartOptions<T> {
    return this._options || {} as any;
  }

  /**
   * return label color
   */
  get labelColor(): string {
    return this.options.labelColor || '#000';
  }

  /**
   * return label size
   */
  get labelSize(): number {
    return this.options.labelSize || 14;
  }

  /**
   * return grid color
   */
  get gridColor(): string {
    return this.options.gridColor || '#ccc';
  }

  /**
   * return grid width
   */
  get gridWidth(): number {
    return this.options.gridWidth || 1;
  }

  /**
   * create scales for data and grid
   */
  protected _createScales(): void {
    this._createDataScale();
    this._createGridScale();
  }

  /**
   * create data scale
   */
  protected _createDataScale(): void {
    const {data = []} = this.options;
    const scale = d3.scaleLinear()
      .domain([0, data.length - 1]);

    switch (this.direction) {
      case 'vertical': {
        const dataWidthHalf = this.chartWidth / data.length / 2;

        // left to right
        this._dataScale = scale.range([
          this.chartLeft + dataWidthHalf,
          this.chartRight - dataWidthHalf,
        ]);

        break;
      }

      case 'horizontal': {
        const dataHeightHalf = this.chartHeight / data.length / 2;

        // top to bottom
        this._dataScale = scale.range([
          this.topPadding + dataHeightHalf,
          this.chartBottom - dataHeightHalf,
        ]);

        break;
      }
    }
  }

  /**
   * create grid scale
   */
  protected _createGridScale(): void {
    const {scaleLength = 5} = this.options;

    switch (this.direction) {
      case 'vertical': {
        this._gridScale = d3.scaleLinear()
          .domain([
            0,
            scaleLength,
          ])
          .range([
            this.chartBottom,
            this.topPadding,
          ]);

        break;
      }

      case 'horizontal': {
        this._gridScale = d3.scaleLinear()
          .domain([
            0,
            scaleLength,
          ])
          .range([
            this.chartLeft,
            this.chartRight,
          ]);

        break;
      }
    }
  }

  /**
   * create labels
   */
  protected _createLabels(): void {
    // clear labels
    this.xLabels = [];
    this.yLabels = [];

    if (this.showDataLabel) {
      this._createLabelsForData();
    }

    if (this.showGridLabel) {
      this._createLabelsForGrid();
    }
  }

  /**
   * create labels for data
   */
  protected _createLabelsForData(): void {
    switch (this.direction) {
      // for vertical bar chart
      case 'vertical': {
        this._createVerticalChartDataLabel();
        break;
      }

      // for horizontal bar chart
      case 'horizontal': {
        this._createHorizontalChartDataLabel();
        break;
      }
    }
  }

  /**
   * create vertical chart data label
   */
  protected _createVerticalChartDataLabel(): void {
    const {data = []} = this.options;
    const scale = this._dataScale;
    const y = this.chartBottom + (this.labelHeight / 2);

    this.xLabels = data.map((item, index) => {
      const x = scale(index);

      return {
        label: item.label,
        x,
        y,
      };
    });
  }

  /**
   * create horizontal chart data label
   */
  protected _createHorizontalChartDataLabel(): void {
    const {data = []} = this.options;
    const scale = this._dataScale;

    this.yLabels = data.map((item, index) => {
      const y = scale(index);

      return {
        label: item.label,
        x: this.leftPadding,
        y,
      };
    });
  }

  /**
   * create labels for grid
   */
  protected _createLabelsForGrid(): void {
    switch (this.direction) {
      // for vertical bar chart
      case 'vertical': {
        this._createVerticalChartGridLabel();
        break;
      }

      // for horizontal bar chart
      case 'horizontal': {
        this._createHorizontalChartGridLabel();
        break;
      }
    }
  }

  /**
   * create vertical chart grid label
   */
  protected _createVerticalChartGridLabel(): void {
    const {scaleLength = 5, min = 0, max} = this.options;
    const step = (max - min) / scaleLength;
    const scale = this._gridScale;

    for (let i = 0; i <= scaleLength; i++) {
      const y = scale(i);

      this.yLabels.push({
        label: `${step * i + min}`,
        x: this.leftPadding,
        y,
      });
    }
  }

  /**
   * create horizontal chart grid label
   */
  protected _createHorizontalChartGridLabel(): void {
    const {scaleLength = 5, min = 0, max,} = this.options;
    const step = (max - min) / scaleLength;
    const scale = this._gridScale;
    const y = this.chartBottom + (this.labelHeight / 2);

    for (let i = 0; i <= scaleLength; i++) {
      const x = scale(i);

      this.xLabels.push({
        label: `${step * i + min}`,
        x,
        y,
      });
    }
  }

  /**
   * create grid lines
   */
  protected _createGridLines(): void {
    // clear grids
    this.xGrids = [];
    this.yGrids = [];

    if (this.showGrid) {
      switch (this.direction) {
        case 'vertical': {
          this._createVerticalChartGrid();
          break;
        }

        case 'horizontal': {
          this._createHorizontalChartGrid();
          break;
        }
      }
    }
  }

  /**
   * create grid for vertical chart
   */
  protected _createVerticalChartGrid(): void {
    switch (this.grid) {
      case 'vertical': {
        this._createVerticalGridForVerticalChart();
        break;
      }

      case 'horizontal': {
        this._createHorizontalGridForVerticalChart();
        break;
      }

      case 'both': {
        this._createVerticalGridForVerticalChart();
        this._createHorizontalGridForVerticalChart();
        break;
      }
    }
  }

  /**
   * create vertical grid for vertical chart
   */
  protected _createVerticalGridForVerticalChart(): void {
    const {data = []} = this.options;
    const scale = this._dataScale;
    const widthFragment = this.chartWidth / data.length / 2;

    const y1 = this.topPadding;
    const y2 = this.chartBottom;

    this.yGrids = data.map((item, index) => {
      const x = scale(index) - widthFragment;

      return {
        x1: x,
        y1,
        x2: x,
        y2,
      };
    });

    this.yGrids.push({
      x1: this.chartRight,
      y1,
      x2: this.chartRight,
      y2,
    });
  }

  /**
   * create horizontal grid for vertical chart
   */
  protected _createHorizontalGridForVerticalChart(): void {
    const {scaleLength = 5} = this.options;
    const scale = this._gridScale;
    const x1 = this.chartLeft;
    const x2 = this.chartRight;

    for (let i = 0; i <= scaleLength; i++) {
      const y = scale(i);

      this.xGrids.push({
        x1,
        y1: y,
        x2,
        y2: y,
      });
    }
  }

  /**
   * create horizontal chart grid
   */
  protected _createHorizontalChartGrid(): void {
    switch (this.grid) {
      case 'vertical': {
        this._createVerticalGridForHorizontalChart();
        break;
      }

      case 'horizontal': {
        this._createHorizontalGridForHorizontalChart();
        break;
      }

      case 'both': {
        this._createVerticalGridForHorizontalChart();
        this._createHorizontalGridForHorizontalChart();
        break;
      }
    }
  }

  /**
   * create vertical grid for horizontal chart
   */
  protected _createVerticalGridForHorizontalChart(): void {
    const {scaleLength = 5} = this.options;
    const scale = this._gridScale;
    const y1 = this.topPadding;
    const y2 = this.chartBottom;

    for (let i = 0; i <= scaleLength; i++) {
      const x = scale(i);

      this.yGrids.push({
        x1: x,
        y1,
        x2: x,
        y2,
      });
    }
  }

  /**
   * create horizontal grid for horizontal chart
   */
  protected _createHorizontalGridForHorizontalChart(): void {
    const {data = []} = this.options;
    const scale = this._dataScale;
    const x1 = this.chartLeft;
    const x2 = this.chartRight;
    const heightFragment = this.chartHeight / data.length / 2;

    this.xGrids = data.map((item, index) => {
      const y = scale(index) - heightFragment;

      return {
        x1,
        y1: y,
        x2,
        y2: y,
      };
    });

    this.xGrids.push({
      x1,
      y1: this.chartBottom,
      x2,
      y2: this.chartBottom,
    });
  }
}
