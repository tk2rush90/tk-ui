import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastOutletComponent } from './toast-outlet.component';

describe('ToastOutletComponent', () => {
  let component: ToastOutletComponent;
  let fixture: ComponentFixture<ToastOutletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToastOutletComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToastOutletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
