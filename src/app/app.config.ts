import {StorageService} from '../providers/storage-service';

export class AppConfig {

//    public static isDebug:boolean = true;
    public static isDebug:boolean = false;
    public static isnew:boolean = true;

    public static user:UserInfo;           //用户信息，登陆返回的内容
    public static server:ServerInfo;       //服务器信息

    public static username:string;         //用户名
    public static userid:string;           //用户id
    public static realname:string;         //用户真实名
    public static mainurl:string;                                           //主要url
    public static secondurl:string = '/hwphone/HandlerMobileV2.ashx';       //次要url
//    public static medianame:string;
//    public static mediaid:string;
//    public static mediacode:string;

    public static rowsperpage:number = 10;
    public static xhtypes = [];             //新华社产品
    public static sources = [];              //等编稿库来源
    public static medias= [];           //媒体数组
    public static sendto:SendTo;     //投向
    public static choiceto:ChoiceTo;     //投向
    public static gbcatagorys:Array<Catagory>;     //国标分类
    public static loccatagorys:Array<Catagory>;     //地区分类
    public static workDept:WorkLib;            //工作稿库中当前部门
    public static workPerson:WorkLib;          //工作稿库中当前人员 
    public static workPage:WorkLib;            //工作稿库中当前版面     
    public static workColumn:WorkLib;          //工作稿库中当前栏目 
    public static workPublic:WorkLib;          //工作稿库中当前媒体 
}

//用户信息
export class UserInfo {
    userid: string;
    username: string;
    deptname: string;
    deptid: string;
    mediaid: string;
    mediaName: string;
    mediaCode: string
}

//应用信息
export class ServerInfo {
    appsystem: string;
    vision: string
}

//投向信息
export class SendTo{
    type:string;
    name:string;
    id:string;
    index:number;
    medianame:string;
    mediaid:string
    mediacode:string;
}

//投向信息
export class ChoiceTo{
    type:string;
    name:string;
    id:string;
    index:number;
    medianame:string;
    mediaid:string
    mediacode:string;
}

//tree node
export class Node {
    id: number;
    name: string;
    type: string;
    guid: string;
    children: Array<Node>;
}

//新华社分类
export class Catagory{
    sort:number;
    name:string;
    id:string;
}

//媒体
export class Media{
    sguid:string;
    medianame:string;
    mediacode:string;
    sort:number;
}

//工作库
export class WorkLib{
    name:string;
    id:string;
    select:boolean;
}
