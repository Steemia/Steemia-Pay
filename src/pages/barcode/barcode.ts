import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, ToastController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { SteemiaProvider } from '../../providers/steemia/steemia';
import { SteemConnectProvider } from '../../providers/steemconnect/steemconnect';

@IonicPage()
@Component({
  selector: 'page-barcode',
  templateUrl: 'barcode.html',
})
export class BarcodePage {

  public user;
  private cryptos;

  public wallet: string = 'STEEM';
  public currency: string = 'USD';
  public memo: string = '';
  public amount = null;
  public created_code = null;

  public STEEM;
  public SBD;

  public qr_data = {
    "amount": "",
    "account": "",
    "currency": "",
    "wallet": "",
    "memo": ""
  }

  constructor(public navCtrl: NavController, 
    public viewCtrl: ViewController,
    private steemia: SteemiaProvider,
    public alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private steemConnect: SteemConnectProvider,
    private barcodeScanner: BarcodeScanner,
    public navParams: NavParams) {
      this.user = (this.steemConnect.user_temp as any).user
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BarcodePage');
    this.getPrices();
  }

  /** 
  * Method to update currency value
  */
  updateCurrencyValue(event) {
      this.currency = event;
      this.getPrices();
  }

  /** 
  * Method to update wallet value
  */
  updateWalletValue(event) {
    this.wallet = event;
    console.log(this.wallet)
  }

  /** 
  * Method to update amount value
  */
  updateAmountValue(event) {
    this.amount = event;
    console.log(this.amount)
  }

  /** 
  * Method to update currency value
  */
  updateMemoValue(event) {
    this.memo = event;
    console.log(this.memo)
  }

  /** 
  * Method to update STEEM & SBD rates
  */
  getPrices() {
    this.steemia.get_steem_price(this.currency).then(data => {
      this.cryptos = data;
      this.STEEM = this.cryptos.data['STEEM']
      this.SBD   = this.cryptos.data['SBD*']

      this.STEEM = this.STEEM[this.currency]
      this.SBD = this.SBD[this.currency]
    })
  }

  /** 
  * Method to issue barcode
  */
  createCode() {
      this.qr_data.account = this.user;
      this.qr_data.currency = `${this.amount} ${this.currency}`;
      this.qr_data.wallet = this.wallet;
      this.qr_data.memo = this.memo;

      if(!this.amount) {
        this.presentToast();
      } else {
        if (this.wallet === 'STEEM') {
          this.qr_data.amount =  (this.amount / this.STEEM).toFixed(3)
          console.log(this.qr_data.amount);
        } else if (this.amount = 'SBD') {
          this.qr_data.amount = (this.amount / this.SBD).toFixed(3)
          console.log(this.qr_data.amount);
        }

      this.created_code = JSON.stringify(this.qr_data);
    }
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Enter the amount!',
      duration: 3000,
      position: 'top'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }

 
  private dismiss() {
    this.viewCtrl.dismiss();
  }
}
