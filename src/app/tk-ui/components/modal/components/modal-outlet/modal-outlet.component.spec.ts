import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalOutletComponent } from './modal-outlet.component';

describe('ModalOutletComponent', () => {
  let component: ModalOutletComponent;
  let fixture: ComponentFixture<ModalOutletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalOutletComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalOutletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
