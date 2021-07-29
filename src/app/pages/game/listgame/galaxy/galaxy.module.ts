import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GalaxyPageRoutingModule } from './galaxy-routing.module';

import { GalaxyPage } from './galaxy.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GalaxyPageRoutingModule
  ],
  declarations: [GalaxyPage]
})
export class GalaxyPageModule {}
