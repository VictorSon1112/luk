import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from './header/header.component';
import { ModalComponent } from './modal/modal.component';
import { ButtonBackComponent } from './button-back/button-back.component';
import { TranslateModule } from '@ngx-translate/core';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [HeaderComponent, ButtonBackComponent, ModalComponent],
  exports: [HeaderComponent, ButtonBackComponent, ModalComponent, TranslateModule],
  imports: [IonicModule, CommonModule, TranslateModule, RouterModule],
})
export class ComponentsModule {}
