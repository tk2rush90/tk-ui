import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectBaseComponent } from './select-base.component';

describe('SelectBaseComponent', () => {
  let component: SelectBaseComponent;
  let fixture: ComponentFixture<SelectBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectBaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
