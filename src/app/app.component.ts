import {AfterViewInit, Component} from '@angular/core';
import {Animator} from '@tk-ui/utils/animation.util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'tk-ui';

  get transform(): string {
    return `translate(${this._x}px, ${this._y}px) rotate(${this._r}deg) scale(${this._s})`;
  }

  get color(): string {
    return '#' + Math.floor(this._color).toString(16);
  }

  private _x = 0;
  private _y = 0;
  private _r = 0;
  private _s = 0;
  private _color = 0x000000;

  ngAfterViewInit(): void {
    const animator = new Animator<{
      color: number,
      x: number,
      y: number,
      s: number,
    }>();

    animator.animate({
      start: {
        color: 0x000000,
        x: 0,
        y: 0,
        s: 1,
      },
      target: {
        color: 0xffffff,
        x: 300,
        y: -100,
        s: 2,
      },
      duration: 2000,
      repeat: true,
      alternate: true,
      timing: 'easeInOutElastic',
      calculator: (start, target, progress, passedTime) => {
        if (passedTime >= animator.duration) {
          return animator.target;
        } else {
          return {
            color: Animator.calculateNumericProgress(start.color, target.color, progress),
            x: Animator.calculateNumericProgress(start.x, target.x, progress),
            y: Animator.calculateNumericProgress(start.y, target.y, progress),
            s: Animator.calculateNumericProgress(start.s, target.s, progress),
          };
        }
      },
      onProgress: value => {
        this._color = value.color;
        this._x = value.x;
        this._y = value.y;
        this._s = value.s;
      },
    });

    this._rotate1();
  }

  private _rotate1(): void {
    const animator = new Animator();

    animator.animate({
      start: 0,
      target: 720,
      duration: 1000,
      repeat: true,
      onProgress: value => this._r = value,
    })
  }
}
