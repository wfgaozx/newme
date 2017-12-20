import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { AppConfig } from './../../app/app.config';
import { ViewController, ToastController } from 'ionic-angular';
import * as xml2js from 'xml2js';
import 'rxjs/Rx';
import { AutoresizeDirective } from '../../directives/autoresize/autoresize';
import { HistoryPage } from '..//history/history';

/**
 * Generated class for the StorydetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-storydetail',
  templateUrl: 'storydetail.html',
})
export class StorydetailPage {
  @ViewChild('textarea', { read: ElementRef }) textarea: ElementRef;

  stories = [];                  //稿件列表
  index;          //当前稿件
  title;                  //标题
  text;                   //正文
  label;                  //稿签
  author;                 //作者
  count;                  //字数
  gener;                  //题材
  source;                 //来源，
  sender;                 //投稿人
  lastTime;               //最后处理时间 
  lblDisplay;             //是否显示稿签
  history;                //历史
  libtype;                //待编稿库为wait,工作稿库为work
  profilePicture: any = "assets/img/live.jpg";

  medianame;
  guid;
  guidorg;
  type;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private toastCtrl: ToastController,
    private http: Http) {
    this.stories = this.navParams.get('stories');
    this.index = this.navParams.get('index');
    this.libtype = this.navParams.get('source');
    this.medianame = this.navParams.get('media');
    this.getstoryino();
    this.getLabel();
    this.getHistory();
  }

  getstoryino() {
    let story = this.stories[this.index];
    this.guid = story.sguid;
    this.guidorg = story.sguidorg;

    switch (story.storytype) {
      case '图片':
        this.type = 'PHOTO';
        break;
      case '文本':
        this.type = 'TEXT';
        break;
      default:
        break;
    }
    switch (this.libtype) {
      case 'work':
        this.getdetail();
        break;
      case 'wait':
        this.getwaitdetail();
        break;
      default:
        break;
    }
    setTimeout(() => {
      let ta = this.textarea.nativeElement.querySelector("textarea");
      ta.style.overflow = "hidden";
      ta.style.height = "auto";
      ta.style.height = ta.scrollHeight + "px";
    }, 100);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StorydetailPage');
  }

  getdetail() {
    var url;
    switch (this.libtype) {
      case 'work':
        url = 'http://' + AppConfig.mainurl + AppConfig.secondurl + 'workstory/story_content';
        break;
      case 'wait':
        url = 'http://' + AppConfig.mainurl + AppConfig.secondurl + 'search_story/workstory_content';
        break;
    }
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let param = '{"sguid":"' + this.guid + '"}';
    let jparam = {
      sguid: this.guid,
      medianame: this.medianame
    }

    this.http.post(url, JSON.stringify(jparam), options).map(res => res.json())
      .subscribe(data => {
        console.log(data);
        var retdata = data.data;

        var success = data['isSuccess'];
        if (success) {
          this.title = retdata.title;
          this.text = retdata.content;
          this.profilePicture = retdata.urlmidd;
          this.count = retdata.wordcount;
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

  getwaitdetail() {
    let url = 'http://' + AppConfig.mainurl + AppConfig.secondurl + 'search_story/orgstory_content';
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let param = '{"sguid":"' + this.guid + '"}';

    this.http.post(url, param, options).map(res => res.json())
      .subscribe(data => {
        console.log(data);
        var retdata = data.data;

        var success = data['isSuccess'];
        if (success) {
          this.title = retdata.title;
          this.text = retdata.content;
          this.profilePicture = retdata.urlmidd;
          this.count = retdata.wordcount;
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

  getLabel() {
    let url = 'http://' + AppConfig.mainurl + AppConfig.secondurl + 'search_story/story_sign';
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    var guid;
    switch (this.libtype) {
      case 'work':
        guid = this.guidorg;
        break;
      case 'wait':
        guid = this.guid
        break;
    }
    let param = {
      sguid: guid,
    };

    this.http.post(url, JSON.stringify(param), options).map(res => res.json())
      .subscribe(data => {
        console.log(data);
        var retdata = data.data;

        var success = data['isSuccess'];
        if (success) {
          this.label = retdata;
          this.author = this.label.author;
          this.gener = this.label.gener;
          this.source = this.label.source;
          this.sender = this.label.sender;
          this.lastTime = this.label.lastprocesstime;
          /*
          gener;                  //题材
            source;                 //来源，待编稿库为wait
            sender;                 //投稿人
            lastTime;               //最后处理时间 
            */
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

  getHistory() {
    let url;
    //    var guid;
    switch (this.libtype) {
      case 'work':
        url = 'http://' + AppConfig.mainurl + AppConfig.secondurl + 'process_story/workstory_historys';
        //        guid = this.guidorg;
        break;
      case 'wait':
        url = 'http://' + AppConfig.mainurl + AppConfig.secondurl + 'process_story/original_historys';
        //        guid = this.guid;
        break;
    }
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let param = {
      sguid: this.guid,
      medianame: this.medianame
    };

    this.http.post(url, JSON.stringify(param), options).map(res => res.json())
      .subscribe(data => {
        console.log(data);
        var retdata = data.data;

        var success = data['isSuccess'];
        if (success) {
          this.history = retdata;
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

  swipeEvent(event) {
    console.log(event);
    var left = false;       //左划
    if (event.overallVelocityX < 0) {
      left = true;
    }
    if (left) {
      if (this.index < this.stories.length - 1) {
        this.index++;
      } else {
        let toast = this.toastCtrl.create({
          message: '已到最后一页',
          duration: 1500
        });
        toast.present();
        return;
      }
    } else {
      if (this.index > 0) {
        this.index--;
      } else {
        let toast = this.toastCtrl.create({
          message: '已到开始一页',
          duration: 1500
        });
        toast.present();
        return;
      }
    }
    this.getstoryino();
  }

  showLabel() {
    this.lblDisplay = !this.lblDisplay;
  }

  showHistory() {
    this.navCtrl.push(HistoryPage, {
      history: this.history
    });
  }

}


