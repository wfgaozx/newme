import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, Config } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { CardsPage } from '../pages/cards/cards';
import { ContentPage } from '../pages/content/content';
import { FirstRunPage } from '../pages/pages';
import { ListMasterPage } from '../pages/list-master/list-master';
import { LoginPage } from '../pages/login/login';
import { MapPage } from '../pages/map/map';
import { MenuPage } from '../pages/menu/menu';
import { SearchPage } from '../pages/search/search';
import { SettingsPage } from '../pages/settings/settings';
import { SignupPage } from '../pages/signup/signup';
import { TabsPage } from '../pages/tabs/tabs';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { WelcomePage } from '../pages/welcome/welcome';
import { AppConfig, WorkLib } from './app.config';

import { Settings } from '../providers/providers';
import { StorageService } from '../providers/storage-service';

import { TranslateService } from '@ngx-translate/core'

@Component({
  template: `<ion-menu [content]="content">
    <ion-header>
      <ion-toolbar>
        <ion-title>Pages</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <button menuClose ion-item *ngFor="let p of pages" (click)="openPage(p)">
          {{p.title}}
        </button>
      </ion-list>
    </ion-content>

  </ion-menu>
  <ion-nav #content [root]="rootPage"></ion-nav>`
})
export class MyApp {
  //  rootPage = FirstRunPage;
  rootPage = TabsPage;

  @ViewChild(Nav) nav: Nav;

  pages: any[] = [
    { title: 'Tutorial', component: TutorialPage },
    { title: 'Welcome', component: WelcomePage },
    { title: 'Tabs', component: TabsPage },
    { title: 'Cards', component: CardsPage },
    { title: 'Content', component: ContentPage },
    { title: 'Login', component: LoginPage },
    { title: 'Signup', component: SignupPage },
    { title: 'Map', component: MapPage },
    { title: 'Master Detail', component: ListMasterPage },
    { title: 'Menu', component: MenuPage },
    { title: 'Settings', component: SettingsPage },
    { title: 'Search', component: SearchPage }
  ]

  constructor(private translate: TranslateService, private platform: Platform,
    settings: Settings, private config: Config, private statusBar: StatusBar,
    private storageService: StorageService, private splashScreen: SplashScreen) {
    this.initTranslate();
    this.loadconfig();
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  initTranslate() {
    // Set the default language for translation strings, and the current language.

    //    this.translate.setDefaultLang('en');
    this.translate.setDefaultLang('zh');

    /*
        let lan = this.translate.getBrowserLang();
        if (this.translate.getBrowserLang() !== undefined) {
          this.translate.use(this.translate.getBrowserLang());
        } else {
          this.translate.use('zh'); // Set your language here
        }
    */

    this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });


  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  loadconfig() {
    if (AppConfig.isnew) {
      AppConfig.secondurl = '/MobileApi/v1/'
    } else {
      AppConfig.secondurl = '/hwphone/HandlerMobileV2.ashx'
    }

    if (this.storageService.read('name')) {
      AppConfig.username = this.storageService.read('name');
    }
    else {
      AppConfig.username = 'songyk';
    }

    if (this.storageService.read('userid')) {
      AppConfig.userid = this.storageService.read('userid');
    }
    else {
      AppConfig.userid = '';
    }

    if (this.storageService.read('realname')) {
      AppConfig.realname = this.storageService.read('realname');
    }
    else {
      AppConfig.realname = '';
    }

    if (this.storageService.read('mainurl')) {
      AppConfig.mainurl = this.storageService.read('mainurl');
    }
    else {
      AppConfig.mainurl = '192.168.60.186';
    }

    if (this.storageService.read('xhtypes')) {
      AppConfig.xhtypes = this.storageService.read('xhtypes');
    }
    else {
      AppConfig.xhtypes = [];
    }

    if (this.storageService.read('sources')) {
      AppConfig.sources = this.storageService.read('sources');
    }
    else {
      AppConfig.sources = [];
    }

    if (this.storageService.read('user')) {
      AppConfig.user = this.storageService.read('user');
    }
    else {
      AppConfig.user = null;
    }

    if (this.storageService.read('server')) {
      AppConfig.server = this.storageService.read('server');
    }
    else {
      AppConfig.server = null;
    }

    if (this.storageService.read('sendto')) {
      AppConfig.sendto = this.storageService.read('sendto');
    }
    else {
      AppConfig.sendto = null;
    }

    if (this.storageService.read('choiceto')) {
      AppConfig.choiceto = this.storageService.read('choiceto');
    }
    else {
      AppConfig.choiceto = null;
    }

    if (this.storageService.read('gbcatagorys')) {
      AppConfig.gbcatagorys = this.storageService.read('gbcatagorys');
    }
    else {
      AppConfig.gbcatagorys = [];
    }

    if (this.storageService.read('loccatagorys')) {
      AppConfig.loccatagorys = this.storageService.read('loccatagorys');
    }
    else {
      AppConfig.loccatagorys = [];
    }

    if (this.storageService.read('medias')) {
      AppConfig.medias = this.storageService.read('medias');
    }

    if (this.storageService.read('workpage')) {
      AppConfig.workPage = this.storageService.read('workpage');
    }
    else {
      AppConfig.workPage = new WorkLib();
      AppConfig.workPage.select = true;
    }

    if (this.storageService.read('workdept')) {
      AppConfig.workDept = this.storageService.read('workdept');
    }
    else {
      AppConfig.workDept = new WorkLib();
      AppConfig.workDept.select = true;
    }

    if (this.storageService.read('workperson')) {
      AppConfig.workPerson = this.storageService.read('workperson');
    }
    else {
      AppConfig.workPerson = new WorkLib();
      AppConfig.workPerson.select = true;
    }

    if (this.storageService.read('workcolumn')) {
      AppConfig.workColumn = this.storageService.read('workcolumn');
    }
    else {
      AppConfig.workColumn = new WorkLib();
      AppConfig.workColumn.select = true;
    }

    if (this.storageService.read('workpublic')) {
      AppConfig.workPublic = this.storageService.read('workpublic');
    }
    else {
      AppConfig.workPublic = new WorkLib();
      AppConfig.workPublic.select = true;
    }
  }

}
