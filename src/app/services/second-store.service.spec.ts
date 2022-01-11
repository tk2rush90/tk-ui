import { TestBed } from '@angular/core/testing';

import { SecondStoreService } from './second-store.service';

describe('SecondStoreService', () => {
  let service: SecondStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SecondStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
