import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalOutletComponent } from './components/modal-outlet/modal-outlet.component';
import { ModalGroupComponent } from './components/modal-group/modal-group.component';
import { ModalBackdropComponent } from './components/modal-backdrop/modal-backdrop.component';
import { ModalWrapperComponent } from './components/modal-wrapper/modal-wrapper.component';
import { ModalContainerComponent } from './components/modal-container/modal-container.component';
import { ModalHeaderComponent } from './components/modal-header/modal-header.component';
import { ModalContentComponent } from './components/modal-content/modal-content.component';
import { ModalActionsComponent } from './components/modal-actions/modal-actions.component';



@NgModule({
  declarations: [
    ModalOutletComponent,
    ModalGroupComponent,
    ModalBackdropComponent,
    ModalWrapperComponent,
    ModalContainerComponent,
    ModalHeaderComponent,
    ModalContentComponent,
    ModalActionsComponent,
  ],
  exports: [
    ModalOutletComponent,
    ModalContainerComponent,
    ModalHeaderComponent,
    ModalContentComponent,
    ModalActionsComponent
  ],
  imports: [
    CommonModule
  ],
  entryComponents: [
    ModalGroupComponent,
    ModalWrapperComponent,
    ModalBackdropComponent,
  ]
})
export class ModalModule { }
