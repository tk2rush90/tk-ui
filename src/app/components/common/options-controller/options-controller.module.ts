import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OptionsControllerComponent } from './options-controller.component';
import { OptionControlItemComponent } from './option-control-item/option-control-item.component';
import {SelectModule} from '@tk-ui/components/select/select.module';
import {FormsModule} from '@angular/forms';
import {CheckboxModule} from '@tk-ui/components/checkbox/checkbox.module';
import {InputModule} from '@tk-ui/components/input/input.module';
import {FlatButtonModule} from '@tk-ui/components/flat-button/flat-button.module';



@NgModule({
  declarations: [
    OptionsControllerComponent,
    OptionControlItemComponent
  ],
  exports: [
    OptionsControllerComponent
  ],
  imports: [
    CommonModule,
    SelectModule,
    FormsModule,
    CheckboxModule,
    InputModule,
    FlatButtonModule
  ]
})
export class OptionsControllerModule { }
