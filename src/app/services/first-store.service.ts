import { Injectable } from '@angular/core';
import {FirstDbService} from './first-db.service';
import {IndexedDbUtil} from '@tk-ui/utils/indexed-db.util';

@Injectable({
  providedIn: 'root'
})
export class FirstStoreService {
  static storeName = 'FirstStore';

  constructor(
    private firstDbService: FirstDbService,
  ) { }

  async addData(data: any | any[]): Promise<void> {
    IndexedDbUtil.add(this.firstDbService.db, FirstStoreService.storeName, data);
  }
}
