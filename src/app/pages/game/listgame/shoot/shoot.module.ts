import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShootPageRoutingModule } from './shoot-routing.module';

import { ShootPage } from './shoot.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShootPageRoutingModule
  ],
  declarations: [ShootPage]
})
export class ShootPageModule {}
