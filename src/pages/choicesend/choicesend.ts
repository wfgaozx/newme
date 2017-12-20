import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController, ToastController } from 'ionic-angular';
import { StorageService } from '../../providers/storage-service';
import { TreeModule } from 'angular-tree-component';
import { ITreeState } from 'angular-tree-component'

import { AppConfig, Node } from './../../app/app.config';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { ChangeDetectorRef } from '@angular/core';
import * as xml2js from 'xml2js';
import 'rxjs/Rx';
import { MySlide } from '../../components/my-slide/my-slide';
import { FormGroup, FormControl } from '@angular/forms';

/**
 * Generated class for the ChoicesendPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-choicesend',
  templateUrl: 'choicesend.html',
})
export class ChoicesendPage {
  libtype;      // wait;work
  worklib = false; //是否worklib, true:work false: wait
  formColumn;                //column的Form
  groupColumn;              //column的radio group
  callback;      //回调函数
  story;        //选用的稿件
  deptstate: ITreeState;      //Dept Tree state
  personstate: ITreeState;     //Person Tree state
  pageState: ITreeState;     //Page Tree state
  pageSlides: string[] = ["个人库", "本部门库", "其它人员", "其它部门", "版面", "栏目"];
  types: string[] = ['Employ', 'Dept', 'Employ', 'Dept', 'Page', 'Column'];
  curtype;       //当前库类型
  curtypeid;      //当前库id
  curtypename;    //当前库名字
  selectedIndex;  //当前库索引

  curmedia;           //当前媒体
  curmediaguid;       //当前媒体guid
  curmediacode;       //当前媒体code
  relavantmedia = [];
  curColumn;        //当前栏目
  curColumnId;   //当前栏目索引
  columns;          //所有栏目数组
  myid = 0;         //tree id 计数

  deptlib: boolean;        //当前是部门库
  persionlib: boolean;     //当前是人员库
  pageLib: boolean;       //当前是版面库
  columnLib: boolean;       //当前是栏目库
  nodes: Array<Node>;     //部门树
  p_nodes: Array<Node>;   //人员树
  pageNodes: Array<Node>;   //版面树
  deptarray: Array<Node>;    //部门数组
  personarray: Array<Node>;  //人员数组
  pageArray: Array<Node>;    //版面数组,序号对应节点
  nodetype: number = 1;        // 1:dept数组  2：person数组

  /*nodes = [
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
*/

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private http: Http, private storageService: StorageService,
    private toastCtrl: ToastController,
    public cd: ChangeDetectorRef) {
      this.formColumn = new FormGroup({
        'groupColumn': new FormControl()
      });
  
    this.callback = this.navParams.get('callback');
    this.story = this.navParams.get('storyinfo');
    this.libtype = this.navParams.get('source');
    if(this.libtype == 'work'){
      this.worklib = true;
    }else{
      this.worklib = false;
    }
    this.deptlib = false;
    this.persionlib = false;

    this.getmedia();
    this.curtype = AppConfig.choiceto.type;
    this.curtypename = AppConfig.choiceto.name;
    this.curtypeid = AppConfig.choiceto.id;
    this.selectedIndex = AppConfig.choiceto.index;
    this.curmedia = AppConfig.choiceto.medianame;
    this.curmediaguid = AppConfig.choiceto.mediaid;
    this.curmediacode = AppConfig.choiceto.mediacode;
    if (this.selectedIndex == 2) {
      this.persionlib = true;
    }
    if (this.selectedIndex == 3) {
      this.deptlib = true;
    }
    if (this.selectedIndex == 4) {
      this.pageLib = true;
    }
    if (this.selectedIndex == 5) {
      this.columnLib = true;
    }

    this.getsdept();
    this.getperson();
    this.getPage();
    this.getColumn();
    
    /*
        this.storageService.write('deptstate', this.deptstate);
        this.storageService.write('personstate', this.personstate);
    */
    if (this.storageService.read('deptstate')) {
      this.deptstate = this.storageService.read('deptstate');
    }
    if (this.storageService.read('personstate')) {
      this.personstate = this.storageService.read('personstate');
    }
    if (this.storageService.read('pageState')) {
      this.pageState = this.storageService.read('pageState');
    }


  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ChoicesendPage');
  }

  //得到所有报纸
  getmedia() {
    let url = 'http://' + AppConfig.mainurl + AppConfig.secondurl + 'story/sendmedia';
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let param = '{"userid":"' + AppConfig.userid + '", "username":"",' +
      '"deptname":"", "deptid":"", "mediaid":"", "mediaName":""}';

    this.http.post(url, param, options).map(res => res.json())
      .subscribe(data => {
        console.log(data);
        var success = data['isSuccess'];
        if (success) {
          var retdata = data['data'];
          for (var i = 0; i < retdata.length; i++) {
            this.relavantmedia.push({
              name: retdata[i].medianame,
              guid: retdata[i].sguid,
              code: retdata[i].mediacode
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

  getsdept() {
    let url = 'http://' + AppConfig.mainurl + AppConfig.secondurl + 'story/senddept';
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

  //选中媒体调用
  mediaselect(event, media) {
    this.curmediaguid = media.guid;
    this.curmedia = media.name;
    this.curmediacode = media.code;

    this.getsdept();
    this.getperson();
    this.getPage();
    this.getColumn();
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

  onSlideClick(index) {
    this.deptlib = false;
    this.persionlib = false;
    this.pageLib = false;
    this.columnLib = false;
    this.curtype = this.types[index];
    this.selectedIndex = index;
    if (index == 0) {
      this.curtypeid = AppConfig.user.userid;
      this.curtypename = AppConfig.user.username;
    }
    if (index == 1) {
      this.curtypeid = AppConfig.user.deptid;
      this.curtypename = AppConfig.user.deptname;
    }
    if (index == 2) {
      this.persionlib = true;
    }
    if (index == 3) {
      this.deptlib = true;
      this.deptlib = true;
    }
    if (index == 4) {
      this.pageLib = true;
    }
    if (index == 5) {
      this.columnLib = true;
    }
  }

  dochoice() {
    AppConfig.choiceto.type = this.curtype;
    AppConfig.choiceto.name = this.curtypename;
    AppConfig.choiceto.id = this.curtypeid;
    AppConfig.choiceto.index = this.selectedIndex;
    if (this.selectedIndex == 2) {
      var index = this.personstate.focusedNodeId;
      let node = this.personarray[index];
      AppConfig.choiceto.id = this.personarray[index].guid;
      AppConfig.choiceto.name = this.personarray[index].name;
    }
    if (this.selectedIndex == 3) {
      var index = this.deptstate.focusedNodeId;
      AppConfig.choiceto.id = this.deptarray[index].guid;
      AppConfig.choiceto.name = this.deptarray[index].name;
    }
    if (this.selectedIndex == 4) {
      var index = this.pageState.focusedNodeId;
      AppConfig.choiceto.id = this.pageArray[index].guid;
      AppConfig.choiceto.name = this.pageArray[index].name;
    }
    if (this.selectedIndex == 5) {
      AppConfig.choiceto.id = this.curColumnId;
      AppConfig.choiceto.name = this.curColumnId;
    }
    AppConfig.choiceto.medianame = this.curmedia;
    AppConfig.choiceto.mediaid = this.curmediaguid;
    AppConfig.choiceto.mediacode = this.curmediacode;

    this.storageService.write('choiceto', AppConfig.choiceto);
    this.storageService.write('deptstate', this.deptstate);
    this.storageService.write('personstate', this.personstate);
    this.storageService.write('pageState', this.pageState);
    this.storageService.write('choiceColumn', this.curColumn);
    this.storageService.write('choiceColumnId', this.curColumnId);
    /*
        this.callback(AppConfig.sendto).then((result)=>{
          this.navCtrl.pop();
        },(err) =>{
          console.log(err);
        }
    */
    var sendtoinfo = {
      userid: AppConfig.user.userid,
      username: AppConfig.user.username,
      targetflag: AppConfig.choiceto.type,
      targetid: AppConfig.choiceto.id,
      mediaid: AppConfig.choiceto.mediaid,
      mediacode: AppConfig.choiceto.mediacode,
      medianame: AppConfig.choiceto.medianame,
      comment: '',
      source: ''
    };
    var story = {
      sguid: this.story.sguid,
      storyid: this.story.storyid,
      maintitle: this.story.maintitle,
      subtitle: this.story.subtitle,
      wordcount: this.story.wordcount,
      storytype: this.story.storytype,
      typename: this.story.typename,
      status: this.story.status,
      processtime: this.story.processtime,
//      fetchinfo: this.story.fetchinfo
    };
    var choice = {
      sendtoinfo: sendtoinfo,
      storys: [story]
    };
    var url;
    if(this.worklib){
      url = 'http://' + AppConfig.mainurl + AppConfig.secondurl + 'process_story/workstorys_send';
    }else{
      url = 'http://' + AppConfig.mainurl + AppConfig.secondurl + 'process_story/orgstorys_Send';
    }
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    var param = JSON.stringify(choice);

    this.http.post(url, param, options).map(res => res.json())
      .subscribe(data => {
        console.log(data);

        var success = data['isSuccess'];
        if (success) {
          this.callback();        //重新显示
          let toast = this.toastCtrl.create({
            message: '选送成功',
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

  getPage() {
    let url = 'http://' + AppConfig.mainurl + AppConfig.secondurl + 'story/sendpage';
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

  columnSelect(event, column, i){
    this.curColumn = column.name;
    this.curColumnId = column.sguid;
  }
}
