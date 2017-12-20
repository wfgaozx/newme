import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageService } from '../../providers/storage-service';
import { AppConfig, Catagory } from './../../app/app.config';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { ViewController, ToastController } from 'ionic-angular';
import * as xml2js from 'xml2js';
import 'rxjs/Rx';
import { ChangeDetectorRef } from '@angular/core';
import { StorydetailPage } from '../storydetail/storydetail';
import { ChoicesendPage } from '../choicesend/choicesend';
import { MySlide } from '../../components/my-slide/my-slide';

/**
 * Generated class for the WaitlibPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-waitlib',
  templateUrl: 'waitlib.html',
})
export class WaitlibPage {
  status = '';           //已用:true 未用:false 全部 ‘’
  type;                 //本库类型，新华库或待编库
  xhlib = false;        //新华库标记
  pageSlides: string[] = ["头条", "社会", "国内", "国际", "娱乐", "体育", "军事", "科技", "财经", "时尚"];
  public xhtypes = [];
  xhsproduct;       //新华社类型
  sources;          //所有来源数组
  cursource;        //当前来源
  gbcatagorys;      //国标分类
  curgbcatagory = '全部';   //当前国标分类
  curgbid = '';          //当前国标分类id
  loccatagorys;     //地区分类
  curloccatagory = '全部';  //当前地区分类
  curlocid = '';          //当前地区分类id
  //稿件类型
  storytypes = ['文本', '图片', '音频', '视频'];

  libname = '新华库';
  period = '五年';
  column = '全部';
  order = '按栏目';
  stories = [];                  //稿件列表
  depstories = [];
  curpage: number = 1;          //当前页
  strstart = '2012/1/1';      //开始时间串
  strend = '';                  //结束时间串
  paging_storyid;             //分页开始id

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private storageService: StorageService, private http: Http,
    private toastCtrl: ToastController,
    public cd: ChangeDetectorRef) {
    this.type = this.navParams.get('type');
    if (this.type == 'xh') {
      this.libname = '新华库';
      this.xhtypes = AppConfig.xhtypes;
      this.xhlib= true;

      this.pageSlides = [];
      this.pageSlides.push('全部')
      for (var i = 0; i < this.xhtypes.length; i++) {
        var name = this.xhtypes[i].name.substring(0, 9);
//        this.pageSlides.push(this.xhtypes[i].name);
        this.pageSlides.push(name);
}
      this.xhsproduct = '';

    }
    else {
      this.libname = '待编库';
      this.xhlib= false;
      this.pageSlides = [];
      this.sources = AppConfig.sources;
      this.cursource = this.sources[0].name;
      for (var i = 0; i < this.sources.length; i++) {
        this.pageSlides.push(this.sources[i].name);
      }

    }
    this.gbcatagorys = AppConfig.gbcatagorys;
    this.loccatagorys = AppConfig.loccatagorys;
    
    this.loadxhlib();
    //    this.loaddeplib();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WaitlibPage');
  }


  loadxhlib() {
    this.curpage = 1;
    this.paging_storyid = '';
    this.loadxhlib_main(true);
  };

  loadxhlib_more() {
    this.curpage += 1;
    this.loadxhlib_main(false);
  }

  loadxhlib_main(reload: boolean) {
    var source, xhsproduct, url;
    if (this.type == 'xh') {
      source = '新华社';
      xhsproduct = this.xhsproduct;
      url = 'http://' + AppConfig.mainurl + AppConfig.secondurl + 'search_story/xhs_storys';
    }
    else {
      source = this.cursource;
      xhsproduct = '';
      url = 'http://' + AppConfig.mainurl + AppConfig.secondurl + 'search_story/original_storys';
    }
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    var id;
    if (this.curgbid != '') {
      if (this.curlocid != '') {
        id = this.curgbid + ',' + this.curlocid;
      } else {
        id = this.curgbid;  
      }
    } else {
      if (this.curlocid != '') {
          id = this.curlocid;
      } else {
          id = '';
      }
    }
    var jparam = {
      xhsproduct: xhsproduct,
      catagoryid:id,
      page: this.curpage,
      count: AppConfig.rowsperpage,
      startdate: this.strstart,
      enddate: this.strend,
      keyword: '',
      source: source,
      status: this.status,
      userid: AppConfig.user.userid,
      sort: '',
      paging_storyid: this.paging_storyid
    }
    var sparam = JSON.stringify(jparam);

    this.http.post(url, sparam, options).map(res => res.json())
      .subscribe(data => {
        console.log(data);
        var retdata = data.data;

        var success = data['isSuccess'];
        this.paging_storyid = data['paging_storyid'];
        if (success) {
          if (reload) {
            this.stories = [];
          }
          for (var i = 0; i < retdata.length; i++) {
            this.stories.push({
              sguid: retdata[i].sguid,
              storyid: retdata[i].storyid,
              maintitle: retdata[i].maintitle,
              subtitle: retdata[i].subtitle,
              wordcount: retdata[i].wordcount,
              storytype: retdata[i].storytype,
              typename: retdata[i].typename,
              status: retdata[i].status,
//              processtime: retdata[i].processtime,
              processtime: retdata[i].processtime.substring(0, 11),
              fetchinfo: retdata[i].fetchinfo
            });
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

  storySelected(event, story, index) {
    this.navCtrl.push(StorydetailPage, {
      stories: this.stories,
      index:index,
      source: 'wait',
    });
  }

  choicesend(story, index) {

    this.navCtrl.push(ChoicesendPage, {
      storyinfo: story,
      source: 'wait',
      callback: this.callback
    });

  }

  onSlideClick(index) {
    if (this.type == 'xh') {
      if (index == 0) {
        this.xhsproduct = '';
      } else {
        this.xhsproduct = this.xhtypes[index - 1].id;
      }
    }
    else {
      this.cursource = this.sources[index].name;
    }


    this.loadxhlib();
    this.cd.detectChanges();
  }

  periodselect() {
    var year, month, day, today, isdate;
    switch (this.period) {
      case "今天":
        today = new Date().getTime();
        isdate = new Date(today - 1 * (24 * 60 * 60 * 1000));
        this.strstart = isdate.getFullYear() + "/" + (isdate.getMonth() + 1) + "/" + (isdate.getDate());;
        break;
      case "三天内":
        today = new Date().getTime();
        isdate = new Date(today - 3 * (24 * 60 * 60 * 1000));
        this.strstart = isdate.getFullYear() + "/" + (isdate.getMonth() + 1) + "/" + (isdate.getDate());;
        break;
      case "一周内":
        today = new Date().getTime();
        isdate = new Date(today - 7 * (24 * 60 * 60 * 1000));
        this.strstart = isdate.getFullYear() + "/" + (isdate.getMonth() + 1) + "/" + (isdate.getDate());;
        break;
      case "三个月":
        today = new Date().getTime();
        isdate = new Date(today - 90 * (24 * 60 * 60 * 1000));
        this.strstart = isdate.getFullYear() + "/" + (isdate.getMonth() + 1) + "/" + (isdate.getDate());;
        break;
      case "五年":
        today = new Date().getTime();
        isdate = new Date(today - 5 * 365 * (24 * 60 * 60 * 1000));
        this.strstart = isdate.getFullYear() + "/" + (isdate.getMonth() + 1) + "/" + (isdate.getDate());;
        break;
      default:
        break;
    }
    this.loadxhlib();

  }

  gbselect(event, catagory) {
    if (catagory.name == '全部') {
      this.curgbid = '';
    } else {
      this.curgbid = catagory.id;
    }
    this.loadxhlib();
  }

  locselect(event, catagory) {
    if (catagory.name == '全部') {
      this.curlocid = '';
    } else {
      this.curlocid = catagory.id;
    }
    this.loadxhlib();
  }

  statusselect() {
    this.loadxhlib();
  }

  doRefresh(refresher) {

    setTimeout(() => {
      this.loadxhlib();
      refresher.complete();
    }, 1000);

  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    setTimeout(() => {
      this.loadxhlib_more();

      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 500);
  }

  callback = (params) => {
    return new Promise((resolve, reject) => {
      this.loadxhlib();
      resolve('ok');
    })
  }
}

// "userid": "6e91ad8fbdd94352939788aff70bb9b8",
