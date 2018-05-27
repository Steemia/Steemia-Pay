import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { SteemConnectProvider } from '../../providers/steemconnect/steemconnect';

declare var google: any;

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {

  @ViewChild('map') mapRef: ElementRef;
  map: any;

  private latitude;
  private longitude;
  private user;
ß
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private steemConnect: SteemConnectProvider,
    private geolocation: Geolocation) { 
      this.user = (this.steemConnect.user_temp as any).user;
    }

  ionViewDidLoad() {
    this.getLocaltion();
    console.log('ionViewDidLoad MapPage');
  }

  initMap() {
    let location = new google.maps.LatLng(this.latitude, this.longitude);

    let options = {
      center: location,
      zoom: 16
    }

    this.map = new google.maps.Map(this.mapRef.nativeElement, options);

    this.addMarker(location, this.map);
  }

  getLocaltion() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      this.initMap();

     }).catch((error) => {
       console.log('Error getting location', error);
     });
     
     let watch = this.geolocation.watchPosition();
     watch.subscribe((data) => {
      // data can be a set of coordinates, or an error (if an error occurred).
      this.latitude = data.coords.latitude;
      this.longitude = data.coords.longitude;
     });
  }

  addMarker(position, map) {
    return new google.maps.Marker({
      position,
      map,
      title: `@${this.user}`
    })
  }
}
