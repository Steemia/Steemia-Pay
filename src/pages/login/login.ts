import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController } from 'ionic-angular';
import { SteemConnectProvider } from '../../providers/steemconnect/steemconnect';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController,
    private steemConnect: SteemConnectProvider,
    public menu: MenuController) {
  }

  private doLogin() {
    this.steemConnect.login().then(res => {
      if (res === 'success') {
        this.navCtrl.setRoot('TabsPage');
      }
    });
  }

  ionViewDidEnter() {
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    this.menu.enable(true);
  }

}
