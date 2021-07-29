import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TowerPageRoutingModule } from './tower-routing.module';

import { TowerPage } from './tower.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TowerPageRoutingModule
  ],
  declarations: [TowerPage]
})
export class TowerPageModule {}
