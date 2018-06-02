import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { SteemConnectProvider } from '../../providers/steemconnect/steemconnect';
import { SteemiaProvider } from '../../providers/steemia/steemia';
import { Subscription } from 'rxjs/Subscription';

@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage {

  private profile;
  private isLoggedIn = false;
  private steemSub: Subscription;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private appCtrl: App,
    private steemiaProvider: SteemiaProvider,
    private steemConnect: SteemConnectProvider) {

    this.steemSub = this.steemConnect.status.subscribe(res => {

      if (res.status === false || res.status === null) {
        this.isLoggedIn = false;
      }

      else if (res.status === true) {
        this.steemiaProvider.dispatch_account(res.userObject.user).then(data => {
          this.profile = data[0];
          this.profile.json_metadata = JSON.parse(this.profile.json_metadata);
          this.isLoggedIn = true;
        });
      }
    });
  }


  ionViewDidLoad() {
  }

  /**
  * @method openPage: Method to push a page to the nav controller
  * @param {string} str: the name of the page to push
  */
  private openPage(str: string): void {
    this.appCtrl.getRootNavs()[0].push(str);
  }

  /**
   * Method to do logout and reset root page
   */
  private logout(): void {
    this.steemConnect.doLogout().then(() => {
      this.steemSub.unsubscribe();
      this.navCtrl.setRoot("LoginPage");
    });
  }

}
