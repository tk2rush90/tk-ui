import {Component, ElementRef, HostListener, Input, OnInit} from '@angular/core';
import {GridChartBase, GridChartData, GridChartOptions} from '@tk-ui/charts/grid-chart-base/grid-chart-base';
import {Animator} from '@tk-ui/utils/animation.util';
import * as d3 from 'd3';

export interface MultiLinePoint {
  x: number;
  y: number;
  data: GridChartData<number[]>;
}

export interface MultiLineChartAnimationOptions {
  start: number[];
  target: number[];
}

export interface MultiLineChartOptions extends GridChartOptions<number[]> {
  // animate state
  // default is `false`
  animate?: boolean;
  // line color list
  // default is `#000`
  lineColors?: string[];
  // line width list
  // default is `1`
  lineWidths?: number[];
  // point radius list
  // default is `5`
  pointRadius?: number[];
  // point color list
  // default is `#000`
  pointColors?: string[];
  // point stroke width list
  // default is `0`
  pointStrokeWidths?: number[];
  // point stroke color list
  // default is `#fff`
  pointStrokeColors?: string[];
  // set animation duration
  // default is `1000`
  animationDuration?: number;
  // events
  onHover?: (event: MouseEvent, point: MultiLinePoint) => void;
  onLeave?: (event: MouseEvent, point: MultiLinePoint) => void;
  onClick?: (event: MouseEvent, point: MultiLinePoint) => void;
}

@Component({
  selector: 'app-multi-line-chart',
  templateUrl: './multi-line-chart.component.html',
  styleUrls: ['./multi-line-chart.component.scss']
})
export class MultiLineChartComponent extends GridChartBase<number[]> implements OnInit {
  // line d group
  lineDGroup: (string | null)[] = [];

  // line points group
  pointsGroup: MultiLinePoint[][] = [];

  // set `true` to not to run animation
  private _suppressAnimation = false;

  // animator
  private _animator = new Animator<number[][]>();

  // line chart animation options
  private _animationOptions: MultiLineChartAnimationOptions[] = [];

  constructor(
    protected elementRef: ElementRef<HTMLElement>
  ) {
    super(elementRef);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this._createChart();
  }

  ngOnDestroy(): void {
    this._animator.cancel();
  }

  /**
   * set line chart options
   * @param options options
   */
  @Input() set options(options: MultiLineChartOptions) {
    this._options = options;
    this._createChart();
  }

  /**
   * return options
   */
  get options(): MultiLineChartOptions {
    return super.options;
  }

  /**
   * return line color for index
   * @param index index number
   */
  getLineColor(index: number): string {
    return (this.options.lineColors || [])[index] || '#000';
  }

  /**
   * return line width for index
   * @param index index number
   */
  getLineWidth(index: number): number {
    return (this.options.lineWidths || [])[index] || 1;
  }

  /**
   * return point radius for index
   * @param index index number
   */
  getPointRadius(index: number): number {
    return (this.options.pointRadius || [])[index] || 5;
  }

  /**
   * return point color for index
   * @param index index number
   */
  getPointColor(index: number): string {
    return (this.options.pointColors || [])[index] || '#000';
  }

  /**
   * return point stroke width for index
   * @param index index number
   */
  getPointStrokeWidth(index: number): number {
    return (this.options.pointStrokeWidths || [])[index] || 0;
  }

  /**
   * return point stroke color for index
   * @param index index number
   */
  getPointStrokeColor(index: number): string {
    return (this.options.pointStrokeColors || [])[index] || '#fff';
  }

  /**
   * return animate state
   */
  get animate(): boolean {
    return this.options.animate || false;
  }

  /**
   * return true when chart can animate
   */
  get canAnimate(): boolean {
    return this.animate && !this._suppressAnimation;
  }

  /**
   * listen window resize event
   */
  @HostListener('window:resize')
  onWindowResize(): void {
    this._suppressAnimation = true;
    this._createChart();
  }

  /**
   * handle point mouse enter event
   * @param event event
   * @param point point
   */
  onPointMouseEnter(event: MouseEvent, point: MultiLinePoint): void {
    if (this.options.onHover) {
      this.options.onHover(event, point);
    }
  }

  /**
   * handle point mouse leave event
   * @param event event
   * @param point point
   */
  onPointMouseLeave(event: MouseEvent, point: MultiLinePoint): void {
    if (this.options.onLeave) {
      this.options.onLeave(event, point);
    }
  }

  /**
   * handle point click event
   * @param event event
   * @param point point
   */
  onPointClick(event: MouseEvent, point: MultiLinePoint): void {
    if (this.options.onClick) {
      this.options.onClick(event, point);
    }
  }

  /**
   * create chart
   */
  private _createChart(): void {
    this._animationOptions = [];

    this._createScales();
    this._createLabels();
    this._createGridLines();
    this._createLine();
    this._createPoints();

    if (this.canAnimate) {
      this._animateLineAndPoints();
    }

    this._suppressAnimation = false;
  }

  /**
   * override `_createDataScale()` method
   */
  protected _createDataScale() {
    const {data = []} = this.options;
    const scale = d3.scaleLinear()
      .domain([0, data.length - 1]);

    switch (this.direction) {
      case 'vertical': {
        // left to right
        this._dataScale = scale.range([
          this.chartLeft,
          this.chartRight,
        ]);

        break;
      }

      case 'horizontal': {
        // top to bottom
        this._dataScale = scale.range([
          this.topPadding,
          this.chartBottom,
        ]);

        break;
      }
    }
  }

