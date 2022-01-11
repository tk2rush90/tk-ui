import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiLineChartDrawerComponent } from './multi-line-chart-drawer.component';

describe('MultiLineChartDrawerComponent', () => {
  let component: MultiLineChartDrawerComponent;
  let fixture: ComponentFixture<MultiLineChartDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiLineChartDrawerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiLineChartDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
