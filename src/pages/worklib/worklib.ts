import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageService } from '../../providers/storage-service';
import { AppConfig, Node } from './../../app/app.config';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { ViewController, ToastController } from 'ionic-angular';
import * as xml2js from 'xml2js';
import 'rxjs/Rx';
import { ChangeDetectorRef } from '@angular/core';
import { StorydetailPage } from '../storydetail/storydetail';
import { ITreeState } from 'angular-tree-component';
import { TreeModule } from 'angular-tree-component';
import { FormGroup, FormControl } from '@angular/forms';
import { ChoicesendPage } from '../choicesend/choicesend';
import { SignPage } from '../sign/sign';

//StorydetailPage
/**
 * Generated class for the WorklibPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-worklib',
  templateUrl: 'worklib.html',
})
export class WorklibPage {
  status = '';           //已用:true 未用:false 全部 ‘’
  paging_storyid;             //分页开始id
  disStory = true;             //是否显示稿件列表
  disSelect = false;           //是否显示选择|保存按钮
  strAction;             //动作 选择|保存
  strSelect;            //选择字串，显示当前选择
  type;                 //本库类型，新华库或待编库
  pageSlides: string[] = ["我的稿库", "本部门库", "媒体库", "版面库", "其它部门库", "其它人员", "栏目库"];
  libtypes = ['Employ', 'Dept', 'Public', 'Page', 'Dept', 'Employ', 'Column'];
  curtype = this.libtypes[0];
  curtypeguid = '6e91ad8fbdd94352939788aff70bb9b8';
  period = '五年';
  column = '全部';
  order = '按栏目';
  stories = [];         //稿件列表
  depstories = [];

  curpage: number = 1;          //当前页
  strstart = '2012/1/1';      //开始时间串
  strend = '';                  //结束时间串

  deptlib: boolean;        //当前是部门库
  personlib: boolean;     //当前是人员库
  pageLib: boolean;       //当前是版面库
  columnLib: boolean;       //当前是栏目库
  publicLib: boolean;       //当前是媒体库

  nodes: Array<Node>;     //部门树
  p_nodes: Array<Node>;   //人员树
  pageNodes: Array<Node>;   //版面树
  deptarray: Array<Node>;    //部门数组,序号对应节点
  personarray: Array<Node>;  //人员数组,序号对应节点
  pageArray: Array<Node>;    //版面数组,序号对应节点
  nodetype: number = 1;        // 1:dept数组  2：person数组，构建树时使用
  formColumn;                //column的Form
  groupColumn;              //column的radio group
  formPublic;                //Public的Form
  groupPublic;              //Public的radio group
  deptstate: ITreeState;      //Dept Tree state
  personstate: ITreeState;     //Person Tree state
  pageState: ITreeState;     //Page Tree state
  myid = 0;         //tree id 计数
  medias;               //所有媒体
  curmedia;           //当前媒体
  curmediaguid;       //当前媒体guid
  curmediacode;       //当前媒体code
  publics;           //可游览的媒体
  curpublic;           //当前媒体库
  curpublicguid;       //当前媒体库guid
  curpubliccode;       //当前媒体库code
  curColumn;          //当前栏目
  curColumnId;        //当前栏目索引
  columns;            //所有栏目数组
  employSelect = true;       //人员选择
  deptSelect = true;         //部门选择
  publicSelect = true;       //媒体选择
  pageSelect = true;         //版面选择
  columnSelect = true;       //栏目选择

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private storageService: StorageService, private http: Http,
    private toastCtrl: ToastController,
    public cd: ChangeDetectorRef) {
    this.formColumn = new FormGroup({
      'groupColumn': new FormControl()
    });
    this.formPublic = new FormGroup({
      'groupPublic': new FormControl()
    });

    this.pageSelect = AppConfig.workPage.select;
    this.employSelect = AppConfig.workPerson.select;
    this.deptSelect = AppConfig.workDept.select;
    this.publicSelect = AppConfig.workPublic.select
    this.columnSelect = AppConfig.workColumn.select;

    this.medias = AppConfig.medias;
    this.curmedia = this.medias[0].medianame
    this.curmediaguid = this.medias[0].sguid
    this.curmediacode = this.medias[0].mediacode;

    this.getmedia();
    this.getdept();
    this.getperson();
    this.getPage();
    this.getColumn();


    this.deptlib = false;
    this.personlib = false;
    this.pageLib = false;
    this.columnLib = false;
    this.publicLib = false;

    this.loadmylib();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WorklibPage');
  }

  disLib() {
    this.strSelect = '当前:'
    switch (this.curtype) {
      case 'Employ':
        if (AppConfig.workPerson.id == AppConfig.user.userid) {
          this.strSelect += '我的稿库';
        }
        else {
          this.strSelect += '人员(' + AppConfig.workPerson.name + ')';
        }
        if (this.employSelect) {
          this.strAction = '保存';
        } else {
          this.strAction = '选择';
        }
        break;
      case 'Dept':
        if (AppConfig.workDept.id == AppConfig.user.deptid) {
          this.strSelect += '我的部门';
        }
        else {
          this.strSelect += '部门(' + AppConfig.workDept.name + ')';
        }
        if (this.deptSelect) {
          this.strAction = '保存';
        } else {
          this.strAction = '选择';
        }
        break;
      case 'Public':
        this.strSelect += '媒体库(' + AppConfig.workPublic.name + ')';
        if (this.publicSelect) {
          this.strAction = '保存';
        } else {
          this.strAction = '选择';
        }
        break;
      case 'Page':
        this.strSelect += '版面库(' + AppConfig.workPage.name + ')';
        if (this.pageSelect) {
          this.strAction = '保存';
        } else {
          this.strAction = '选择';
        }
        break;
      case 'Column':
        this.strSelect += '栏目库(' + AppConfig.workColumn.name + ')';
        if (this.columnSelect) {
          this.strAction = '保存';
        } else {
          this.strAction = '选择';
        }
        break;
      default: break;
    }
  }

  loadmylib() {
    this.curpage = 1;
    this.paging_storyid = '';
    this.loadmylib_main(true);
  }

  loadmylib_more() {
    this.curpage += 1;
    this.loadmylib_main(false);
  }

  loadmylib_main(reload: boolean) {
    let url = 'http://' + AppConfig.mainurl + AppConfig.secondurl + 'workstory/search_storys';
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    switch (this.curtype) {
      case 'Employ':
        break;
      case 'Dept':
        break;
      case 'Public':
        break;
      case 'Page':
        this.curtypeguid = AppConfig.workPage.id;
        break;
      case 'Column':
        break;
      default: break;
    }

    var jparam = {
      page: this.curpage,
      count: AppConfig.rowsperpage,
      startdate: this.strstart,
      enddate: this.strend,
      keyword: '',
      source: '',
      status: this.status,
      userid: AppConfig.user.userid,
      medianame: this.curmedia,
      belongflag: this.curtype,
      belongId: this.curtypeguid,
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
              sguidorg: retdata[i].sguidorg,
              storyid: retdata[i].storyid,
              maintitle: retdata[i].maintitle,
              subtitle: retdata[i].subtitle,
              wordcount: retdata[i].wordcount,
              storytype: retdata[i].storytype,
              status: retdata[i].status,
              processtime: retdata[i].processtime,
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
      index: index,
      source: 'work',
      media: this.curmedia
    });

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
    this.loadmylib();
  }

  doRefresh(refresher) {

    setTimeout(() => {
      this.loadmylib();
      refresher.complete();
    }, 1000);

  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    setTimeout(() => {
      this.loadmylib_more();
      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 500);
  }

  onSlideClick(index) {
    this.curtype = this.libtypes[index];
    if (index == 0) {
      this.curtypeguid = AppConfig.user.userid;
    }
    if (index == 1) {
      this.curtypeguid = AppConfig.user.deptid;
    }

    this.deptlib = false;
    this.personlib = false;
    this.pageLib = false;
    this.columnLib = false;
    this.publicLib = false;
    switch (index) {
      case 0:
        this.disStory = true;
        this.disSelect = false;
        break;
      case 1:
        this.disStory = true;
        this.disSelect = false;
        break;
      case 2:
        this.disLib();
        if (this.publicSelect) {
          this.disStory = false;
          this.publicLib = true;
        } else {
          this.disStory = true;
          this.publicLib = false;
        }
        this.disSelect = true;
        this.curtypeguid = AppConfig.workPublic.id;
        break;
      case 3:
        this.disLib();
        if (this.pageSelect) {
          this.disStory = false;
          this.pageLib = true;
        } else {
          this.disStory = true;
          this.pageLib = false;
        }
        this.disSelect = true;
        this.curtypeguid = AppConfig.workPage.id;
        break;
      case 4:
        this.disLib();
        //        this.disStory = false;
        //        this.deptlib = true;
        //        this.disSelect = true;
        if (this.deptSelect) {
          this.disStory = false;
          this.deptlib = true;
        } else {
          this.disStory = true;
          this.deptlib = false;
        }
        this.disSelect = true;
        this.curtypeguid = AppConfig.workDept.id;
        break;
      case 5:
        this.disLib();
        //        this.disStory = false;
        //        this.persionlib = true;
        //        this.disSelect = true;
        if (this.employSelect) {
          this.disStory = false;
          this.personlib = true;
        } else {
          this.disStory = true;
          this.personlib = false;
        }
        this.disSelect = true;
        this.curtypeguid = AppConfig.workPerson.id;
        break;
      case 6:
        this.disLib();
        //        this.disStory = false;
        //        this.columnLib = true;
        //        this.disSelect = true;
        if (this.columnSelect) {
          this.disStory = false;
          this.columnLib = true;
        } else {
          this.disStory = true;
          this.columnLib = false;
        }
        this.disSelect = true;
        this.curtypeguid = AppConfig.workColumn.id;
        break;
    }

    if (this.disStory) {
      this.loadmylib();
    }
  }

  callback = (params) => {
    return new Promise((resolve, reject) => {
      this.loadmylib();
      resolve('ok');
    })
  }

  choicesend(story) {
    this.navCtrl.push(ChoicesendPage, {
      storyinfo: story,
      source: 'work',
      callback: this.callback
    });

  }

  sign(story) {
    this.navCtrl.push(SignPage, {
      storyinfo: story,
    });
  }

  //得到可浏览的报纸
  getmedia() {
    let url = 'http://' + AppConfig.mainurl + AppConfig.secondurl + 'workstory/browse_medias';
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let jparam = {
      userid: AppConfig.userid,
    };

    this.http.post(url, JSON.stringify(jparam), options).map(res => res.json())
      .subscribe(data => {
        console.log(data);
        var success = data['isSuccess'];
        if (success) {
          this.publics = data['data'];

          this.curpublic = this.publics[0].medianame;
          this.curpublicguid = this.publics[0].sguid;
          this.curpubliccode = this.publics[0].mediacode;
          this.formPublic.patchValue({ groupPublic: this.curpublic });
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

  getdept() {
    let url = 'http://' + AppConfig.mainurl + AppConfig.secondurl + 'workstory/browse_depts';
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let param = '{"userid":"' + AppConfig.userid + '", "username":"",' +
      '"deptname":"", "deptid":"", "mediaid":"' + this.curmediaguid + '", "mediaName":"' +
      this.curmedia + '"}';

    this.http.post(url, param, options).map(res => res.json())
      .subscribe(data => {
        console.log(data);
        var success = data['isSuccess'];
        if (success) {
          var retdata = data['data'];
          this.nodes = [];
          this.myid = 0;
          this.deptarray = [];
          this.nodetype = 1;
          this.addnodes(this.nodes, retdata);
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

  getperson() {
    let url = 'http://' + AppConfig.mainurl + AppConfig.secondurl + 'story/sendemploy';
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let param = '{"userid":"' + AppConfig.userid + '", "username":"",' +
      '"deptname":"", "deptid":"", "mediaid":"' + this.curmediaguid + '", "mediaName":"' +
      this.curmedia + '"}';

    this.http.post(url, param, options).map(res => res.json())
      .subscribe(data => {
        console.log(data);
        var success = data['isSuccess'];
        if (success) {
          var retdata = data['data'];
          this.p_nodes = [];
          this.myid = 0;
          this.nodetype = 2;
          this.personarray = [];
          this.addnodes(this.p_nodes, retdata);
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

  addnodes(nodes: Array<Node>, depts: Array<any>) {
    for (var i = 0; i < depts.length; i++) {
      var medianame = depts[i].medianame;
      if (typeof (medianame) == "undefined") {
        let node = new Node();
        node.id = this.myid;
        node.name = depts[i].name;
        node.type = 'Dept';
        node.guid = depts[i].id;
        if (this.nodetype == 1) {
          this.deptarray[this.myid] = node;
        }
        if (this.nodetype == 2) {
          this.personarray[this.myid] = node;
        }
        this.myid++;
        var subdept = depts[i].subdept;
        if (typeof (subdept) != "undefined") {      //有子部门
          node.children = new Array<Node>();
          if (subdept.length != 0) {
            this.addnodes(node.children, subdept);
          }
          var employ = depts[i].employ;
          if (typeof (employ) != "undefined") {
            if (employ.length != 0) {
              this.addemploy(node.children, employ);
            }
          }
        }
        var employ = depts[i].employ;              //有人员
        if (typeof (employ) != "undefined") {
          node.children = new Array<Node>();
          if (employ.length != 0) {
            this.addemploy(node.children, employ);
          }
        }
        nodes.push(node);

      } else {
        let node = new Node();
        node.id = this.myid++;
        node.name = depts[i].medianame;
        node.type = 'Media';
        node.guid = depts[i].mediaid;
        var dept = depts[i].depts;
        if (typeof (dept) != "undefined") {
          node.children = new Array<Node>();
          this.addnodes(node.children, dept);
        }
        nodes.push(node);
      }
    }
  }

  addemploy(nodes: Array<Node>, depts: Array<any>) {
    for (var i = 0; i < depts.length; i++) {
      let node = new Node();
      node.id = this.myid;
      node.name = depts[i].name;
      node.type = 'Person';
      node.guid = depts[i].id;
      nodes.push(node);
      if (this.nodetype == 1) {
        this.deptarray[this.myid] = node;
      }
      if (this.nodetype == 2) {
        this.personarray[this.myid] = node;
      }
      this.myid++;
    }
  }

  addPageNodes(nodes: Array<Node>, folds: Array<any>) {
    for (var i = 0; i < folds.length; i++) {
      var medianame = folds[i].medianame;
      if (typeof (medianame) == "undefined") {
        let node = new Node();
        node.id = this.myid;
        node.name = folds[i].name;
        node.guid = folds[i].sguid;
        this.pageArray[this.myid] = node;
        this.myid++;
        var pages = folds[i].pages;
        if (typeof (pages) != "undefined") {      //有版面
          node.type = 'Fold';
          node.children = new Array<Node>();
          if (pages.length != 0) {
            this.addPageNodes(node.children, pages);
          }
        } else {
          node.type = 'Page';
        }
        nodes.push(node);
      } else {
        let node = new Node();
        this.pageArray[this.myid] = node;
        node.id = this.myid++;
        node.name = folds[i].medianame;
        node.type = 'Media';
        node.guid = folds[i].mediaid;
        var fold = folds[i].folds;
        if (typeof (fold) != "undefined") {
          node.children = new Array<Node>();
          this.addPageNodes(node.children, fold);
        }
        nodes.push(node);
      }
    }
  }

  getPage() {
    let url = 'http://' + AppConfig.mainurl + AppConfig.secondurl + 'workstory/browse_pages';
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let param = {
      userid: AppConfig.userid,
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
            if (this.storageService.read('sendColumn')) {
              this.curColumn = this.storageService.read('sendColumn');
              this.curColumnId = this.storageService.read('sendColumnId');
              this.formColumn.patchValue({ groupColumn: this.curColumn });
            } else {
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

  doSelect() {
    switch (this.curtype) {
      case 'Employ':
        if (this.employSelect) {    //保存
          this.employSelect = !this.employSelect;
          var index = this.personstate.focusedNodeId;
          AppConfig.workPerson.id = this.personarray[index].guid;
          AppConfig.workPerson.name = this.personarray[index].name;
          AppConfig.workPerson.select = this.employSelect;
          this.storageService.write('workperson', AppConfig.workPerson);
          this.storageService.write('workperson_state', this.pageState);
          this.disStory = true;
          this.personlib = false;
          this.curtypeguid = AppConfig.workPerson.id;
          this.loadmylib();
        } else {
          this.employSelect = !this.employSelect;
          this.disStory = false;
          this.personlib = true;
        }
        this.disLib();
        break;
      case 'Dept':
        if (this.deptSelect) {    //保存
          this.deptSelect = !this.deptSelect;
          var index = this.deptstate.focusedNodeId;
          AppConfig.workDept.id = this.deptarray[index].guid;
          AppConfig.workDept.name = this.deptarray[index].name;
          AppConfig.workDept.select = this.deptSelect;
          this.storageService.write('workdept', AppConfig.workDept);
          this.storageService.write('workdept_state', this.pageState);
          this.disStory = true;
          this.deptlib = false;
          this.curtypeguid = AppConfig.workDept.id;
          this.loadmylib();
        } else {
          this.deptSelect = !this.deptSelect;
          this.disStory = false;
          this.deptlib = true;
        }
        this.disLib();
        break;
      case 'Public':
        if (this.publicSelect) {    //保存
          this.publicSelect = !this.publicSelect;
          AppConfig.workPublic.id = this.curpublicguid
          AppConfig.workPublic.name = this.curpublic;
          AppConfig.workPublic.select = this.publicSelect;
          this.storageService.write('workpublic', AppConfig.workPublic);
          this.disStory = true;
          this.publicLib = false;
          this.curtypeguid = AppConfig.workPublic.id;
          this.loadmylib();
        } else {
          this.publicSelect = !this.publicSelect;
          this.disStory = false;
          this.publicLib = true;
        }
        this.disLib();
        break;
      case 'Page':
        if (this.pageSelect) {    //保存
          this.pageSelect = !this.pageSelect;
          var index = this.pageState.focusedNodeId;
          AppConfig.workPage.id = this.pageArray[index].guid;
          AppConfig.workPage.name = this.pageArray[index].name;
          AppConfig.workPage.select = this.pageSelect;
          this.storageService.write('workpage', AppConfig.workPage);
          this.storageService.write('workpage_state', this.pageState);
          this.disStory = true;
          this.pageLib = false;
          this.curtypeguid = AppConfig.workPage.id;
          this.loadmylib();
        } else {
          this.pageSelect = !this.pageSelect;
          this.disStory = false;
          this.pageLib = true;
        }
        this.disLib();
        break;
      case 'Column':
        if (this.columnSelect) {    //保存
          this.columnSelect = !this.columnSelect;
          AppConfig.workColumn.id = this.curColumnId
          AppConfig.workColumn.name = this.curColumn;
          AppConfig.workColumn.select = this.columnSelect;
          this.storageService.write('workcolumn', AppConfig.workPublic);
          this.disStory = true;
          this.columnLib = false;
          this.curtypeguid = AppConfig.workColumn.id;
          this.loadmylib();
        } else {
          this.columnSelect = !this.columnSelect;
          this.disStory = false;
          this.columnLib = true;
        }
        this.disLib();
        break;
      default: break;
    }

  }

  mediaselect(event, media) {
    this.curmediaguid = media.sguid;
    this.curmediacode = media.mediacode;

    this.loadmylib();
  }

  selectColumn(event, column, i) {
    this.curColumn = column.name;
    this.curColumnId = column.sguid;
  }

  selectPublic(event, media, i) {
    this.curpublic = media.medianame;
    this.curpublicguid = media.sguid;
    this.curpubliccode = media.mediacode
  }

}
