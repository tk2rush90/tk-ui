import { TestBed } from '@angular/core/testing';

import { FirstStoreService } from './first-store.service';

describe('FirstStoreService', () => {
  let service: FirstStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirstStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
