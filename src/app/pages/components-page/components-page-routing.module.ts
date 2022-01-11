import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComponentsPageComponent } from './components-page.component';

const routes: Routes = [{ path: '', component: ComponentsPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentsPageRoutingModule { }
