import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingSpotComponent } from './loading-spot.component';

describe('LoadingSpotComponent', () => {
  let component: LoadingSpotComponent;
  let fixture: ComponentFixture<LoadingSpotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadingSpotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingSpotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
