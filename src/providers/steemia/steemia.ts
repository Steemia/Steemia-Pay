import { HttpClient, HttpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  STEEM_API,
  STEEMIA_USERS,
  WALLET_HISTORY
} from '../../constants/constants';
import { UtilProvider } from '../util/util';
import { SteemConnectProvider } from '../steemconnect/steemconnect';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/operator/debounceTime";
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/share';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/retry';
import 'rxjs/operator/shareReplay';

/**
 * 
 * Class with Steemia API methods
 * 
 */

@Injectable()
export class SteemiaProvider {

  private username: string = '';

  constructor(public http: HttpClient,
              public util: UtilProvider,
              private steemConnect: SteemConnectProvider) {
    this.steemConnect.status.subscribe(res => {
      if (res.status === true) {
        this.username = res.userObject.user;
      }
    });
  }


  /**
   * Helper method to determine whether a string is empty
   * @param value: String to check
   * @returns a boolean statement determining whether it is empty or not
   */
  private isEmpty(value): boolean {
    return value === '' || value === ' ' || value === null || value === undefined
  }


  /**
   * Public method to dispatch profile info data
   * 
   * @method dispatch_profile_info
   * @param query: Object with data for query
   */
  public dispatch_profile_info(query): Promise<any> {

    return this.http.get(STEEMIA_USERS + 'info?' + this.util.encodeQueryData(query)).retry(3).toPromise();

  }
  
  /**
   * Public method to dispatch profile history data
   * 
   * @method dispatch_wallet_history
   * @param  query: Object with data for query
   */
  public dispatch_wallet_history(query): Promise<any> {

    return this.http.get(WALLET_HISTORY + this.util.encodeQueryData(query)).retry(3).toPromise();

  }

  /**
   * Public method to dispatch account data
   * 
   * @method dispatch_account
   * @param {string} account: Username of the user
   */
  public dispatch_account(account): Promise<any> {
    return this.http.get(STEEM_API + 'get_accounts?names[]=%5B%22' + account + '%22%5D')
      .share().toPromise();
  }

  /**
   * Method to get crypto prices
   **/
  public get_steem_price(curreny) {
    return new Promise(resolve => {
      this.http.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=STEEM,SBD*&tsyms='+ curreny)
        .toPromise().then((data: any) => {
          resolve({
            data
          });
        });
    }).catch(e => console.log(e))
  }


}
