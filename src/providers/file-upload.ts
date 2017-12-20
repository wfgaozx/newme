import { Injectable } from '@angular/core';
import { Component } from '@angular/core';
import { Http, Response } from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import 'rxjs/add/observable/throw';
import 'rxjs/observable/ForkJoinObservable';
import { Observable } from "rxjs";
import { LoadingController, Loading, ToastController } from "ionic-angular";
import { File, FileEntry } from "@ionic-native/file";
import { ForkJoinObservable } from "rxjs/observable/ForkJoinObservable";

/*
  Generated class for the FileUploadProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class FileUploadProvider {
  formData;

  constructor(public http: Http, private file: File) {
    console.log('Hello FileUploadProvider Provider');
  }

  private upload(filePaths: Array<string>): Observable<any> {
    //每个文件上传任务创建一个信号
    var observables: Array<any> = [];
    filePaths.forEach((value: string, i, array) => {
      if (!value.startsWith('file://')) {
        value = 'file://' + value;
      }

      console.log('这里应该执行了吧.........');

      var observable = new Observable((sub: any) => {
        this.file.resolveLocalFilesystemUrl(value).then(entry => {
          (<FileEntry>entry).file(file => {
            // this.readFile(<Blob>file);
            let blob: Blob = <Blob>file;
            const reader = new FileReader();
            reader.onloadend = () => {

              const imgBlob = new Blob([reader.result], { type: blob.type });
              this.formData.append('file', imgBlob, (<any>blob).name);
              console.log('已经成功一半了.................' + + imgBlob);


              sub.next(null);
              sub.complete();
            };
            reader.readAsArrayBuffer(blob);
          });
        })
          .catch(error => console.log('报错了 ----->' + JSON.stringify(error)));
      });

      observables.push(observable);
    });

    return ForkJoinObservable.create(observables);
    //    return Observable.forkJoin(observables);
  }


  uploadFile(host: string, params: Map<string, string>, filePaths: Array<string>, context: any, success: Function, fail: Function) {
    this.formData = new FormData();

    this.upload(filePaths).subscribe(data => {

      console.log('开始上传........');

      params.forEach((value, key) => {
        this.formData.append(key, value);
      });
      this.http.post(host, this.formData).toPromise().then(res => {
        success.call(context, res);
      }).catch(error => {
        fail.call(context, error);
      });
      // .catch(e => this.handleError(e))
      // .map(response => response.text())
      // // .finally(() => console.log('完成了'))
      // .subscribe(ok => console.log('上传成功了'));

    }, error => {
      console.log('文件处理失败');
    });
  }

  /*  可以这么去调用：
  
  this.fileUpload.uploadFile(this.host, this.params, images, self, res => {
    console.log('真的可以了');
  }, error => {
    console.log('好像失败了');
  });
  */
}
