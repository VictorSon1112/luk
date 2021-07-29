import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SpinPage } from './spin.page';

const routes: Routes = [
  {
    path: '',
    component: SpinPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpinPageRoutingModule {}
