/* eslint-disable id-blacklist */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable radix */
/* eslint-disable no-var */
/* eslint-disable curly */
/* eslint-disable object-shorthand */
/* eslint-disable eqeqeq */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/quotes */
import { Plugins } from '@capacitor/core';
import { Injectable } from '@angular/core';
import {
  ToastController,
  AlertController,
  LoadingController,
  Animation,
  AnimationController,
} from '@ionic/angular';
// import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subject, throwError, Observable } from 'rxjs';
import { map, retry, catchError } from 'rxjs/operators';
import { Howl } from 'howler';
import { TranslateService } from '@ngx-translate/core';
// import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { environment } from '../environments/environment';
import { ModalController } from '@ionic/angular';
import { ModalComponent } from './components/modal/modal.component';

import { FacebookLoginResponse } from '@capacitor-community/facebook-login';

const { Device, FacebookLogin, AdMob, Share } = Plugins;

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  margin_top = 50;
  isTesting = environment.production ? false : true;
  adId = '0';
  url_reward = 'user?action=reward';
  show_reward = true;
  base_url = environment.url;
  // base_url = 'https://luckystd.com/';
  base_path = this.base_url + 'api/';
  lang: any;
  prod = false;
  time_retry = 0;
  loading: any;
  sound: Howl = null;
  list_lang = { en: 'English', vn: 'Việt Nam' };
  //for game wheel, pick
  btn_amount = ['min', 'x2', '/2', 'max'];
  steps = ['x2', '/2', 'x3', '/3', 'x4', '/4'];
  tabs = ['manually', 'automatic'];
  public device: any = {};
  public user: any = {};
  config: any = {};
  balance_effect: any;
  reward_loaded = false;
  ad_id: any = {
    banner: 'ca-app-pub-3940256099942544/6300978111',
    inter: 'ca-app-pub-3940256099942544/8691691433',
    open: 'ca-app-pub-3940256099942544/3419835294',
  };
  ad_load: any = {
    banner: false,
    inter: false,
    open: false,
  };
  screen_size = {
    h: 500,
    w: 0,
  };
  crash_game = {
    btn: { disabled: false },
    playing: false,
    value: false,
    history: false,
  };
  faq: any;
  intersAd = false;
  showMyAd = false;
  gameName = '';
  constructor(
    private http: HttpClient,
    private toastController: ToastController,
    public modalController: ModalController,
    public animationCtrl: AnimationController,
    public loadingController: LoadingController,
    public alertController: AlertController,
    public translate: TranslateService // private fb: Facebook,
  ) {
    const ratio = Math.max(
      window.innerWidth / window.innerHeight,
      window.innerHeight / window.innerWidth
    );
    this.screen_size.w = this.screen_size.h / ratio;
    this.screen_size.h = this.screen_size.h - 10;

    let muted = localStorage.getItem('mute') == 'true' ? true : false;

    this.sound = new Howl({
      // audiosprite --output out/sound -f howler in/*
      src: [
        'assets/sounds/out/sound.ogg',
        'assets/sounds/out/sound.m4a',
        'assets/sounds/out/sound.mp3',
        'assets/sounds/out/sound.ac3',
      ],
      sprite: {
        drop: [0, 235.78231292517006],
        explosion: [2000, 791.9274376417231],
        gameover: [4000, 1042.1541950113378],
        invaderkilled: [7000, 306.3038548752832],
        lose: [9000, 1846.1451247165535],
        remove: [12000, 54.6712018140596],
        shoot: [14000, 370.06802721088405],
        tick: [16000, 72.01814058957012],
        win: [18000, 1071.020408163264],
      },
    });
    this.sound.mute(muted);

    window.addEventListener(
      'click',
      (e: any) => {
        let eclass =
          e.target.className + ' ' + e.target.parentElement.className;
        if (eclass.includes('button') || eclass.includes('sound_click')) {
          this.sound.play('tick');
        }
      },
      false
    );
  }
  async getDevice() {
    return await Device.getInfo();
  }

  getTime(time: any = false) {
    let t = 0;
    if (time) {
      t = new Date(time).getTime();
    } else {
      t = Date.now();
    }
    return t;
  }
  toggleLang(l) {
    this.translate.use(l);
    this.post('user?action=change_info', { data: { lang: l } }).subscribe();
  }
  async presentAlertConfirm(title = 'Confirm', mess = '', cb) {
    const alert = await this.alertController.create({
      // cssClass: 'my-custom-class',
      header: title,
      message: mess,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Yes',
          handler: cb,
        },
      ],
    });
    await alert.present();
  }
  convertModelToFormData(val, formData = new FormData(), namespace = '') {
    if (typeof val !== 'undefined' && val !== null) {
      if (val instanceof Date) {
        formData.append(namespace, val.toISOString());
      } else if (val instanceof Array) {
        for (let i = 0; i < val.length; i++) {
          this.convertModelToFormData(
            val[i],
            formData,
            namespace + '[' + i + ']'
          );
        }
      } else if (typeof val === 'object' && !(val instanceof File)) {
        for (let propertyName in val) {
          if (val.hasOwnProperty(propertyName)) {
            this.convertModelToFormData(
              val[propertyName],
              formData,
              namespace ? `${namespace}[${propertyName}]` : propertyName
            );
          }
        }
      } else if (val instanceof File) {
        formData.append(namespace, val);
      } else {
        formData.append(namespace, val.toString());
      }
    }
    return formData;
  }
  async presentLoading(mess = 'Loading', duration = 5000) {
    this.loading = await this.loadingController.create({
      // cssClass: 'my-custom-class',
      message: mess,
      duration: duration,
    });
    this.loading.present();
    this.loading.onDidDismiss().then(() => {
      this.loading = false;
    });
  }
  dismissLoading() {
    if (this.loading) {
      this.loading.dismiss();
    }
  }
  post(url, item): Observable<any> {
    let u = this.getUser();
    if (u) {
      if (!item.token) {
        item.token = u.id + ':' + u.token;
      }
    }
    if (this.device) {
      item.appVersion = this.device.appVersion;
    }
    return this.http
      .post<any>(this.base_path + url, this.convertModelToFormData(item))
      .pipe(
        // retry(this.time_retry),
        map((res: any) => {
          this.handSuccess(res);
          return res;
        }),
        catchError(this.handleError)
      );
  }
  get(url): Observable<any> {
    return this.http.get<any>(this.base_path + url).pipe(
      map((res: any) => {
        this.handSuccess(res);
        return res;
      }),
      catchError(this.handleError)
    );
  }
  // private subject = new Subject<any>();

  // publicData(data:any){
  //   this.subject.next(data);
  // }
  // getObservable(): Subject<any> {
  //   return this.subject;
  // }
  async alert_m(m, code = 0) {
    let c = 'warning';
    if (code !== 2) {
      c = code ? 'danger' : 'success';
    }
    const toast = await this.toastController.create({
      color: c,
      message: m,
      duration: 2000,
    });
    toast.present();
  }
  loop_sound_win(i) {
    this.sound.play('win');
    if (i > 1) {
      setTimeout(() => {
        this.loop_sound_win(i - 1);
      }, 120);
    }
  }
  async animate(b) {
    if (b) {
      let color = 'red';
      if (b > 0) {
        let l = Math.ceil(Math.log10(b / 100));
        if (l < 1) l = 1;
        if (l > 3) l = 3;
        this.loop_sound_win(l);
        color = '#2296f3';
      } else {
        this.sound.play('lose');
      }
      this.balance_effect = Math.abs(b).toFixed();
      return await this.animationCtrl
        .create()
        .addElement(document.querySelector('#balance_effect'))
        .duration(700)
        .fromTo('transform', 'translateY(50px)', 'translateY(0)')
        .fromTo('opacity', '1', '0')
        .beforeStyles({ color: color })
        .play();
    }
    return false;
  }

  checkBalance(res) {
    this.animate(res.user.balance - this.user.balance);
    localStorage.setItem('user', JSON.stringify(res.user));
    this.user = res.user;
    return this.user;
  }

  handSuccess(res: any) {
    if (res) {
      if (res.user && !res.balance_effect) {
        this.checkBalance(res);
      }
      if (res.m) {
        this.translate.get(res.m).subscribe((m: string) => {
          this.alert_m(m, 0);
        });
      } else {
        this.alertCode(res.e_code);
      }
    }
    this.dismissLoading();
  }
  alertCode(code) {
    if (code) {
      this.translate.get(code).subscribe((m: string) => {
        this.alert_m(m, code);
      });
    }
  }
  handleError = (error: HttpErrorResponse) => {
    this.dismissLoading();

    if (error.error instanceof ErrorEvent) {
      this.alert_m(error.error.message, 1);
    } else {
      this.alertCode('connect_server_failed');
      // console.error(
      //   `Backend returned code ${error.status}, ` +
      //   `body was: ${error.error}`);
    }
    return throwError('Something bad happened; please try again later.');
  };
  checkJson(str) {
    try {
      return JSON.parse(str) && !!str;
    } catch {
      return false;
    }
  }
  updateUser(data) {
    let user = this.getUser();
    if (user) {
      user = Object.assign(user, data);
    } else {
      user = data;
    }
    localStorage.setItem('user', JSON.stringify(user));
    // this.publicData({user: user});
  }
  getAvatar(u) {
    if (u.img) {
      return this.base_url + 'storage/app/' + u.img;
    } else if (u.id || u.u) {
      return 'assets/images/avatar/' + ((u.id || u.u) % 20) + '.png';
    }
    return 'assets/images/logo_small.png';
  }
  getUser() {
    let u_str = localStorage.getItem('user');
    var u = this.checkJson(u_str);
    if (u) {
      return JSON.parse(u_str);
      // this.user = JSON.parse(u_str);
      // return this.user;
    }
    return false;
  }
  loadConfig() {
    return this.get('user?action=get_config');
  }
  getConfig() {
    let config = localStorage.getItem('config');
    let config_data = this.checkJson(config);
    if (!config_data) {
      this.loadConfig().subscribe((res) => {
        if (res) {
          localStorage.setItem('config', JSON.stringify(res));
          this.config = res;
        }
      });
      return false;
    } else {
      this.config = JSON.parse(config);
    }
    return JSON.parse(config);
  }
  async fb_login() {
    this.presentLoading();
    const result = await FacebookLogin.login({
      permissions: ['public_profile', 'email'],
    }).catch((e) => {
      FacebookLogin.logout();
      this.alert_m(e.message, 1);
    });
    if (result && result.accessToken) {
      this.presentLoading();
      this.post('user?action=fb_login', { auth: result.accessToken }).subscribe(
        (r) => {
          if (r.e_code) {
            this.alertCode(r.e_code);
          }
        }
      );
    } else {
      this.alertCode('login_failed');
    }
  }
  toggleVolume() {
    let vol = !(localStorage.getItem('mute') == 'true');
    localStorage.setItem('mute', vol.toString());
    this.sound.mute(vol);
  }
  num2text(a) {
    if (a) {
      return parseInt(a).toLocaleString('en-US');
    }
    return a;
  }
  async openModal(name, data: any = {}) {
    let p;
    switch (name) {
      default:
        p = ModalComponent;
        break;
    }

    const modal = await this.modalController.create({
      component: p,
      backdropDismiss: true,
      showBackdrop: true,
      // animated: false,
      componentProps: { page: name, data: data, api: this },
      swipeToClose: true,
      cssClass: 'alert_modal',
    });
    return await modal.present();
  }
  toDate(date) {
    return new Date(date).toLocaleDateString();
  }
  loginDevice() {
    this.getDevice().then((r) => {
      this.device = r;
      let d_id = this.device.uuid ? this.device.uuid : Math.random();
      this.post('user?action=login', { device_id: d_id }).subscribe((res) => {
        let l = res.user && res.user.lang !== null ? res.user.lang : 'en';
        this.translate.use(l);
      });

      //test banner
      if (this.device.platform == 'android' || this.device.platform == 'ios') {
        if (environment.production) {
          if (this.device.platform == 'android') {
            this.get('user?action=get_config').subscribe((r) => {
              console.log(r);
              var idAdmob = r.data_ggAdmob_android;
              this.adId = idAdmob.adId;
              this.ad_id.open = idAdmob.open;
              this.ad_id.banner = idAdmob.banner;
              this.ad_id.inter = idAdmob.inter;
            });
          } else {
            this.get('user?action=get_config').subscribe((r) => {
              var idAdmob = r.data_ggAdmob_ios;
              this.adId = idAdmob.adId;
              this.ad_id.open = idAdmob.open;
              this.ad_id.banner = idAdmob.banner;
              this.ad_id.inter = idAdmob.inter;
            });
          }
        } else {
          //test
          this.adId = 'ca-app-pub-3940256099942544/5224354917';
        }
        AdMob.initialize();
        AdMob.showBanner({
          adId: this.ad_id.banner,
          adSize: 'SMART_BANNER',
          position: 'TOP_CENTER',
        });

        AdMob.addListener('onAdSize', (info: any) => {
          if (info && info.height) {
            this.margin_top = info.height;
          }
        });
        AdMob.addListener('onAdFailedToLoad', (e) => {
          if (e) {
            this.showMyAd = true;
            console.log(e);
            console.log(this.showMyAd);
          }
        });
        this.prepareAds();

        //admob
        AdMob.addListener('onRewardedVideoCompleted', (e) => {
          this.post(this.url_reward, { get: 1, ads: true }).subscribe((e) => {
            this.dismissLoading();
          });
        });
        AdMob.addListener('onRewardedVideoAdLoaded', (e) => {
          this.reward_loaded = true;
          this.show_reward = true;
          this.dismissLoading();
        });
        AdMob.addListener('onRewardedVideoAdClosed', (e) => {
          this.dismissLoading();
          this.prepareAds();
        });
        AdMob.addListener('onRewardedVideoAdFailedToLoad', (e) => {
          this.reward_loaded = true;
          this.show_reward = false;
          this.dismissLoading();
          // this.alertCode('no_ads');
        });
        this.prepareAds('inters');
      } else {
        this.reward_loaded = true;
        this.show_reward = false;
      }
    });
  }
  loadInters() {
    if (this.intersAd) {
      this.intersAd = false;
      AdMob.showInterstitial().then((e) => {
        this.prepareAds('inters');
      });
    }
  }
  prepareAds(type = 'reward') {
    switch (type) {
      case 'reward':
        AdMob.prepareRewardVideoAd({
          adId: this.adId,
          isTesting: this.isTesting,
        }).catch((e) => {
          this.reward_loaded = true;
          this.show_reward = false;
        });
        break;
      case 'inters':
        //open inters once time
        AdMob.prepareInterstitial({
          adId: this.ad_id.inter,
          isTesting: this.isTesting,
        }).then((a) => {
          this.intersAd = true;
        });
        AdMob.addListener('onInterstitialAdLoaded', (e) => {
          this.intersAd = true;
        });
        break;
    }
  }
  showReward() {
    if (this.user.reward) {
      this.presentLoading('Waiting', 3000);
      if (this.adId == '0' || !this.show_reward) {
        this.post(this.url_reward, { get: 1, ads: false }).subscribe((r) => {
          this.reward_loaded = false;
          this.show_reward = true;
          this.prepareAds();
        });
      } else {
        AdMob.showRewardVideoAd().catch((e) => {
          // this.post(this.url_reward, {get: 1}).subscribe();
          // this.show_reward = false;
          this.alertCode('no_ads');
        });
      }
    }
  }
  hh(string) {
    if (typeof string == 'object') {
      string = JSON.stringify(string);
    }
    string = btoa(string);
    var salt = [7, 4, 2, 1];
    var strs = string.split('');
    for (var i = 0; i < strs.length; i++) {
      strs[i] = btoa(salt[i % 4] + strs[i]);
    }
    return strs.join('.');
  }
  share() {
    this.translate.get(['share_title', 'share_text']).subscribe((m) => {
      Share.share({
        title: m.share_title,
        text: m.share_text + ': ' + this.user.id,
        url: 'https://luckystd.com/download?ref=' + this.user.id,
      });
    });
  }
}
