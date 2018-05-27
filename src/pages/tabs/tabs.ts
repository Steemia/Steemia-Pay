import { Component } from '@angular/core';
import { SteemConnectProvider } from '../../providers/steemconnect/steemconnect';

import { HomePage } from '../home/home';
import { WalletPage } from '../wallet/wallet';
import { UserPage } from '../user/user';
import { MapPage } from '../map/map';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = MapPage;
  tab3Root = WalletPage;
  tab4Root = UserPage;

  constructor(private steemConnect: SteemConnectProvider) {

  }
}
