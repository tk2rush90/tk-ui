import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterProgressComponent } from './router-progress.component';

describe('RouterProgressComponent', () => {
  let component: RouterProgressComponent;
  let fixture: ComponentFixture<RouterProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RouterProgressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RouterProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
