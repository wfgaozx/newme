import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the StorageService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class StorageService {

  constructor(public http: Http) {
    console.log('Hello StorageService Provider');
  }

  write(key:string, value:any) {
    if (value) {
      value = JSON.stringify(value);//将value对象转换成字符串
    }
    localStorage.setItem(key, value);
  }

  read(key:string) {
    let value = localStorage.getItem(key);
    if (value && value != "undefined" && value != "null") {
      return JSON.parse(value);//如果有值则返回value对象
    }
    return null;//没有值则返回空
  }
}
