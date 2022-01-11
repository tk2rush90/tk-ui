import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChartsPageComponent } from './charts-page.component';

const routes: Routes = [{ path: '', component: ChartsPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChartsPageRoutingModule { }
