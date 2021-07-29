/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable quote-props */
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-market',
  templateUrl: './market.page.html',
  styleUrls: ['./market.page.scss'],
})
export class MarketPage implements OnInit {
  page_active: string = 'all';
  pages = [
    { title: 'all', icon: 'fa fa-globe' },
    { title: 'your', icon: 'fa fa-user' },
  ];
  amount: any;
  price: any;
  config = {
    min_amount: 100000,
    max_amount: 1000000,
    min_price: 1000,
    max_price: 10000,
  };
  m: any;
  data: any = false;
  constructor(public api: ApiService) {}
  doRefresh(event: any = false) {
    this.data = false;
    this.sub_post('user?action=market', {}, event);
  }
  ngOnInit() {
    this.amount = this.config.max_amount / 2;
    this.price = this.config.max_price / 2;

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
  // getProducts(data:any = {}){
  //   this.api.post('user?action=market', data).subscribe(r=>{
  //     this.sub_post(r);
  //   })
  // }

  pageChanged(e) {
    this.page_active = e.detail.value;
  }
  buy(p) {
    if (p.price > this.api.user.balance) {
      this.api.alertCode('diamond_is_not_enough');
    } else {
      let mess =
        this.m.sell +
        ' ' +
        this.api.num2text(p.price) +
        ' ' +
        this.m.diamond +
        ' ' +
        this.m.to_take +
        ' ' +
        this.api.num2text(p.amount) +
        ' ' +
        this.m.total_bet;
      this.api.presentAlertConfirm(this.m.confirm, mess, () => {
        this.api.presentLoading();
        this.sub_post('user?action=market&do=buy', p);
      });
    }
  }
  sell() {
    if (this.api.user.total_play < this.amount) {
      this.api.alertCode('not_enough_total_bet');
    } else {
      let mess =
        this.m.sell +
        ' ' +
        this.api.num2text(this.amount) +
        ' ' +
        this.m.total_bet +
        ' ' +
        this.m.to_take +
        ' ' +
        this.api.num2text(this.price) +
        ' ' +
        this.m.diamond;
      this.api.presentAlertConfirm(this.m.confirm, mess, () => {
        this.api.presentLoading();
        this.sub_post('user?action=market&do=sell', {
          price: this.price,
          amount: this.amount,
        });
      });
    }
  }
  cancel(p) {
    this.api.presentAlertConfirm(
      this.m.confirm,
      this.m.cancel_order +
        ' ' +
        this.m.sell +
        ' ' +
        this.api.num2text(p.amount) +
        ' ' +
        this.m.total_bet,
      () => {
        this.api.presentLoading();
        this.sub_post('user?action=market&do=cancel', p);
      }
    );
  }
  sub_post(url, data: any = {}, event: any = false) {
    this.api.post(url, data).subscribe((r) => {
      if (r.product) {
        this.page_active = 'your';
      }
      this.data = r;
    });
    if (event) {
      event.target.complete();
    }
  }
}
