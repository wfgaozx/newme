import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController, ToastController } from 'ionic-angular';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { StorageService } from '../../providers/storage-service';
import * as xml2js from 'xml2js';
import { AppConfig } from './../../app/app.config';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { ChangeDetectorRef } from '@angular/core';

/**
 * Generated class for the ProofnPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-proofn',
  templateUrl: 'proofn.html',
})
export class ProofnPage {
  public pubdate = '2017-9-09';
  curMedia;     //当前媒体
  curMediaId;   //当前媒体Id
  medias;       //所有媒体

  curfold: string;
  //  folds = ['A1', 'A2', 'A3'];
  folds;      //叠数组
  pages;      //页数组

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private http: Http, private toastCtrl: ToastController, private storageService: StorageService,
    private photoViewer: PhotoViewer, public cd: ChangeDetectorRef) {
    this.medias = AppConfig.medias;
    this.curMedia = this.medias[0].medianame;
    this.curMediaId = this.medias[0].sguid;
    let today = new Date();
    this.pubdate = today.getFullYear() + '-' + PrefixInteger((today.getMonth() + 1), 2) + '-' +
      PrefixInteger(today.getDate(), 2);
    this.getproofpage();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProofnPage');
  }

  getproofpage() {
    let url = 'http://' + AppConfig.mainurl + AppConfig.secondurl + 'fullPage_Proof/browse_pages';
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let param = {
      userid: AppConfig.user.userid,
      mediaid: this.curMediaId
    }

    this.http.post(url, JSON.stringify(param), options).map(res => res.json())
      .subscribe(data => {
        console.log(data);
        var success = data['isSuccess'];
        if (success) {
          var retData0 = data['data'][0];
          this.folds = retData0.folds;
          this.curfold = this.folds[0].name;
          this.pages = [];
          var pages = this.folds[0].pages;
          for (var k = 0; k < pages.length; k++) {
            var page = pages[k];
            this.getpageinfo(page, this.curfold);
          }
          this.cd.detectChanges();
        }else{
/*          
          let toast = this.toastCtrl.create({
            message: '读版面错',
            duration: 2000
          });
          toast.present();
*/          
          let toast = this.toastCtrl.create({
            message: '登陆成功',
            duration: 1500
          });
          toast.present(); 
          }


      });
  }

  getpageinfo(page, foldName) {
    var date = this.pubdate.replace(/-/g, '/');
    let url = 'http://' + AppConfig.mainurl + AppConfig.secondurl + 'fullpage_proof/pageproofs';
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let param = {
      userid: AppConfig.user.userid,
      ProofFile: '',
      medianame: this.curMedia,
      publishdate: date,
      publishtime: '',
      foldername: foldName,
      pagename: page.name
    }
    this.http.post(url, JSON.stringify(param), options).map(res => res.json())
    .subscribe(data => {
      console.log(data);
      var success = data['isSuccess'];
      if (success) {
        var retData = data['data'][0];
        var fileInfo = retData.fileinfo;
        var action = '';
        if (retData.pagestatus == '见报') {
          action = '撤签';
        }
        else {
          action = '签版';
        }
        this.pages.push({
          name: page.name,
          number: page.pagenum,
//          pageStatus: '状态:' + retData.pagestatus,
          pageStatus: retData.pagestatus,
          operator: '操作员:' + retData.operatorname,
          disposerId: retData.disposerid,
          disposerName: '处理人:' + retData.disposername,
          nextDisposerId: retData.nextdisposerid,
          nextDisposerName: retData.nextdisposername,
          nextDisposerNameLbl: '下个处理人:' + retData.nextdisposername,
          publishdate: retData.publishdate,
          foldername: retData.foldername,
          complementTime: retData.complement,
          action: action,
          path: fileInfo.path,
          zoomPath: fileInfo.pathzoom,
          pdfPath:fileInfo.PDFpath
        });
      }else{
        let toast = this.toastCtrl.create({
          message: '读版面信息错',
          duration: 2000
        });
        toast.present();
    }
    });

  }

//选择媒体
  selectMedia(event, media, index){
    var media = this.medias[index];
    this.curMediaId = media.sguid;

    this.getproofpage();
  }

  foldselect($event, fold){
    this.pages = [];
    var pages = this.folds[0].pages;
    for (var k = 0; k < pages.length; k++) {
      var page = pages[k];
      this.getpageinfo(page, this.curfold);
    }
  }

  dispage(page) {
    this.photoViewer.show(encodeURI(page.path));
  }

  changeDate() {
    this.getproofpage();
  }

  sign(page){
    if(page.pageStatus == '待审' || page.pageStatus == '已审'){
      if(page.nextDisposerName != AppConfig.user.username){
        let toast = this.toastCtrl.create({
          message: '送审用户不是当前用户',
          duration: 2000
        });
        toast.present(); 
      }else{
        this.setStatus(page, '签版');
      }
    }else{
      if(page.pageStatus == '见报' || page.pageStatus == '已审'){
        if(page.nextDisposerName != AppConfig.user.username){
          let toast = this.toastCtrl.create({
            message: '你不是签发版面的用户',
            duration: 2000
          });
          toast.present(); 
        }else{
          this.setStatus(page, '撤签');
        }
      }else{  //报错
        let toast = this.toastCtrl.create({
          message: '不是待审和已审状态',
          duration: 2000
        });
        toast.present(); 
      }
    }
  }

  setStatus(page, status){
    let url = 'http://' + AppConfig.mainurl + AppConfig.secondurl + 'fullpage_proof/setpagestatus';
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let param = {
      userid: AppConfig.user.userid,
      pagestatus: status,
      medianame: this.curMedia,
      publishdate: page.publishdate,
      publishtime: '',
      foldername: page.foldername,
      pagename: page.name
    }
    this.http.post(url, JSON.stringify(param), options).map(res => res.json())
    .subscribe(data => {
      console.log(data);
      var success = data['isSuccess'];
      if (success) {
        var retData0 = data['data'][0];
        var message = retData0.message;
        let toast = this.toastCtrl.create({
          message: message,
          duration: 2000
        });
      }else{
        let toast = this.toastCtrl.create({
          message: '签发撤签错',
          duration: 2000
        });
      }
    });
  }  
}

function PrefixInteger(num, length) {
  return ("0000000000000000" + num).substr(-length);
}
