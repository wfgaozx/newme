import { Component, ViewChild, ElementRef, Input } from '@angular/core';
import { FormControl } from "@angular/forms";
import { Camera, CameraOptions } from '@ionic-native/camera';

@Component({
  selector: 'rich-text',
  templateUrl: 'rich-text.html'
})
export class RichTextComponent {
  public path;
  // *profilePicture: any = "https://www.gravatar.com/avatar/";
  //给image设置默认的图片
  profilePicture: any="assets/img/live.jpg";

  constructor(private camera: Camera) {
  }

  @ViewChild('editor') editor: ElementRef;
  @ViewChild('input') myInput
  @ViewChild('decorate') decorate: ElementRef;

  @Input() formControlItem: FormControl;


  private wireupResize() {

    let element = this.editor.nativeElement as HTMLDivElement;

    let height = (window.innerHeight || document.body.clientHeight) - 250;
    let textareaHeight = Math.round((height / 100.00) * 45);
    element.style.height = `${textareaHeight}px`;

  }

  private updateItem() {
    let element = this.editor.nativeElement as HTMLDivElement;
    element.innerHTML = this.formControlItem.value;

    if (element.innerHTML === null || element.innerHTML === '') {
      element.innerHTML = '<div></div>';
    }

    let updateItem = () => {
      this.formControlItem.setValue(element.innerHTML);
    };

    element.onchange = () => updateItem();
    element.onkeyup = () => updateItem();
    element.onpaste = () => updateItem();
    element.oninput = () => updateItem();
  }

  private wireupButtons() {
    let buttons = (this.decorate.nativeElement as HTMLDivElement).getElementsByTagName('button');
    for (let i = 0; i < buttons.length; i++) {
      let button = buttons[i];

      let command = button.getAttribute('data-command');

      if (command.includes('|')) {
        let parameter = command.split('|')[1];
        command = command.split('|')[0];

        button.addEventListener('click', () => {
          document.execCommand(command, false, parameter);
        });
      } else {
        switch(command){
          case 'insertimage':
              button.addEventListener('click', () => {
              this.insertimage();
              });
              break;
          case 'getimage':
              button.addEventListener('click', () => {
              this.getimage();
              });
              break;
          default:
              button.addEventListener('click', () => {
              document.execCommand(command);
            });
        }
      }
    }

  }

  ngAfterContentInit() {
  //  var oDoc = document.getElementById("textedit");
  //  oDoc.focus(); 
    this.wireupResize();
    this.updateItem();
    this.wireupButtons();
  }

  insertimage(){
//      document.execCommand('insertImage', false, this.path);
      document.execCommand('insertHTML', false,  '<img  width=50% src="' + this.path
          + '">');
}
  getimage(){
/*
    this.choosePhoto().then((data)=>{
      document.execCommand('insertImage', false, data);
    })
*/
  this.choosePhoto();
    /*
    setTimeout(() => {
        console.log(this);

            document.execCommand('justifyCenter', false, '');
         
        },1000
    )
*/     
  }

  takePhoto() {
    var options = {
      // Some common settings are 20, 50, and 100
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      // In this app, dynamically set the picture source, Camera or photo gallery

      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum:true,
      sourceType:this.camera.PictureSourceType.CAMERA,//拍照时，此参数必须有，否则拍照之后报错，照片不能保存

      correctOrientation: true  //Corrects Android orientation quirks
    }
    
    //
    // imageData就是照片的路径，关于这个imageData还有一些细微的用法，可以参考官方的文档。
    // 
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      let base64Image =  imageData;
      this.path = base64Image;//给全局的文件路径赋值。
      this.profilePicture=base64Image;//给image设置source。
      document.execCommand('insertImage', false, this.path);
      //alert(this.path);

    //  this.zone.run(() => this.image = base64Image);
    }, (err) => {
      // Handle error，出错后，在此打印出错的信息。
      alert( err.toString());
    });
  }

/* 
  choosePhoto():Promise<any>{
   var p = new Promise(function(resolve, reject){
      var options = {
      // Some common settings are 20, 50, and 100
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      // In this app, dynamically set the picture source, Camera or photo gallery
      sourceType:0,//0对应的值为PHOTOLIBRARY ，即打开相册
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: true,
      correctOrientation: true  //Corrects Android orientation quirks
      }
      this.camera.getPicture(options).then((imageData) => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64:
        let base64Image =  imageData;
        this.path = base64Image;
        this.profilePicture=base64Image;
        resolve(imageData);
      }, (err) => {
      // Handle error
       reject(err);
      });

    });
  return p;
  }
*/
  choosePhoto() {
      var options = {
      // Some common settings are 20, 50, and 100
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      // In this app, dynamically set the picture source, Camera or photo gallery
      sourceType:0,//0对应的值为PHOTOLIBRARY ，即打开相册
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: true,
      correctOrientation: true  //Corrects Android orientation quirks
    }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      let base64Image =  imageData;
      this.path = base64Image;
      this.profilePicture=base64Image;

      var oDoc = document.getElementById("textedit");
      oDoc.focus(); 
      document.execCommand('insertHTML', false,  '<img  width=50% src="' + this.path
          + '">');

  }, (err) => {
      // Handle error
    });

  }

}
