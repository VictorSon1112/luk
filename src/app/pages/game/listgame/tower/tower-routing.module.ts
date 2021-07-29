import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TowerPage } from './tower.page';

const routes: Routes = [
  {
    path: '',
    component: TowerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TowerPageRoutingModule {}
