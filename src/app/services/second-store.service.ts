import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SecondStoreService {
  static storeName = 'SecondStore';

  constructor() { }
}
