import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { SteemConnectProvider } from '../../providers/steemconnect/steemconnect';
import { SteemiaProvider } from '../../providers/steemia/steemia';


@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage {

  private profile;
  private isLoggedIn = false;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private appCtrl: App,
    private steemiaProvider: SteemiaProvider,
    private steemConnect: SteemConnectProvider) {
      this.steemConnect.status.subscribe(res => {
        if (res.status === false || res.status === null) {
          this.isLoggedIn = false;
        }
    
        else if (res.status === true) {
          this.steemiaProvider.dispatch_account(res.userObject.user).then(data => {
            this.profile = data[0];
            this.profile.json_metadata = JSON.parse(this.profile.json_metadata);
            console.log(this.profile)
            this.isLoggedIn = true;   
          });
        }
      });
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad UserPage');
  }

   /**
   * @method openPage: Method to push a page to the nav controller
   * @param {string} str: the name of the page to push
   */
  private openPage(str: string, restricted: boolean): void {

    if (restricted === true) {
      if ((this.steemConnect.user_temp as any).user) {
        this.appCtrl.getRootNavs()[0].push(str);
      }

      else {
        this.appCtrl.getRootNavs()[0].push('LoginPage');
      }
    }
    else {
      this.appCtrl.getRootNavs()[0].push(str);
    }
  }

}
