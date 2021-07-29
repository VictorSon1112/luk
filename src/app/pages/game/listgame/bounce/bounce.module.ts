import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BouncePageRoutingModule } from './bounce-routing.module';

import { BouncePage } from './bounce.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BouncePageRoutingModule
  ],
  declarations: [BouncePage]
})
export class BouncePageModule {}