  /**
   * override `_createVerticalGridForVerticalChart()` method
   */
  protected _createVerticalGridForVerticalChart(): void {
    const {data = []} = this.options;
    const scale = this._dataScale;

    const y1 = this.topPadding;
    const y2 = this.chartBottom;

    this.yGrids = data.map((item, index) => {
      const x = scale(index);

      return {
        x1: x,
        y1,
        x2: x,
        y2,
      };
    });
  }

  /**
   * override `_createHorizontalGridForHorizontalChart()` method
   */
  protected _createHorizontalGridForHorizontalChart() {
    const {data = []} = this.options;
    const scale = this._dataScale;
    const x1 = this.chartLeft;
    const x2 = this.chartRight;

    this.xGrids = data.map((item, index) => {
      const y = scale(index);

      return {
        x1,
        y1: y,
        x2,
        y2: y,
      };
    });
  }

  /**
   * create line
   */
  private _createLine(): void {
    const {data = []} = this.options;

    if (this.canAnimate) {
      // fill with `0` to start from 0
      const values = data.map(item => item.value.map(() => 0));
      this.lineDGroup = this._createLineDGroup(values);

      this._animationOptions = data.map(item => {
        return {
          start: item.value.map(() => 0),
          target: item.value,
        };
      });
    } else {
      const values = data.map(item => item.value);
      this.lineDGroup = this._createLineDGroup(values);
    }
  }

  /**
   * create d3 line with values
   * @param values values in number array
   */
  private _createLineWithValues(values: number[]): string | null {
    const line = d3.line<number>()
      .x((value, index) => {
        switch (this.direction) {
          case 'vertical': {
            return this._dataScale(index);
          }

          case 'horizontal': {
            return this._getLineValueDomain(value);
          }
        }
      })
      .y((value, index) => {
        switch (this.direction) {
          case 'vertical': {
            return this._getLineValueDomain(value);
          }

          case 'horizontal': {
            return this._dataScale(index);
          }
        }
      });

    return line(values);
  }

  /**
   * create points for line
   */
  private _createPoints(): void {
    switch (this.direction) {
      case 'vertical': {
        this._createVerticalChartPoints();
        break;
      }

      case 'horizontal': {
        this._createHorizontalChartPoints();
        break;
      }
    }
  }

  /**
   * create points for vertical chart
   */
  private _createVerticalChartPoints(): void {
    const {data = []} = this.options;

    this.pointsGroup = data.map((item, index) => {
      return item.value.map(value => {
        return {
          x: this._dataScale(index),
          y: this._getLineValueDomain(this.canAnimate ? 0 : value),
          data: item,
        };
      });
    });
  }

  /**
   * create points for horizontal chart
   */
  private _createHorizontalChartPoints(): void {
    const {data = []} = this.options;

    this.pointsGroup = data.map((item, index) => {
      return item.value.map(value => {
        return {
          x: this._getLineValueDomain(this.canAnimate ? 0 : value),
          y: this._dataScale(index),
          data: item,
        };
      });
    });
  }

  /**
   * return line value domain
   * @param value value
   */
  private _getLineValueDomain(value: number): number {
    const {min = 0, max} = this.options;
    const [minDomain, maxDomain] = this._gridScale.domain();
    const total = maxDomain - minDomain;

    return this._gridScale((value - min) / (max - min) * total);
  }

  /**
   * animate line and points
   */
  private _animateLineAndPoints(): void {
    const {animationDuration = 1000} = this.options;

    this._animator.animate({
      start: this._animationOptions.map(item => item.start),
      target: this._animationOptions.map(item => item.target),
      duration: animationDuration,
      calculator: (start, target, progress) => {
        return this._animationOptions.map(item => {
          const length = Math.max(item.start.length, item.target.length);
          const results = [];

          for (let i = 0; i < length; i++) {
            results.push(
              Animator.calculateNumericProgress(item.start[i], item.target[i], progress),
            );
          }

          return results;
        });
      },
      onProgress: values => {
        this.lineDGroup = this._createLineDGroup(values);

        values.forEach((value, index) => {
          switch (this.direction) {
            case 'vertical': {
              this.pointsGroup[index] = this.pointsGroup[index].map(((point, index2) => {
                return {
                  ...point,
                  y: this._getLineValueDomain(value[index2]),
                };
              }));

              break;
            }

            case 'horizontal': {
              this.pointsGroup[index] = this.pointsGroup[index].map(((point, index2) => {
                return {
                  ...point,
                  x: this._getLineValueDomain(value[index2]),
                };
              }));

              break;
            }
          }
        });
      },
    });
  }

  /**
   * create line d group with values
   * @param values values
   */
  private _createLineDGroup(values: number[][]): (string | null)[] {
    const length = (values[0] || []).length;
    const groups: number[][] = [];

    for (let i = 0; i < length; i++) {
      groups[i] = [];
    }

    values.forEach(items => {
      items.forEach((item, index) => {
        groups[index].push(item);
      });
    });

    return groups.map(group => {
      return this._createLineWithValues(group);
    });
  }

}
