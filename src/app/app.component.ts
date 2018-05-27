import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';

import { SteemiaProvider } from '../providers/steemia/steemia';
import { SteemConnectProvider } from '../providers/steemconnect/steemconnect';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;
  public isLoggedIn;
  public profile;

  constructor(private platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen,
    private steemConnect: SteemConnectProvider,
    private steemiaProvider: SteemiaProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    this.steemConnect.status.subscribe(res => {
      if (res.status === true || res.status === null) {
        this.isLoggedIn = false;
      }

      else if (res.status === false) {
        this.steemiaProvider.dispatch_account('hsynterkr').then(data => {
          this.profile = data[0];
          this.profile.json_metadata = JSON.parse(this.profile.json_metadata);

          this.isLoggedIn = true;   
        });
      }
    });
  }
}
