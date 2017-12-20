import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the HistoryPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
//@IonicPage()
@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class HistoryPage {
  history;          //历史

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.history = this.navParams.get("history");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HistoryPage');
  }

}
