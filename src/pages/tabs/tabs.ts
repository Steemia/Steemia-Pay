import { Component } from '@angular/core';
import { SteemConnectProvider } from '../../providers/steemconnect/steemconnect';
import { IonicPage } from 'ionic-angular';

@IonicPage({
  priority: 'high'
})
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = "HomePage";
  tab2Root = "MapPage";
  tab3Root = "WalletPage";
  tab4Root = "UserPage";

  constructor(private steemConnect: SteemConnectProvider) {

  }
}
