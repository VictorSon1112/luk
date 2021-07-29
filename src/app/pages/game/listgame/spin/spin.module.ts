import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SpinPageRoutingModule } from './spin-routing.module';

import { SpinPage } from './spin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SpinPageRoutingModule
  ],
  declarations: [SpinPage]
})
export class SpinPageModule {}
