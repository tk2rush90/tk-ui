import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'components',
  },
  {
    path: 'components',
    loadChildren: () => import('./pages/components-page/components-page.module').then(m => m.ComponentsPageModule)
  },
  {
    path: 'charts',
    loadChildren: () => import('./pages/charts-page/charts-page.module').then(m => m.ChartsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
