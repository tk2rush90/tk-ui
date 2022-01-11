import {AfterViewInit, Component, ElementRef, HostListener, Input, OnDestroy, OnInit} from '@angular/core';
import {GridChartBase, GridChartData, GridChartOptions} from '@tk-ui/charts/grid-chart-base/grid-chart-base';
import {Animator} from '@tk-ui/utils/animation.util';

export interface BarChartBar {
  x: number;
  y: number;
  width: number;
  height: number;
  data: BarChartData;
}

export interface BarChartAnimationOptions {
  start: number;
  target: number;
}

export interface BarChartData extends GridChartData {
  // bar color
  color: string;
}

export interface BarChartOptions extends GridChartOptions {
  // animate state
  // default is `false`
  animate?: boolean;
  // animation duration
  // default is `1000`
  animationDuration?: number;
  // override data
  data: BarChartData[];
  // events
  onHover?: (event: MouseEvent, bar: BarChartBar) => void;
  onLeave?: (event: MouseEvent, bar: BarChartBar) => void;
  onClick?: (event: MouseEvent, bar: BarChartBar) => void;
}

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent extends GridChartBase implements OnInit, AfterViewInit, OnDestroy {
  // bars
  bars: BarChartBar[] = [];

  // bar side paddings
  private _barSidePaddings = .1;

  // set `true` to not to run animation
  private _suppressAnimation = false;

  // animation options
  private _animationOptions: BarChartAnimationOptions[] = [];

  // animator
  private _animator = new Animator<number[]>();

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
   * set bar chart options
   * @param options options
   */
  @Input() set options(options: BarChartOptions) {
    this._options = options;
    this._createChart();
  }

  /**
   * return options
   */
  get options(): BarChartOptions {
    return super.options as BarChartOptions;
  }

  /**
   * return animate state
   */
  get animate(): boolean {
    return this.options.animate || false;
  }

  /**
   * return true when component can animate
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
   * handle bar mouse enter event
   * @param event event
   * @param bar bar
   */
  onBarMouseEnter(event: MouseEvent, bar: BarChartBar): void {
    if (this.options.onHover) {
      this.options.onHover(event, bar);
    }
  }

  /**
   * handle bar mouse leave event
   * @param event event
   * @param bar bar
   */
  onBarMouseLeave(event: MouseEvent, bar: BarChartBar): void {
    if (this.options.onLeave) {
      this.options.onLeave(event, bar);
    }
  }

  /**
   * handle bar click event
   * @param event event
   * @param bar bar
   */
  onBarClick(event: MouseEvent, bar: BarChartBar): void {
    if (this.options.onClick) {
      this.options.onClick(event, bar);
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
    this._createBars();

    if (this.canAnimate) {
      this._animateBars();
    }

    this._suppressAnimation = false;
  }

  /**
   * create bars
   */
  private _createBars(): void {
    switch (this.direction) {
      case 'vertical': {
        this._createVerticalChartBars();
        break;
      }

      case 'horizontal': {
        this._createHorizontalChartBars();
        break;
      }
    }
  }

  /**
   * create vertical chart bars
   */
  private _createVerticalChartBars(): void {
    const {data = [], max, min = 0} = this.options;
    const scale = this._dataScale;
    const width = this.chartWidth / data.length;
    const paddings = width * this._barSidePaddings * 2;
    const chartBottom = this.chartBottom;
    const chartHeight = this.chartHeight;

    this.bars = data.map((item, index) => {
      const height = (item.value - min) / (max - min) * chartHeight;
      const x = scale(index) - width / 2 + paddings / 2;
      const y = chartBottom - height;

      if (this.canAnimate) {
        this._animationOptions.push({
          start: 0,
          target: height,
        });

        return {
          x,
          y,
          width: width - paddings,
          height: 0,
          data: item,
        };
      } else {
        return {
          x,
          y,
          width: width - paddings,
          height,
          data: item,
        };
      }
    });
  }

  /**
   * create horizontal chart bars
   */
  private _createHorizontalChartBars(): void {
    const {data = [], max, min = 0} = this.options;
    const scale = this._dataScale;
    const height = this.chartHeight / data.length;
    const paddings = height * this._barSidePaddings * 2;
    const chartLeft = this.chartLeft;
    const chartWidth = this.chartWidth;

    this.bars = data.map((item, index) => {
      const width = (item.value - min) / (max - min) * chartWidth;
      const x = chartLeft;
      const y = scale(index) - height / 2 + paddings / 2;

      if (this.canAnimate) {
        this._animationOptions.push({
          start: 0,
          target: width,
        });

        return {
          x,
          y,
          width: 0,
          height: height - paddings,
          data: item,
        };
      } else {
        return {
          x,
          y,
          width,
          height: height - paddings,
          data: item,
        };
      }
    });
  }

  /**
   * animate bars
   */
  private _animateBars(): void {
    const {animationDuration = 1000} = this.options;

    this._animator.animate({
      start: this._animationOptions.map(item => item.start),
      target: this._animationOptions.map(item => item.target),
      duration: animationDuration,
      calculator: ((start, target, progress) => {
        return this._animationOptions.map(item => {
          return Animator.calculateNumericProgress(item.start, item.target, progress);
        });
      }),
      onProgress: values => {
        const chartBottom = this.chartBottom;

        this.bars = this.bars.map((item, index) => {
          switch (this.direction) {
            case 'vertical': {
              item.height = values[index];
              item.y = chartBottom - values[index];
              break;
            }

            case 'horizontal': {
              item.width = values[index];
              break;
            }
          }

          return item;
        });
      },
    });
  }
}
