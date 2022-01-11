import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionControlItemComponent } from './option-control-item.component';

describe('OptionControlItemComponent', () => {
  let component: OptionControlItemComponent;
  let fixture: ComponentFixture<OptionControlItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OptionControlItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionControlItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
