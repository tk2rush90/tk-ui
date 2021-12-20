import {Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {
  ActivationEnd,
  ActivationStart, ChildActivationEnd,
  ChildActivationStart,
  GuardsCheckEnd,
  GuardsCheckStart,
  NavigationStart, ResolveEnd, ResolveStart,
  RouteConfigLoadEnd,
  RouteConfigLoadStart,
  Router,
  RoutesRecognized
} from '@angular/router';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';
import {Animator} from '@tk-ui/utils/animation.util';

@Component({
  selector: 'app-router-progress',
  templateUrl: './router-progress.component.html',
  styleUrls: ['./router-progress.component.scss'],
  providers: [
    SubscriptionService,
  ],
})
export class RouterProgressComponent implements OnInit, OnDestroy {
  /**
   * bind width
   */
  @HostBinding('style.width') get width(): string {
    return this._progress + '%';
  }

  /**
   * bind opacity
   */
  @HostBinding('style.opacity') get opacity(): number {
    return this._opacity;
  }

  /**
   * progress animator
   */
  private _progressAnimator = new Animator();

  /**
   * opacity animator
   */
  private _opacityAnimator = new Animator();

  /**
   * opacity
   */
  private _opacity = 0;

  /**
   * progress percentage
   */
  private _progress = 0;

  /**
   * timeout timer
   */
  private _timer: any;

  private _navigations = [
    NavigationStart,
    RouteConfigLoadStart,
    RouteConfigLoadEnd,
    RoutesRecognized,
    GuardsCheckStart,
    ChildActivationStart,
    ActivationStart,
    GuardsCheckEnd,
    ResolveStart,
    ResolveEnd,
    ChildActivationEnd,
    ActivationEnd,
  ];

  /**
   * progress step level
   */
  private _step = 100 / this._navigations.length;

  constructor(
    private router: Router,
    private subscriptionService: SubscriptionService,
  ) {
  }

  ngOnInit(): void {
    this._subscribeRouterEvents();
  }

  ngOnDestroy(): void {
    clearTimeout(this._timer);
    this._opacityAnimator.cancel();
    this._progressAnimator.cancel();
  }

  /**
   * subscribe router events
   */
  private _subscribeRouterEvents(): void {
    const sub = this.router.events
      .subscribe(res => {
        const index = this._navigations.findIndex(navigation => res instanceof navigation);

        if (index === 0) {
          this._opacityAnimator.cancel();
          this._opacity = 1;
          this._progress = 0;
        } else {
          const target = (index === -1) ? 100 : this._step * (index + 1);

          this._progressAnimator.animate({
            start: this._progress,
            target,
            duration: 150,
            onProgress: value => {
              console.log(value);

              this._progress = value;
            },
            onEnd: () => this._hideProgressBar(),
          });
        }
      });

    this.subscriptionService.store('_subscribeRouterEvents', sub);
  }

  /**
   * hide progress bar
   */
  private _hideProgressBar(): void {
    this._opacityAnimator.animate({
      start: this._opacity,
      target: 0,
      delay: 150,
      duration: 500,
      onProgress: value => this._opacity = value,
    });
  }
}
