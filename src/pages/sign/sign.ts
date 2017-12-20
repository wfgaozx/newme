import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TreeModule } from 'angular-tree-component';
import { ITreeState } from 'angular-tree-component'
import { AppConfig, Node } from './../../app/app.config';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';

/**
 * Generated class for the SignPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
//@IonicPage()
@Component({
  selector: 'page-sign',
  templateUrl: 'sign.html',
})
export class SignPage {
  pageSlides: string[] = ["版面", "栏目"];
  selectedIndex;  //当前库索引
  formColumn;                //column的Form
  groupColumn;              //column的radio group
  pageState: ITreeState;     //Page Tree state
  curmedia;           //当前媒体
  curmediaguid;       //当前媒体guid
  curmediacode;       //当前媒体code
  curColumn;        //当前栏目
  curColumnId;   //当前栏目索引
  columns;          //所有栏目数组
  myid = 0;         //tree id 计数
  pageNodes: Array<Node>;   //版面树
  pageArray: Array<Node>;    //版面数组,序号对应节点
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.selectedIndex = 0;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignPage');
  }

  onSlideClick(index) {
  }
  
 /*
  getPage() {
    let url = 'http://' + AppConfig.mainurl + AppConfig.secondurl + 'publish_story/issue_pages';
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let param = {
      userid: AppConfig.userid,
      mediaid: this.curmediaguid
    }

    this.http.post(url, JSON.stringify(param), options).map(res => res.json())
      .subscribe(data => {
        console.log(data);
        var success = data['isSuccess'];
        if (success) {
          var retdata = data['data'];
          this.pageNodes = [];
          this.myid = 0;
          this.pageArray = [];
          this.addPageNodes(this.pageNodes, retdata);
          this.cd.detectChanges();
        } else {
          let err = data['message'];
          let toast = this.toastCtrl.create({
            message: err,
            duration: 2000
          });
          toast.present();
        }
      });
  }

  getColumn() {
    let url = 'http://' + AppConfig.mainurl + AppConfig.secondurl + 'story/sendcolumn';
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let param = {
      userid: AppConfig.userid,
      mediaid: this.curmediaguid
    }
    this.http.post(url, JSON.stringify(param), options).map(res => res.json())
      .subscribe(data => {
        console.log(data);
        var success = data['isSuccess'];
        if (success) {
          var retdata = data['data'];
          if (retdata.length > 0) {
            this.columns = retdata[0].columns;
            //设为第一个栏目
            if (this.storageService.read('choiceColumn')) {
              this.curColumn = this.storageService.read('choiceColumn');
              this.curColumnId = this.storageService.read('choiceColumnId');
              this.formColumn.patchValue({ groupColumn: this.curColumn });
            }else{
              this.formColumn.patchValue({ groupColumn: this.columns[0].name });
              this.curColumn = this.columns[0].name;
              this.curColumnId = this.columns[0].sguid;
            }
          } else {
            this.columns = [];
          }

        } else {
          let err = data['message'];
          let toast = this.toastCtrl.create({
            message: err,
            duration: 2000
          });
          toast.present();
        }
      });
  }
*/  
}
