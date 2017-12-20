import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FormControl, FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: 'page-home',
  templateUrl: 'home1.html'
})
export class HomePage1 {

  item: FormControl;

  constructor(public navCtrl: NavController, private formBuilder: FormBuilder) {

  }

  ionViewWillLoad() {
    this.item = this.formBuilder.control('');
  }

}
