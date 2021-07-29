import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvestPage } from './invest.page';

const routes: Routes = [
  {
    path: '',
    component: InvestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvestPageRoutingModule {}
