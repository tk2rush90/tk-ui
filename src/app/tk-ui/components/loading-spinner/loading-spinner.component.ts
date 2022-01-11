import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Animator} from '@tk-ui/utils/animation.util';
import {MathUtil} from '@tk-ui/utils/math.util';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss']
})
export class LoadingSpinnerComponent implements OnInit, AfterViewInit, OnDestroy {
  // spinner size
  @Input() size = 24;

  // stroke width
  @Input() strokeWidth = 4;

  // duration for each circle
  @Input() duration = 1000;

  // colors to animate
  @Input() colors = [
    '#0a40db',
    '#3867ec',
    '#9024e2',
    '#212121',
    '#7d7d7d',
  ];

  // color index
  index = 0;

  // dash offset
  dashOffset = 0;

  // rotate
  private _rotate = 0;

  // animators
  // spinning animator
  private _spinningAnimator = new Animator();

  // circle animator
  private _circleAnimator = new Animator();

  // color animator
  private _colorAnimator = new Animator<number[]>();

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this._startSpinningFirstStep();
    this._startCircleFirstStep();
  }

  ngOnDestroy(): void {
    this._spinningAnimator.cancel();
    this._circleAnimator.cancel();
    this._colorAnimator.cancel();
  }

  /**
   * return view box
   */
  get viewBox(): string {
    return `0 0 ${this.size} ${this.size}`;
  }

  /**
   * return circle center
   */
  get center(): number {
    return this.size / 2;
  }

  /**
   * return circle radius
   */
  get radius(): number {
    return this.center - this.strokeWidth / 2;
  }

  /**
   * return stroke color
   */
  get color(): string {
    return this.colors[this.index];
  }

  /**
   * return rotate
   */
  get rotate(): string {
    return `rotate(${this._rotate}deg)`;
  }

  /**
   * return dash array
   */
  get dashArray(): number {
    return MathUtil.getCircleRoundLength(this.radius);
  }

  /**
   * start spinning first step
   */
  private _startSpinningFirstStep(): void {
    this._spinningAnimator.animate({
      start: 0,
      target: 180,
      duration: this.duration / 3,
      timing: 'linear',
      onProgress: value => {
        this._rotate = Math.round(value);
      },
      onEnd: () => {
        this._startSpinningSecondStep();
      },
    });
  }

  /**
   * start spinning second step
   */
  private _startSpinningSecondStep(): void {
    this._spinningAnimator.animate({
      start: 180,
      target: 720,
      duration: this.duration / 1.5,
      timing: 'linear',
      onProgress: value => {
        this._rotate = Math.round(value);
      },
      onEnd: () => {
        this._startSpinningFirstStep();
      },
    });
  }

  /**
   * start circle first step
   */
  private _startCircleFirstStep(): void {
    this._circleAnimator.animate({
      start: 0,
      target: this.dashArray,
      duration: this.duration,
      timing: 'linear',
      onProgress: value => {
        this.dashOffset = Math.round(value);
      },
      onEnd: () => {
        this._toNextIndex();
        this._startCircleSecondStep();
      },
    });
  }

  /**
   * start circle second step
   */
  private _startCircleSecondStep(): void {
    this._circleAnimator.animate({
      start: this.dashArray,
      target: this.dashArray * 2,
      duration: this.duration,
      timing: 'linear',
      onProgress: value => {
        this.dashOffset = Math.round(value);
      },
      onEnd: () => {
        this._toNextIndex();
        this._startCircleFirstStep();
      },
    });
  }

  /**
   * to next index
   */
  private _toNextIndex(): void {
    this.index = this.nextIndex;
  }

  /**
   * return next index
   */
  get nextIndex(): number {
    const next = this.index + 1;

    return next > this.colors.length - 1 ? 0 : next;
  }
}

