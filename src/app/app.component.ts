import {Component, OnInit} from '@angular/core';
import {IndexedDbUtil} from '@tk-ui/utils/indexed-db.util';
import {DbConfig} from './db/config';
import {FirstDbService} from './services/first-db.service';
import {FirstStoreService} from './services/first-store.service';
import {RandomUtil} from '@tk-ui/utils/random.util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'tk-ui';

  links = [
    {
      name: 'Components',
      routerLink: ['/components'],
    },
    {
      name: 'Charts',
      routerLink: ['/charts'],
    },
  ];

  ready = false;

  constructor(
    private firstDbService: FirstDbService,
    private firstStoreService: FirstStoreService,
  ) {
  }

  ngOnInit(): void {
    this._initDb()
      .catch(e => console.error(e));
  }

  private async _initDb(): Promise<void> {
    // Initialize db.
    await IndexedDbUtil.initDb(DbConfig).toPromise();

    // Connect to db.
    await this.firstDbService.connect().toPromise();

    // Set ready state to `true`.
    this.ready = true;

    await this.firstStoreService.addData({
      id: RandomUtil.key(),
      name: 'holy-molly',
    });
  }
}
