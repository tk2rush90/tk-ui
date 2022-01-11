import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsPageRoutingModule } from './components-page-routing.module';
import { ComponentsPageComponent } from './components-page.component';


@NgModule({
  declarations: [
    ComponentsPageComponent
  ],
  imports: [
    CommonModule,
    ComponentsPageRoutingModule
  ]
})
export class ComponentsPageModule { }
