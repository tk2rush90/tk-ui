import {AfterViewInit, Component, ElementRef, HostListener, Input, OnInit} from '@angular/core';
import * as d3 from 'd3';
import {MathUtil} from '@tk-ui/utils/math.util';
import {ArrayUtil} from '@tk-ui/utils/array.util';
import {Animator} from '@tk-ui/utils/animation.util';
import {ChartPaddings} from '@tk-ui/charts/models/chart-paddings';

export interface DonutChartAnimationOption {
  // start value
  start: number;
  // target value
  target: number;
}

export interface DonutChartArc {
  // `d` attribute value for arc path
  d: string;
  // start angle of arc (degree)
  start: number;
  // end angle of arc (degree)
  end: number;
  // arc center point
  center: [number, number];
  // chart data for arc
  data: DonutChartData;
}

export interface DonutChartData {
  label?: string;
  value: number;
  color: string;
}

export interface DonutChartOptions {
  // set paddings
  // default is all to `20`
  paddings?: ChartPaddings;
  // set radius width
  // default is `10`
  radiusWidth?: number;
  // set `true` to display label on arc
  showLabel?: boolean;
  // set `true` to animate chart on create
  animate?: boolean;
  // set animation duration
  // default is `1000`
  animationDuration?: number;
  // set label color
  // default is `#000`
  labelColor?: string;
  // set label size
  // default is `14`
  labelSize?: number;
  // chart data
  data: DonutChartData[];
  // events
  onHover?: (event: MouseEvent, arc: DonutChartArc) => void;
  onLeave?: (event: MouseEvent, arc: DonutChartArc) => void;
  onClick?: (event: MouseEvent, arc: DonutChartArc) => void;
}

@Component({
  selector: 'app-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.scss'],
})
export class DonutChartComponent implements OnInit, AfterViewInit {
  // arcs
  arcs: DonutChartArc[] = [];

  // options
  private _options!: DonutChartOptions;

  // animator
  private _animator = new Animator();

  // animation options
  private _animationOptions: DonutChartAnimationOption[] = [];

  // suppress animation state
  private _suppressAnimation = false;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this._createChart();
  }

  /**
   * return options
   */
  get options(): DonutChartOptions {
    return this._options || {} as any;
  }

  /**
   * return true show label state
   */
  get showLabel(): boolean {
    return this.options.showLabel || false;
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
   * return total value
   */
  get total(): number {
    const {data = []} = this.options;

    return ArrayUtil.sum(data.map(item => item.value));
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
   * return outer radius
   */
  get outerRadius(): number {
    return Math.min(this.chartWidth, this.chartHeight) / 2;
  }

  /**
   * return inner radius
   */
  get innerRadius(): number {
    return this.outerRadius - this.radiusWidth;
  }

  /**
   * return radius width
   */
  get radiusWidth(): number {
    return this.options.radiusWidth || 10;
  }

  /**
   * return chart width
   */
  get chartWidth(): number {
    return this.width - this.horizontalPaddings;
  }

  /**
   * return chart height
   */
  get chartHeight(): number {
    return this.height - this.verticalPaddings;
  }

  /**
   * return paddings
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
   * return center x of circle
   */
  get cx(): number {
    return this.chartWidth / 2 + this.leftPadding;
  }

  /**
   * return center y of circle
   */
  get cy(): number {
    return this.chartHeight / 2 + this.topPadding;
  }

  /**
   * return transform value
   */
  get transform(): string {
    return `translate(${this.cx},${this.cy})`;
  }

  /**
   * handle path mouse enter event
   * @param event mouse event
   * @param item arc item
   */
  onPathMouseEnter(event: MouseEvent, item: DonutChartArc): void {
    if (this.options.onHover) {
      this.options.onHover(event, item);
    }
  }

  /**
   * handle path mouse leave event
   * @param event mouse event
   * @param item arc item
   */
  onPathMouseLeave(event: MouseEvent, item: DonutChartArc): void {
    if (this.options.onLeave) {
      this.options.onLeave(event, item);
    }
  }

  /**
   * handle path click
   * @param event mouse event
   * @param item arc item
   */
  onPathClick(event: MouseEvent, item: DonutChartArc): void {
    if (this.options.onClick) {
      this.options.onClick(event, item);
    }
  }

  /**
   * set options for chart
   * @param options options
   */
  @Input() set options(options: DonutChartOptions) {
    this._options = options;
    this._createChart();
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
   * create chart
   */
  private _createChart(): void {
    this._animationOptions = [];

    this._createArcs();

    if (this.canAnimate) {
      this._animateArcs();
    }

    this._suppressAnimation = false;
  }

  /**
   * create arcs
   */
  private _createArcs(): void {
    const {data = []} = this.options;
    const outerRadius = this.outerRadius;
    const innerRadius = this.innerRadius;
    const cx = this.cx;
    const cy = this.cy;
    const middleRadius = outerRadius - (outerRadius - innerRadius) / 2;
    const total = this.total;

    let prev = 0;
    this._animationOptions = [];

    this.arcs = data.map(item => {
      const value = item.value / total * 360;
      const center = prev + (value / 2) - 90; // -90 is for
      let arc: d3.Arc<any, any>;

      if (this.canAnimate) {
        arc = this._createArc(prev, prev);

        this._animationOptions.push({
          start: prev,
          target: prev + value,
        });
      } else {
        arc = this._createArc(prev, prev + value);
      }

      prev += value;

      return {
        d: getArcD(arc),
        start: prev,
        end: value,
        data: item,
        center: MathUtil.getArcPointCoordinates(cx, cy, middleRadius, center),
      };
    });
  }

  /**
   * animate arcs
   * @param index arc index
   */
  private _animateArcs(index = 0): void {
    const {animationDuration = 1000} = this.options;
    const option = this._animationOptions[index];
    const targetArc = this.arcs[index];

    const {start, target} = option;

    this._animator.animate({
      start,
      target,
      duration: animationDuration * (targetArc.data.value / this.total),
      onProgress: value => {
        targetArc.d = getArcD(this._createArc(start, value));
      },
      onEnd: () => {
        if (index < this.arcs.length - 1) {
          this._animateArcs(index + 1);
        }
      },
    });
  }

  /**
   * create arc object
   * @param start start angle in degree
   * @param end end angle in degree
   */
  private _createArc(start: number, end: number): d3.Arc<any, any> {
    return d3.arc<any>()
      .innerRadius(this.innerRadius)
      .outerRadius(this.outerRadius)
      .startAngle(MathUtil.degreeToRadian(start))
      .endAngle(MathUtil.degreeToRadian(end));
  }
}

/**
 * return arc d for path
 * @param arc arc
 */
function getArcD(arc: d3.Arc<any, any>): string {
  const path = d3.create('path');
  const d = path.attr('d', arc).attr('d');

  path.remove();

  return d;
}
