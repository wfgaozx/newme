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
 * Generated class for the ProofPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-proof',
  templateUrl: 'proof.html',
})

export class ProofPage {
  public event = {
    month: '2017-09-09',
    timeStarts: '07:43',
    timeEnds: '1990-02-20'
  };
  public pubdate = '2017-9-09';

  curfold: string;
  //  folds = ['A1', 'A2', 'A3'];
  folds;      //叠数组
  pages;      //页数组

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private http: Http, private toastCtrl: ToastController, private storageService: StorageService,
    private photoViewer: PhotoViewer, public cd: ChangeDetectorRef) {
    let today = new Date();
    this.pubdate = today.getFullYear() + '-' + PrefixInteger((today.getMonth() + 1), 2) + '-' +
      PrefixInteger(today.getDate(), 2);
    this.getproofpage();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProofPage');
  }

  getproofpage() {
    let url = 'http://222.217.87.186:1191' + '/hwphone/HandlerMobileV2.ashx';
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
    var sdate = this.pubdate.replace('-', '/')
    let param = 'functionName=GetPagesBaseInfo&sUserId=6e91ad8fbdd94352939788aff70bb9b8&sPubDate=' +
      sdate;
    var SubFucParams;
    var medias;

    this.http.post(url, param, options)
      .subscribe(data => {
        console.log(data.text());
        var retstr = data.text().replace('\r\n_HG_START_\r\n', '')
          .replace('\r\n_HG_END_\r\n', '');
        xml2js.parseString(retstr, function (err, result) {
          SubFucParams = result['SubFucParams'];
        });
        medias = SubFucParams['Media'];

        this.folds = [];
        this.pages = [];
        for (var i = 0; i < medias.length; i++) {
          var media = medias[i];
          var medianame = media.snMediaName;
          var folds = media.Folder;
          for (var j = 0; j < folds.length; j++) {
            var fold = folds[j];
            var fold_name = fold.FolderName;
            this.folds.push({
              name: medianame + fold_name,
              fold: fold
            });
          }
        }
        this.curfold = this.folds[0].name;
        this.pages = [];
        var pages = this.folds[0].fold.Page;
        for (var k = 0; k < pages.length; k++) {
          var page = pages[k];
          this.getpageinfo(page);
            }
        this.cd.detectChanges();
      });
  }

  foldselect(event, fold) {
    this.pages = [];
    var pages = fold.fold.Page;
    for (var k = 0; k < pages.length; k++) {
      var page = pages[k];
      this.getpageinfo(page);
    }
  }

  getpageinfo(page)
  {
    let url = 'http://222.217.87.186:1191' + '/hwphone/HandlerMobileV2.ashx';
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
    var name = page.PageName;
    var sdate = this.pubdate.replace('-', '/');
    //    let param = 'functionName=GetProofInfoFromYJ&MediaName=贺州日报&MediaCode=HZ&PublishDate=2017/08/17&FolderName=A叠&PageName=' +
    //      name + '&Publisher=6e91ad8fbdd94352939788aff70bb9b8';
    let param = 'functionName=GetProofInfoFromYJ&MediaName=贺州日报&MediaCode=HZ&PublishDate=' +
      sdate + '&FolderName=A叠&PageName=' +
      name + '&Publisher=6e91ad8fbdd94352939788aff70bb9b8';
    var SubFucParams;
    var fileinfo, path;
    
    this.http.post(url, param, options)
    .subscribe(data => {
      console.log(data.text());
      var retstr = data.text().replace('\r\n_HG_START_\r\n', '')
        .replace('\r\n_HG_END_\r\n', '');
      xml2js.parseString(retstr, function (err, result) {
        SubFucParams = result['SubFucParams'];
      });
      fileinfo = SubFucParams.FileInfo;
      path = fileinfo[0].Path[0];

      var action = '';
      if(SubFucParams.PageStatus == '见报'){
        action = '撤签';
      }
      else{
        action = '签发';
      }
      this.pages.push({
        name: page.PageName,
        number: page.iPageNumber,
        pagestatus: '状态:' + SubFucParams.PageStatus,
        disposerid: SubFucParams.DisposerID,
        disposername: '处理人:' + SubFucParams.DisposerName,
        complementtime: SubFucParams.PageCompleteTime,
        action:action,
        path: path
      })
    });

}

  dispage(page) {
    let url = 'http://222.217.87.186:1191' + '/hwphone/HandlerMobileV2.ashx';
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
    var name = page.name;
    var sdate = this.pubdate.replace('-', '/');
    //    let param = 'functionName=GetProofInfoFromYJ&MediaName=贺州日报&MediaCode=HZ&PublishDate=2017/08/17&FolderName=A叠&PageName=' +
    //      name + '&Publisher=6e91ad8fbdd94352939788aff70bb9b8';
    let param = 'functionName=GetProofInfoFromYJ&MediaName=贺州日报&MediaCode=HZ&PublishDate=' +
      sdate + '&FolderName=A叠&PageName=' +
      name + '&Publisher=6e91ad8fbdd94352939788aff70bb9b8';
    var SubFucParams;
    var fileinfo, path;

    this.http.post(url, param, options)
      .subscribe(data => {
        console.log(data.text());
        var retstr = data.text().replace('\r\n_HG_START_\r\n', '')
          .replace('\r\n_HG_END_\r\n', '');
        xml2js.parseString(retstr, function (err, result) {
          SubFucParams = result['SubFucParams'];
        });
        fileinfo = SubFucParams.FileInfo;
        path = fileinfo[0].Path[0];

        this.photoViewer.show(encodeURI(path));
      });

  }

  changeDate() {
    this.getproofpage();
  }

  sign(page){
    
  }

}

function PrefixInteger(num, length) {
  return ("0000000000000000" + num).substr(-length);
}

