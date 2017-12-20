import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HgloginPage } from '../hglogin/hglogin';
//import { Mylib } from '../mylib/mylib';
import { WorklibPage } from '../worklib/worklib';
import { WaitlibPage } from '../waitlib/waitlib';

//WorklibPage

/**
 * Generated class for the HomePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  onLogin(){
   this.navCtrl.push(HgloginPage,{
      });    
  }

  doWorklib(){
   this.navCtrl.push(WorklibPage, {
      });    
  }

  doWaitlib(){
   this.navCtrl.push(WaitlibPage, {
     type:'wait'
      });    
  }

  doxhlib(){
    this.navCtrl.push(WaitlibPage, {
      type:'xh'
    });    
   }
 }
