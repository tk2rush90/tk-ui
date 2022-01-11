import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarChartDrawerComponent } from './bar-chart-drawer.component';

describe('BarChartDrawerComponent', () => {
  let component: BarChartDrawerComponent;
  let fixture: ComponentFixture<BarChartDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarChartDrawerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarChartDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
