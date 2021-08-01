import { Component, OnInit } from '@angular/core';
// import * as HighCharts from 'highcharts';

// import { init, extension } from 'klinecharts'
 import { ApiService } from './../../../../api.service';
declare const TradingView: any;

@Component({
  selector: 'app-trade',
  templateUrl: './trade.page.html',
  styleUrls: ['./trade.page.scss'],
})
export class TradePage implements OnInit {
  theWheel: any;
  loading: any = false;
  history: any = false;
  btn: any = { disabled: true };
  amount: any;
  current_amount = 0;
  payout: any;
  auto_play = false;
  limit_paging = 10;

  min = 10;
  win: any;
  chart: any;
  constructor(public api: ApiService) {}

  ngOnInit() {
    this.api.post('user?action=history&name=trade', {}).subscribe((r) => {
      this.history = r.history;
    });
    this.amount = this.min;
    // this.api.post('user?action=history&name=trade', {}).subscribe(r=>{
    //     this.history = r.history;
    //     if(r.limit_paging){
    //       this.limit_paging = r.limit_paging;
    //     }
    // });
    // this.c = init('chart');
    // this.c.setTechnicalIndicatorType('BOLL');
  }
  setAmount(amount) {}
  play(type = 'up') {
    if (
      this.api.user.balance < this.min ||
      this.amount < this.min ||
      this.amount > this.api.user.balance
    ) {
      this.api.alertCode('amount_invalid');
    } else {
      this.api.post('user?action=trade', { type: type, amount: this.amount });
    }
  }
}
