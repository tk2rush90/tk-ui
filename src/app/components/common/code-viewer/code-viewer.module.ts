import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeViewerComponent } from './code-viewer.component';



@NgModule({
  declarations: [
    CodeViewerComponent
  ],
  exports: [
    CodeViewerComponent
  ],
  imports: [
    CommonModule
  ]
})
export class CodeViewerModule { }
