import { TestBed } from '@angular/core/testing';

import { FirstDbService } from './first-db.service';

describe('FirstDbService', () => {
  let service: FirstDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirstDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
