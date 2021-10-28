import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastOutletComponent } from './components/toast-outlet/toast-outlet.component';
import { ToastMessageComponent } from './components/toast-message/toast-message.component';



@NgModule({
  declarations: [ToastOutletComponent, ToastMessageComponent],
  exports: [
    ToastOutletComponent
  ],
  imports: [
    CommonModule
  ],
  entryComponents: [
    ToastMessageComponent,
  ]
})
export class ToastModule { }
