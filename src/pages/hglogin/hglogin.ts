import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController, ToastController } from 'ionic-angular';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { StorageService } from '../../providers/storage-service';
import * as xml2js from 'xml2js';
import { AppConfig, SendTo, ChoiceTo, Catagory } from './../../app/app.config';
import { Md5 } from 'ts-md5/dist/md5'
//import CryptoJS from 'crypto-js'
import * as CryptoJS from 'crypto-js';
/**
 * Generated class for the HgloginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-hglogin',
  templateUrl: 'hglogin.html',
})
export class HgloginPage {
  public ipaddress: string;
  public username: string;
  public password: string;
  loginip: string;
  channelid: string;
  staffId:string = 'dIVT18iSWC46yYyKXhs9ucks2jc=';

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private http: Http, private toastCtrl: ToastController, private storageService: StorageService) {

    this.ipaddress = '192.168.50.85';
    this.username = 'admin';
    this.password = '00';
    this.loginip = '';
    this.channelid = '';

    let a = '1511315062958164719621129dIVT18iSWC46yYyKXhs9ucks2jc=HGHTCB';
    var b=a.split("");       //分割字符串a为数组b
    b.sort();              //数组b升序排序（系统自带的方法）
    var c=b.join("");
    var d:string = Md5.hashStr(c).toString();
    var e=d.toUpperCase();

   console.log(Md5.hashStr("123456"));
   let obj = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(['abcd', 'qqq'].join(':'), 'qqq'));
   
   console.log(obj);

   let rand  = 1000 * Math.random();
   console.log(rand);

   let time = this.getTimestamp();
   console.log(time);
   
   let srd = this.GetRandom();
   console.log(srd);
  }

  private makesign(a:string):string {
    var b=a.split("");       //分割字符串a为数组b
    b.sort();              //数组b升序排序（系统自带的方法）
    var c=b.join("");
    var d:string = Md5.hashStr(c).toString();
    var e=d.toUpperCase();
    return d;
}

  /*
          private static string GetTimeStamp()
        {
            //TimeSpan ts = DateTime.UtcNow - new DateTime(1970, 1, 1, 0, 0, 0, 0);
            //return Convert.ToInt64(ts.TotalMilliseconds).ToString();
            DateTime dateStart = new DateTime(1970, 1, 1, 8, 0, 0);
            int timeStamp = Convert.ToInt32((DateTime.Now - dateStart).TotalSeconds);
            return timeStamp.ToString();

private string GetRandom()
        {
            Random rd = new Random(DateTime.Now.Millisecond);
            int i = rd.Next(0, int.MaxValue);
            return i.ToString();
        }
}
*/
/**
     * 获取当前时间 时间戳
     */
    private getTimestamp():string {
      let timestamp = (new Date().getTime()).toString();
      return timestamp;
  }

  private GetRandom():string {
    let rd = Math.floor((new Date().getTime()) * Math.random()).toString();
    return rd;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HgloginPage');
  }

  /*
  //json调用
  let headers = new Headers({ 'Content-Type': 'application/json' });
  let options = new RequestOptions({ headers: headers });
  this.http.post(this.url, JSON.stringify({ 'id': '1' }), options).subscribe(function (data) 
   
  //form调用
  let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
  let options = new RequestOptions({ headers: headers });
  var param = 'functionName=HGMELogin&Username=songyk&Password=666666&ClientSystem=Macos&sIP=192.168.60.186&channelId=1';
   
  */

  login() {
    this.storageService.write('mainurl', this.ipaddress);
    AppConfig.mainurl = this.ipaddress;

    let url = 'http://' + AppConfig.mainurl + AppConfig.secondurl + 'User/login';
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let param = '{"loginname":"' + this.username + '","password":"' + this.password +
      '","mobiletype":"ios", "loginIP":"' + this.loginip + '","channelId":"' + this.channelid +
      '"}';
    let jparam = {
      loginname: this.username,
      password: this.password,
      mobiletype: 'MacOS',
      mobilename: 'iphone',
      tokennum: '12345',
      loginIP: this.loginip,
      channelId: this.channelid
    };
    var ReturnInfo;

    this.http.post(url, JSON.stringify(jparam), options).map(res => res.json())
      .subscribe(data => {
        console.log(data);

        var success = data['isSuccess'];
        if (success) {
          var retdata = data['data'];
          let userinfo = retdata['userinfo'];
          let server = retdata['configinfo'];
          AppConfig.user = userinfo;
          AppConfig.server = server;
          this.storageService.write('user', userinfo);
          this.storageService.write('server', server);

          let userid = userinfo['userid'];
          this.storageService.write('userid', userid);
          AppConfig.userid = userid;
          let username = this.username;
          this.storageService.write('username', username);
          AppConfig.username = username;

          var sendto = new SendTo();
          sendto.type = 'Employ';
          sendto.name = AppConfig.user.username;
          sendto.id = AppConfig.userid;
          sendto.index = 1;
          sendto.medianame = AppConfig.user.mediaName;
          sendto.mediaid = AppConfig.user.mediaid;
          sendto.mediacode = AppConfig.user.mediaCode;
          AppConfig.sendto = sendto;
          this.storageService.write('sendto', AppConfig.sendto);

          var choiceto = new ChoiceTo();
          choiceto.type = 'Employ';
          choiceto.name = AppConfig.user.username;
          choiceto.id = AppConfig.userid;
          choiceto.index = 0;
          choiceto.medianame = AppConfig.user.mediaName;
          choiceto.mediaid = AppConfig.user.mediaid;
          choiceto.mediacode = AppConfig.user.mediaCode;
          AppConfig.choiceto = choiceto;
          this.storageService.write('choiceto', AppConfig.choiceto);

          this.loadxhtype();
          this.loadxhcatagory();
          this.load_source();

          //读入媒体
//          this.getmedia()
          this.getmedia_sign()
          
          let toast = this.toastCtrl.create({
            message: '登陆成功',
            duration: 1500
          });
          toast.present();
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

  loadxhtype() {
    let url = 'http://' + AppConfig.mainurl + AppConfig.secondurl + 'search_story/xhsproducts';
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let param = '{"userid":"' + AppConfig.userid + '","username": "","deptname": "","deptid": "",' +
      '"mediaid": "","mediaName": ""}';
    this.http.post(url, param, options).map(res => res.json())
      .subscribe(data => {
        console.log(data);
        var retdata = data.data;
        var success = data['isSuccess'];
        if (success) {
          AppConfig.xhtypes = [];
          for (var i = 0; i < retdata.length; i++) {
            AppConfig.xhtypes.push({
              name: retdata[i].name,
              id: retdata[i].id
            });
          }
          this.storageService.write('xhtypes', AppConfig.xhtypes);
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

  loadxhcatagory() {
    let url = 'http://' + AppConfig.mainurl + AppConfig.secondurl + 'search_story/catagorys';
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let param = '{"userid":"' + AppConfig.userid + '","username": "","deptname": "","deptid": "",' +
      '"mediaid": "","mediaName": ""}';
    let jparam = {
      userid: AppConfig.userid,
    }

    //    this.http.post(url, param, options).map(res => res.json())
    this.http.post(url, JSON.stringify(jparam), options).map(res => res.json())
      .subscribe(data => {
        console.log(data);
        var retdata = data.data;
        var success = data['isSuccess'];
        if (success) {
          let data0 = retdata[0];
          if (data0.type == 'GBNews') {
            let gbcata = data0.catagory;
            var first = new Catagory();
            first.id = '';
            first.name = '全部';
            first.sort = 0;
            gbcata.unshift(first);
            AppConfig.gbcatagorys = gbcata;
            this.storageService.write('gbcatagorys', AppConfig.gbcatagorys);
          } else {
            let toast = this.toastCtrl.create({
              message: '读国标类别错',
              duration: 2000
            });
            toast.present();
          }
          let data1 = retdata[1];
          if (data1.type == 'GBLocate') {
            let loccata = data1.catagory;
            var first = new Catagory();
            first.id = '';
            first.name = '全部';
            first.sort = 0;
            loccata.unshift(first);
            AppConfig.loccatagorys = loccata;
            this.storageService.write('loccatagorys', AppConfig.loccatagorys);
          } else {
            let toast = this.toastCtrl.create({
              message: '读地区类别错',
              duration: 1500
            });
            toast.present();
          }

        }
      });
  }

  load_source() {
    let url = 'http://' + AppConfig.mainurl + AppConfig.secondurl + 'search_story/story_sources';
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let param = '';
    this.http.post(url, param, options).map(res => res.json())
      .subscribe(data => {
        console.log(data);
        var retdata = data.data;
        var success = data['isSuccess'];
        if (success) {
          AppConfig.sources = [];
          for (var i = 0; i < retdata.length; i++) {
            AppConfig.sources.push({
              name: retdata[i].name,
              id: retdata[i].id,
              bdefault: retdata[i].bdefault
            });
            this.storageService.write('sources', AppConfig.sources);
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

  //得到所有报纸
  getmedia() {
    let url = 'http://' + AppConfig.mainurl + AppConfig.secondurl + 'story/sendmedia';
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let jparam = {
      userid: AppConfig.userid,
      username: '',
      deptname: '',
      deptid: '',
      mediaid:'',
      mediaName:''
      }; 

    this.http.post(url, JSON.stringify(jparam), options).map(res => res.json())
    .subscribe(data => {
        console.log(data);
        var success = data['isSuccess'];
        if (success) {
          AppConfig.medias = data['data'];
          this.storageService.write('medias', AppConfig.medias);
          
          //sendto不对，在这改为第一个媒体
          if (AppConfig.sendto.mediacode == undefined) {
            let media = AppConfig.medias[0];
            AppConfig.sendto.mediaid = media.sguid;
            AppConfig.sendto.medianame = media.medianame;
            AppConfig.sendto.mediacode = media.mediacode;
            this.storageService.write('sendto', AppConfig.sendto);
          }
          //sendto不对，在这改为第一个媒体
          if (AppConfig.choiceto.mediacode == undefined) {
            let media = AppConfig.medias[0];
            AppConfig.choiceto.mediaid = media.sguid;
            AppConfig.choiceto.medianame = media.medianame;
            AppConfig.choiceto.mediacode = media.mediacode;
            this.storageService.write('choiceto', AppConfig.choiceto);
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

  getmedia_sign() {
    let url = 'http://' + AppConfig.mainurl + AppConfig.secondurl + 'story/sendmedia_sign';
    let timestamp = this.getTimestamp();
    let nonce = this.GetRandom();
    let str = timestamp + nonce + this.staffId + 'HGHTCB';
    let sign = this.makesign(str);
    let headers = new Headers({ 
      'Content-Type': 'application/json' ,
      'secretkey': this.staffId ,
      'timestamp': timestamp ,
      'nonce': nonce ,
      'signature': sign ,
    });
    let options = new RequestOptions({ headers: headers });
    let jparam = {
      userid: AppConfig.userid,
      username: '',
      deptname: '',
      deptid: '',
      mediaid:'',
      mediaName:'',
/*    secretkey: this.staffId,
      timestamp: this.getTimestamp(),
      nonce: this.GetRandom(),
      signature: sign
*/
        }; 
    let param = JSON.stringify(jparam);
      
    this.http.post(url, param, options).map(res => res.json())
    .subscribe(data => {
        console.log(data);
        var success = data['isSuccess'];
        if (success) {
          AppConfig.medias = data['data'];
 
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
}
