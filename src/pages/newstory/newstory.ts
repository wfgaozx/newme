import { Component } from '@angular/core';
import { NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ViewController, ToastController } from 'ionic-angular';
import { TreeModule } from 'angular-tree-component';
import { StorageService } from '../../providers/storage-service';
import { FileUploadProvider } from '../../providers/file-upload';

import { AppConfig } from './../../app/app.config';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import * as xml2js from 'xml2js';
import 'rxjs/Rx';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { Sendto } from '../sendto/sendto';

const URL1 = 'http://192.168.60.186/hwphone/HandlerMobileV2.ashx';
import { MultipartItem } from "../../plugins/multipart-upload/multipart-item";
import { MultipartUploader } from "../../plugins/multipart-upload/multipart-uploader";
import { AutoresizeDirective } from '../../directives/autoresize/autoresize';

declare let cordova: any;

/**
 * Generated class for the NewstoryPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-newstory',
  templateUrl: 'newstory.html',
})
export class NewstoryPage {
  isDebug;
  _zone;
  type: string = 'text';                   //稿件类型
  title;                  //标题
  text;                   //正文
  phototip;               //图说
  videotip;               //视说
  strsendto;              //投向字串

  private uploader: MultipartUploader = new MultipartUploader({ url: URL1 });
  multipartItem: MultipartItem = new MultipartItem(this.uploader);
  email: string = '726401078@qq.com';
  password: string = 'aa';
  file: File;


  public path;
  // *profilePicture: any = "https://www.gravatar.com/avatar/";
  //给image设置默认的图片
  profilePicture: any = "assets/img/live.jpg";

  nodes = [
    {
      id: 1,
      name: 'root1',
      children: [
        { id: 2, name: 'child1' },
        { id: 3, name: 'child2' }
      ]
    },
    {
      id: 4,
      name: 'root2',
      children: [
        { id: 5, name: 'child2.1' },
        {
          id: 6,
          name: 'child2.2',
          children: [
            { id: 7, name: 'subsub' }
          ]
        }
      ]
    }
  ];


  constructor(public navCtrl: NavController, public navParams: NavParams,
    private toastCtrl: ToastController, private camera: Camera, private http: Http,
    private storageService: StorageService, private fileupload: FileUploadProvider,
    _zone: NgZone) {
    this._zone = _zone;
    this.isDebug = AppConfig.isDebug;
    this.dislib();
    this.path = '';
  }

  dislib() {
    this.strsendto = '投向:'
    if (AppConfig.sendto != null) {
      switch (AppConfig.sendto.type) {
        case 'Raw':
          this.strsendto += '待编库';
          break;
        case 'Employ':
          if (AppConfig.sendto.id == AppConfig.user.userid) {
            this.strsendto += '我的稿库';
          }
          else {
            this.strsendto += '人员(' + AppConfig.sendto.name + ')';
          }
          break;
        case 'Dept':
          if (AppConfig.sendto.id == AppConfig.user.deptid) {
            this.strsendto += '我的部门';
          }
          else {
            this.strsendto += '部门(' + AppConfig.sendto.name + ')';
          }
          break;
        case 'Page':
          this.strsendto += '版面库(' + AppConfig.sendto.name + ')';
          break;
        case 'Column':
          this.strsendto += '栏目库(' + AppConfig.sendto.name + ')';
          break;
        default: break;
      }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewstoryPage');
  }

  takePhoto() {
    var options = {
      // Some common settings are 20, 50, and 100
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      // In this app, dynamically set the picture source, Camera or photo gallery

      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true,
      sourceType: this.camera.PictureSourceType.CAMERA,//拍照时，此参数必须有，否则拍照之后报错，照片不能保存

      correctOrientation: true  //Corrects Android orientation quirks
    }

    //
    // imageData就是照片的路径，关于这个imageData还有一些细微的用法，可以参考官方的文档。
    // 
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      let base64Image = imageData;
      this.path = base64Image;//给全局的文件路径赋值。
      this.profilePicture = base64Image;//给image设置source。
      //      alert(this.path);

      //  this.zone.run(() => this.image = base64Image);
    }, (err) => {
      // Handle error，出错后，在此打印出错的信息。
      alert(err.toString());
    });
  }

  choosePhoto() {
    var options = {
      // Some common settings are 20, 50, and 100
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      // In this app, dynamically set the picture source, Camera or photo gallery
      sourceType: 0,//0对应的值为PHOTOLIBRARY ，即打开相册
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: true,
      correctOrientation: true  //Corrects Android orientation quirks
    }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      //去掉文件名后的？字串
      var index = imageData.indexOf('?');
      if (index != -1) {
        imageData = imageData.substring(0, index);
      }

      let base64Image = imageData;
      this.path = base64Image;
      this.profilePicture = base64Image;
      //      alert(base64Image);
    }, (err) => {
      // Handle error
    });

  }
  chooseVideo() {
    var options = {
      // Some common settings are 20, 50, and 100
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      // In this app, dynamically set the picture source, Camera or photo gallery
      sourceType: 0,
      mediaType: 1,//为1时允许选择视频文件
      allowEdit: true,
      correctOrientation: true  //Corrects Android orientation quirks
    }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      let base64Image = imageData;
      this.path = base64Image;
      this.profilePicture = "assets/img/video.png";//选择视频后，image另外显示一张图片，目前还无法获取视频的第一帧图片。
      alert(this.path);
    }, (err) => {
      // Handle error
    });

  }

  /*
    //上传文字稿件
    functionName=UpLoadManuScript&Publisher=a8bc1ee088c24e13acda5e43c88bdb03&PublisherName=songyk&BelongFlag=Employ&BelongID=a8bc1ee088c24e13acda5e43c88bdb03&MediaCode=tc&MediaName=铜川日报&MediaID=0171166e5c4a41718718bef9ec9c116c&Type=.txt&MainTitle=test1&Name=宋益坤&Source=iPhone&DocContent=testcontent&StoryType=Text
    */
  doSent() {
    if (this.path == '') {
      this.SentText();
    } else {
      this.uploadphoto();
    }
  }

  SentText() {
    let url = 'http://' + AppConfig.mainurl + AppConfig.secondurl + 'story/sendstory';
    let headers = new Headers({ 'Content-Type': 'multipart/form-data' });
    let options = new RequestOptions({ headers: headers });
    let json = '{"sendtoinfo":{"userid":"' + AppConfig.userid + '", "username":"' + AppConfig.username +
      '","targetflag":"' + AppConfig.sendto.type + '","targetid":"' + AppConfig.sendto.id +
      '","mediaid":"' + AppConfig.sendto.mediaid + '","mediacode":"' + AppConfig.sendto.mediacode +
      '","medianame":"' + AppConfig.sendto.medianame + '","comment":"' + '初投' +
      '","source":"' + '自写稿' + '"},"storys":[{"title":"' + this.title +
      '", "author":"' + AppConfig.user.username + '","content":"' + this.text +
      '","stype":"Text","format":".txt","gener":"","catagory":"","filename":""}]}';

    var formData = new FormData();
    formData.append('storyjson', json);

    this.http.post(url, formData).map(res => res.json())
      .subscribe(data => {
        console.log(data);
        var retdata = data.data;

        var success = data['isSuccess'];
        if (success) {
          let toast = this.toastCtrl.create({
            message: '上传成功',
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

  doSendto() {
    this.navCtrl.push(Sendto, {
      callback: this.callback
    });

  }

  uploadphoto() {
    let url = 'http://' + AppConfig.mainurl + AppConfig.secondurl + 'story/sendstory';
    let headers = new Headers({ 'Content-Type': 'multipart/form-data' });
    let options = new RequestOptions({ headers: headers });
    var filename = this.path.substring(this.path.lastIndexOf("/") + 1, this.path.length);
    let json = '{"sendtoinfo":{"userid":"' + AppConfig.userid + '", "username":"' + AppConfig.username +
      '","targetflag":"' + AppConfig.sendto.type + '","targetid":"' + AppConfig.sendto.id +
      '","mediaid":"' + AppConfig.sendto.mediaid + '","mediacode":"' + AppConfig.sendto.mediacode +
      '","medianame":"' + AppConfig.sendto.medianame + '","comment":"' + '初投' +
      '","source":"' + '自写稿' + '"},"storys":[{"title":"' + this.title +
      '", "author":"' + AppConfig.user.username + '","content":"' + this.text +
      '","stype":"Photo","format":".jpg","gener":"","catagory":"","filename":"' +
      filename + '"}]}';

    var params = new Map<string, string>();
    var images: Array<string> = [];
    params.set("storyjson", json);
    images.push(this.path);
    this.fileupload.uploadFile(url, params, images, self, res => {
      let toast = this.toastCtrl.create({
        message: '投稿成功',
        duration: 1500
      });
      toast.present();
    }, error => {
      let err = error;
      let toast = this.toastCtrl.create({
        message: err,
        duration: 2000
      });
      toast.present();
    });

  }

  callback = (params) => {
    return new Promise((resolve, reject) => {
      this.dislib();
      resolve('ok');
    })
  }

  DelPhoto() {
    this._zone.run(() => {
      this.path = '';
      this.profilePicture = "assets/img/video.png";
    });
  }

}
