import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsControllerComponent } from './options-controller.component';

describe('OptionsControllerComponent', () => {
  let component: OptionsControllerComponent;
  let fixture: ComponentFixture<OptionsControllerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OptionsControllerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
