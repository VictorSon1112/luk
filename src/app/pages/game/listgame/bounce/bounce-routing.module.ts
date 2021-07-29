import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BouncePage } from './bounce.page';

const routes: Routes = [
  {
    path: '',
    component: BouncePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BouncePageRoutingModule {}
