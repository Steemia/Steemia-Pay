import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, App } from 'ionic-angular';
import { SteemiaProvider } from '../../providers/steemia/steemia';
import { SteemConnectProvider } from '../../providers/steemconnect/steemconnect';
import { BrowserTab } from '@ionic-native/browser-tab';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Subscription } from 'rxjs/Subscription';

@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  
  qr_data = null;
  created_code = null;
  scanned_code = null;

  public transactions: Array<any> = [];
  public staging: Array<any> = [];
  public lastItem;
  public is_loading = false;
  private user;
  private profile;
  private query = { account: this.user, from: '-1', limit: '99' };
  private logged_in: boolean = false;
  private userObj: any = this.steemConnect.user_temp;
  memoToggle = [];
  private steemSub: Subscription;

  constructor(public navCtrl: NavController,
    private steemiaProvider: SteemiaProvider,
    private steemConnect: SteemConnectProvider,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    private barcodeScanner: BarcodeScanner,
    private browserTab: BrowserTab,
    private appCtrl: App,
    public navParams: NavParams) {
  }

  ionViewDidLoad(): void {
    this.steemSub = this.steemConnect.status.subscribe(res => {
      if (res.status === true) {
        this.steemiaProvider.dispatch_account(res.userObject.user).then(data => {
          this.profile = data[0];
          this.profile.json_metadata = JSON.parse(this.profile.json_metadata);
          this.user = (this.steemConnect.user_temp as any).user
          this.query.account = this.user;
          this.logged_in = true;
          this.getWalletHistory(this.query);
          this.steemSub.unsubscribe(); // Stop subscription for the observable to avoid memory leak
        });
      }
    });

  }

  /**
   * Method to show memo info if transaction in tapped.
   * @param selected_transaction
   * @author Jayser Mendez
   */
  showMemo(selected_transaction): void {
    this.transactions.map(transaction => {

      // If we found the transaction target, change its expanded attribute to true if it is true, otherwise, false;
      if (selected_transaction == transaction) {
        transaction.expanded = !transaction.expanded; 
      } 
      
      // The rest of the transactions should have the false property
      else {
        transaction.expanded = false;
      }

      return transaction;

    });
    
  }

  public getWalletHistory(query) {
    this.is_loading = true;
    this.steemiaProvider.dispatch_wallet_history(query).then(data => {

      let tranfers = data;

      // Assign id and timestamp to transactions.
      for (let i of data) {
        let transaction = i[1].op;
        transaction.timestamp = i[1].timestamp;
        transaction.id = i[0];
        transaction.expanded = false;

        // Pick transfer data.
        if (transaction[0] === 'transfer') {
          this.transactions.push(transaction)
        }
      }

      // Assign last item to get more history
      this.lastItem = data[0][0] - 1;

      // if first request doesn't contain a transfer data, make a new request
      if (this.transactions.length < 1) {
        this.getMoreWalletHistory({ account: this.user, from: this.lastItem, limit: '99' })
      }

      // If the first request only got 1 transaction, repeat it
      if (this.transactions.length == 1) {
        this.getMore();
      }

      // Reverse array to sort data by date  
      this.transactions.reverse();

      this.is_loading = false;
    })
  }

  public getMoreWalletHistory(query) {
    this.is_loading = true;

    this.steemiaProvider.dispatch_wallet_history(query).then(data => {

      let tranfers = data;

      // Assign id and timestamp to transactions.
      for (let i of data) {
        let transaction = i[1].op;
        transaction.timestamp = i[1].timestamp;
        transaction.id = i[0];
        transaction.expanded = false;

        // Pick transfer data and push them to the temporary array.
        if (transaction[0] === 'transfer') {
          this.staging.push(transaction)
        }
      }

      // Reverse array to sort data by date 
      this.staging.reverse();

      // Push sorted data to main transaction array
      for (let i of this.staging) {
        this.transactions.push(i)
      }

      // Assign last item for a new request
      this.lastItem = data[0][0] - 1;

      // if first request doesn't contain a transfer data, make a new request
      if (this.staging.length < 1) {
        this.getMoreWalletHistory({ account: this.user, from: this.lastItem, limit: '99' })
      }

      // Reset temporary variable.
      this.staging = [];
      this.is_loading = false;
    })
  }

  public getMore() {
    this.getMoreWalletHistory({ account: this.user, from: this.lastItem, limit: '99' });
  }

  /**
   * Method to open barcode page
   */
  presentBarcodeModal() {
    let barcodeModal = this.modalCtrl.create("BarcodePage");
    barcodeModal.present();
  }

  /**
   * Method to assign created_code
   */
  createCode() {
    this.created_code = this.qr_data;
  }

  /**
   * Method to scan code and parse it
   */
  scanCode() {
    this.barcodeScanner.scan().then(barcodeData => {
      this.scanned_code = barcodeData.text;
      this.scanned_code = JSON.parse(this.scanned_code);
    }, (err) => {
      console.log('Error: ', err);
    })
  }

  /**
   * Method to open load money page
   */
  loadMoney() {
    this.browserTab.isAvailable()
      .then((isAvailable: boolean) => {
        if (isAvailable) {
          this.browserTab.openUrl('https://blocktrades.us/?' +
            '&output_coin_type=STEEM' +
            '&receive_address=' + this.user +
            '&memo=' /* +this.memo */);
        } else {
          // if custom tabs are not available you may use InAppBrowser
        }
      });
  }

  /**
   * Method to complete mayment
   */
  pay() {
    this.browserTab.isAvailable()
      .then(isAvailable => {
        if (isAvailable) {
          this.browserTab.openUrl('https://steemconnect.com/sign/transfer?to=' + this.scanned_code.account +
            '&amount=' + this.scanned_code.amount + '%20' + this.scanned_code.wallet +
            '&memo=' + this.scanned_code.memo)
        } else {
          // open URL with InAppBrowser instead or SaafariViewController
        }
      }).then(() => {
        this.scanned_code = null;
      });
  }

  /**
   * Method to cancel payment
   */
  cancel() {
    this.scanned_code = null;
  }

  /**
   * Method to transfer coins
   * @param coin
   */
  showPrompt(coin) {
    let prompt = this.alertCtrl.create({
      title: "Transfer to Account",
      // subTitle: "Move funds to another Steem account.",
      message: "Click the button below to be redirected to SteemConnect to complete your transaction.",
      cssClass: 'alert-center',
      enableBackdropDismiss: true,
      inputs: [{
        name: 'username',
        placeholder: "Payment recipient",
      }, {
        name: 'amount',
        placeholder: "How much do you want to send?",
      }, {
        name: 'memo',
        placeholder: "This memo is public!"
      }],
      buttons: [{
        text: 'Cancel',
        cssClass: 'block round dark ion-button'
      },
      {
        text: 'Send',
        handler: data => {
          this.browserTab.isAvailable()
            .then((isAvailable: boolean) => {
              if (isAvailable) {

                this.browserTab.openUrl('https://steemconnect.com/sign/transfer?to=' + data.username +
                  '&amount=' + data.amount + '%20' + coin +
                  '&memo=' + data.memo);
              } else {
                // if custom tabs are not available you may  use InAppBrowser
              }
            });
        }
      }
      ]
    });
    prompt.present();
  }

  /**
   * Method to select wallet before transfer
   */
  showRadio() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Select Wallet');

    alert.addInput({
      type: 'radio',
      label: 'STEEM',
      value: 'STEEM',
      checked: true
    });

    alert.addInput({
      type: 'radio',
      label: 'SBD',
      value: 'SBD',
      checked: false
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        this.showPrompt(data);
      }
    });
    alert.present();
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