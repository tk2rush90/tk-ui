import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {ModalService} from '@tk-ui/components/modal/services/modal.service';
import {NavigationStart, Router} from '@angular/router';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';
import {RandomUtil} from '@tk-ui/utils/random.util';

@Component({
  selector: 'app-modal-outlet',
  templateUrl: './modal-outlet.component.html',
  styleUrls: ['./modal-outlet.component.scss'],
  providers: [
    SubscriptionService,
  ],
})
export class ModalOutletComponent implements OnInit {
  /**
   * modal outlet ref
   */
  @ViewChild('container', {read: ViewContainerRef}) viewContainerRef: ViewContainerRef | undefined;

  /**
   * generate random id for modal outlet
   */
  id = RandomUtil.key();

  constructor(
    private router: Router,
    private modalService: ModalService,
    private subscriptionService: SubscriptionService,
  ) { }

  ngOnInit(): void {
    this._registerOutlet();
    this._subscribeRouterEvents();
  }

  /**
   * register current outlet
   */
  private _registerOutlet(): void {
    this.modalService.registerOutlet(this);
  }

  /**
   * subscribe router events to close modal automatically
   */
  private _subscribeRouterEvents(): void {
    const sub = this.router.events
      .subscribe(res => {
        if (res instanceof NavigationStart) {
          this.modalService.closeOnNavigating();
        }
      });

    this.subscriptionService.store('_subscribeRouterEvents', sub);
  }
}
