/* eslint-disable @typescript-eslint/type-annotation-spacing */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-invest',
  templateUrl: './invest.page.html',
  styleUrls: ['./invest.page.scss'],
})
export class InvestPage implements OnInit {
  tab_active: any = 'globe';
  history: any;
  tabs: any;
  amount: 0;
  config: any;
  pack: 1;
  m: any;
  timer: any;
  data: any;
  constructor(public api: ApiService) {
    this.pack = 1;
  }
  segmentChanged(e) {
    this.tab_active = e.detail.value;
  }
  ngOnInit() {
    this.api.translate
      .get([
        'confirm',
        'sell',
        'buy',
        'to_take',
        'total_bet',
        'diamond',
        'cancel_order',
      ])
      .subscribe((m) => {
        this.m = m;
      });
    this.doRefresh();
  }
  ionViewDidEnter() {
    this.countDown();
  }
  invest() {
    if (this.amount < 0 && this.pack < 0) {
      this.api.alertCode('input_invalid');
    } else {
      this.api
        .post('user?action=invest', { amount: this.amount, pack: this.pack })
        .subscribe((r) => {
          if (r.data) {
            this.config = false;
            this.data = r.data;
            this.api.loadInters();
          }
        });
    }
  }
  countDown() {
    this.timer = setInterval(() => {
      if (this.data) {
        this.data.earning = (
          parseFloat(this.data.earning) + this.data.step
        ).toFixed(3);
      }
    }, 10);
  }
  ionViewWillLeave() {
    clearInterval(this.timer);
  }
  doRefresh(event: any = false) {
    this.config = false;
    this.data = false;
    this.api.post('user?action=invest', {}).subscribe((res) => {
      if (res.config) {
        this.config = res.config;
      } else {
        this.data = res.data;
      }
      this.tabs = res.tabs;
      this.history = res.history;
    });
    if (event) {
      this.api.loadInters();
      event.target.complete();
    }
  }
}
