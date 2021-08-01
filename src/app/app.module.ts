/* eslint-disable prefer-const */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ComponentsModule } from './components/components.module';
// import { InAppPurchase2 } from '@ionic-native/in-app-purchase-2/ngx';
import {
  TranslateModule,
  TranslateLoader,
  MissingTranslationHandler,
  MissingTranslationHandlerParams,
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from '../environments/environment';
// import { ChatPageModule } from './chat/chat.module';
// import { SocketIoModule } from 'ngx-socket-io';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, environment.url + 'i18n/', '.json');
}
export class MyMissingTranslationHandler implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams) {
    let str = params.key.replace(/_/g, ' ');
    return str.charAt(0).toUpperCase() + str.substring(1);
  }
}
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: MyMissingTranslationHandler,
      },
      // defaultLanguage: 'en'
    }),
    ComponentsModule,
    // ChatPageModule,
    // SocketIoModule.forRoot(environment.socket),
    DragDropModule,
  ],
  providers: [
    // AdMobFree,
    // Facebook,
    // InAppPurchase2,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
