import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  ActivationEnd,
  ActivationStart, ChildActivationEnd,
  ChildActivationStart,
  GuardsCheckEnd,
  GuardsCheckStart, NavigationCancel, NavigationEnd, NavigationError,
  NavigationStart, ResolveEnd, ResolveStart,
  RouteConfigLoadEnd,
  RouteConfigLoadStart,
  Router,
  RoutesRecognized
} from '@angular/router';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-router-progress',
  templateUrl: './router-progress.component.html',
  styleUrls: ['./router-progress.component.scss'],
  providers: [
    SubscriptionService,
  ],
  animations: [
    trigger('visible', [
      state('void', style({
        opacity: 0,
      })),
      state('visible', style({
        opacity: 1,
      })),
      transition('void => visible', animate(0)),
      transition('visible => void', animate('.5s')),
    ])
  ]
})
export class RouterProgressComponent implements OnInit, OnDestroy {
  /**
   * progress bar visible state
   */
  visible = false;

  /**
   * progress percentage
   */
  progress = 0;

  /**
   * progress step level
   */
  private _step = 100 / 13;

  /**
   * timeout timer
   */
  private _timer: any;

  constructor(
    private router: Router,
    private subscriptionService: SubscriptionService,
  ) { }

  ngOnInit(): void {
    this._subscribeRouterEvents();
  }

  ngOnDestroy(): void {
    clearTimeout(this._timer);
  }

  /**
   * subscribe router events
   */
  private _subscribeRouterEvents(): void {
    const sub = this.router.events
      .subscribe(res => {
        if (res instanceof NavigationStart) {
          this.visible = true;
          this.progress = this._step;
        }

        if (res instanceof RouteConfigLoadStart) {
          this.progress = this._step * 2;
        }

        if (res instanceof RouteConfigLoadEnd) {
          this.progress = this._step * 3;
        }

        if (res instanceof RoutesRecognized) {
          this.progress = this._step * 4;
        }

        if (res instanceof GuardsCheckStart) {
          this.progress = this._step * 5;
        }

        if (res instanceof ChildActivationStart) {
          this.progress = this._step * 6;
        }

        if (res instanceof ActivationStart) {
          this.progress = this._step * 7;
        }

        if (res instanceof GuardsCheckEnd) {
          this.progress = this._step * 8;
        }

        if (res instanceof ResolveStart) {
          this.progress = this._step * 9;
        }

        if (res instanceof ResolveEnd) {
          this.progress = this._step * 10;
        }

        if (res instanceof ChildActivationEnd) {
          this.progress = this._step * 11;
        }

        if (res instanceof ActivationEnd) {
          this.progress = this._step * 12;
        }

        if (
          res instanceof NavigationEnd
          || res instanceof NavigationCancel
          || res instanceof NavigationError
        ) {
          clearTimeout(this._timer);
          this.progress = this._step * 13;
          this._timer = setTimeout(() => {
            this.visible = false;
          });
        }
      });

    this.subscriptionService.store('_subscribeRouterEvents', sub);
  }
}
