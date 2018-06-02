import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { SteemiaProvider } from '../providers/steemia/steemia';
import { SteemConnectProvider } from '../providers/steemconnect/steemconnect';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage: string;

  constructor(private platform: Platform,
    statusBar: StatusBar,
    private storage: Storage,
    splashScreen: SplashScreen,
    private steemConnect: SteemConnectProvider,
    private steemiaProvider: SteemiaProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.storage.get('access_token').then(
        data => {
          console.log(data)
          if (data === null || data === undefined) {
            this.rootPage = 'LoginPage';
          }

          else {
            this.rootPage = 'TabsPage'
          }
        },
        error => console.log(null)
      );
    });
  }
}
