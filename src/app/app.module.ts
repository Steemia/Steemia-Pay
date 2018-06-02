import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SteemConnectProvider } from '../providers/steemconnect/steemconnect';
import { SteemiaProvider } from '../providers/steemia/steemia';
import { UtilProvider } from '../providers/util/util';

import { IonicStorageModule } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { HttpModule } from '@angular/http'
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from "@angular/common/http";
import { MomentModule } from 'ngx-moment';
import { GoogleMaps } from "@ionic-native/google-maps";
import { BrowserTab } from '@ionic-native/browser-tab';
import { Geolocation } from '@ionic-native/geolocation';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    HttpModule,
    MomentModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({ name: '__mydb', driverOrder: ['sqlite', 'websql', 'indexeddb'] })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    InAppBrowser,
    GoogleMaps,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SteemConnectProvider,
    SteemiaProvider,
    BarcodeScanner,
    BrowserTab,
    UtilProvider
  ]
})
export class AppModule {}
