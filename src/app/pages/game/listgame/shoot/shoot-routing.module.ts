import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShootPage } from './shoot.page';

const routes: Routes = [
  {
    path: '',
    component: ShootPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShootPageRoutingModule {}
