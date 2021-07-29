import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InvestPageRoutingModule } from './invest-routing.module';

import { InvestPage } from './invest.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InvestPageRoutingModule
  ],
  declarations: [InvestPage]
})
export class InvestPageModule {}
