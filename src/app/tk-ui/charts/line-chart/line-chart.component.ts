import {AfterViewInit, Component, ElementRef, HostListener, Input, OnDestroy, OnInit} from '@angular/core';
import {GridChartBase, GridChartData, GridChartOptions} from '@tk-ui/charts/grid-chart-base/grid-chart-base';
import {Animator} from '@tk-ui/utils/animation.util';
import * as d3 from 'd3';

export interface LinePoint {
  x: number;
  y: number;
  data: GridChartData;
}

export interface LineChartAnimationOptions {
  start: number;
  target: number;
}

export interface LineChartOptions extends GridChartOptions {
  // animate state
  // default is `false`
  animate?: boolean;
  // line color
  // default is `#000`
  lineColor?: string;
  // line width
  // default is `1`
  lineWidth?: number;
  // point radius
  // default is `5`
  pointRadius?: number;
  // point color
  // default is `#000`
  pointColor?: string;
  // point stroke width
  // default is `0`
  pointStrokeWidth?: number;
  // point stroke color
  // default is `#fff`
  pointStrokeColor?: string;
  // set animation duration
  // default is `1000`
  animationDuration?: number;
  // events
  onHover?: (event: MouseEvent, point: LinePoint) => void;
  onLeave?: (event: MouseEvent, point: LinePoint) => void;
  onClick?: (event: MouseEvent, point: LinePoint) => void;
}

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent extends GridChartBase implements OnInit, AfterViewInit, OnDestroy {
  // line d
  lineD: string | null = null;

  // line points
  points: LinePoint[] = [];

  // set `true` to not to run animation
  private _suppressAnimation = false;

  // animator
  private _animator = new Animator<number[]>();

  // line chart animation options
  private _animationOptions: LineChartAnimationOptions[] = [];

  constructor(
    protected elementRef: ElementRef<HTMLElement>,
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
  @Input() set options(options: LineChartOptions) {
    this._options = options;
    this._createChart();
  }

  /**
   * return options
   */
  get options(): LineChartOptions {
    return super.options;
  }

  /**
   * return line color
   */
  get lineColor(): string {
    return this.options.lineColor || '#000';
  }

  /**
   * return line width
   */
  get lineWidth(): number {
    return this.options.lineWidth || 1;
  }

  /**
   * return point radius
   */
  get pointRadius(): number {
    return this.options.pointRadius || 5;
  }

  /**
   * return point color
   */
  get pointColor(): string {
    return this.options.pointColor || '#000';
  }

  /**
   * return point stroke width
   */
  get pointStrokeWidth(): number {
    return this.options.pointStrokeWidth || 0;
  }

  /**
   * return point stroke color
   */
  get pointStrokeColor(): string {
    return this.options.pointStrokeColor || '#fff';
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
  onPointMouseEnter(event: MouseEvent, point: LinePoint): void {
    if (this.options.onHover) {
      this.options.onHover(event, point);
    }
  }

  /**
   * handle point mouse leave event
   * @param event event
   * @param point point
   */
  onPointMouseLeave(event: MouseEvent, point: LinePoint): void {
    if (this.options.onLeave) {
      this.options.onLeave(event, point);
    }
  }

  /**
   * handle point click event
   * @param event event
   * @param point point
   */
  onPointClick(event: MouseEvent, point: LinePoint): void {
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
      const values = data.map(() => 0);
      this.lineD = this._createLineWithValues(values);

      this._animationOptions = data.map(item => {
        return {
          start: 0,
          target: item.value,
        };
      });
    } else {
      const values = data.map(item => item.value);
      this.lineD = this._createLineWithValues(values);
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

    this.points = data.map((item, index) => {
      const x = this._dataScale(index);
      const y = this._getLineValueDomain(this.canAnimate ? 0 : item.value);

      return {
        x,
        y,
        data: item,
      };
    });
  }

  /**
   * create points for horizontal chart
   */
  private _createHorizontalChartPoints(): void {
    const {data = []} = this.options;

    this.points = data.map((item, index) => {
      const x = this._getLineValueDomain(this.canAnimate ? 0 : item.value);
      const y = this._dataScale(index);

      return {
        x,
        y,
        data: item,
      };
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
          return Animator.calculateNumericProgress(item.start, item.target, progress);
        });
      },
      onProgress: values => {
        this.lineD = this._createLineWithValues(values);

        values.forEach((value, index) => {
          switch (this.direction) {
            case 'vertical': {
              this.points[index].y = this._getLineValueDomain(value);
              break;
            }

            case 'horizontal': {
              this.points[index].x = this._getLineValueDomain(value);
              break;
            }
          }
        });
      },
    });
  }
}

