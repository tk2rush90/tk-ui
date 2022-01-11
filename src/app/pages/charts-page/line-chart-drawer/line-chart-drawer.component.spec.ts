import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineChartDrawerComponent } from './line-chart-drawer.component';

describe('LineChartDrawerComponent', () => {
  let component: LineChartDrawerComponent;
  let fixture: ComponentFixture<LineChartDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineChartDrawerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineChartDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
