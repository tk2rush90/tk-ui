import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonutChartDrawerComponent } from './donut-chart-drawer.component';

describe('DonutChartDrawerComponent', () => {
  let component: DonutChartDrawerComponent;
  let fixture: ComponentFixture<DonutChartDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonutChartDrawerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonutChartDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
