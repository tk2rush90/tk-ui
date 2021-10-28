import {Component, Input, OnInit} from '@angular/core';

export type LoadingSpotColor = 'default';

@Component({
  selector: 'app-loading-spot',
  templateUrl: './loading-spot.component.html',
  styleUrls: ['./loading-spot.component.scss']
})
export class LoadingSpotComponent implements OnInit {
  /**
   * set loading ball size
   */
  @Input() size = 30;

  /**
   * set loading ball color
   */
  @Input() color: LoadingSpotColor = 'default';

  constructor() { }

  ngOnInit(): void {
  }

}
