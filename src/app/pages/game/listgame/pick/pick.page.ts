import { Component, OnInit } from '@angular/core';
import { ApiService } from './../../../../api.service';

@Component({
  selector: 'app-pick',
  templateUrl: './pick.page.html',
  styleUrls: ['./pick.page.scss'],
})
export class PickPage implements OnInit {
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
  total_check = 0;
  pick_btn: any = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  disabled_check = [];
  // data_post: any = [];
  max_select = 8;
  win: any;
  tab_active: any = 'manually';
  change_auto = {
    win: { amount: this.min, step: 0, color: 'success' },
    lose: { amount: this.min, step: 0, color: 'danger' },
  };
  constructor(public api: ApiService) {}

  ngOnInit() {
    this.api.post('user?action=history&name=pick', {}).subscribe((r) => {
      this.history = r.history;
      if (r.limit_paging) {
        this.limit_paging = r.limit_paging;
      }
    });
    this.setAmount(this.min);
  }
  segmentChanged(e) {
    this.tab_active = e.detail.value;
  }
  loop_play(amount) {
    this.win = false;
    if (this.checkAmount()) {
      this.api.sound.play('tick');
      this.current_amount = amount;

      setTimeout(() => {
        this.api
          .post('user?action=pick', {
            data: this.pick_btn,
            amount: amount,
          })
          .subscribe(
            (res) => {
              if (res.data_history) {
                this.history.unshift(res.data_history);
                if (this.history.length > this.limit_paging) {
                  this.history.pop();
                }
              }

              if (res.data_win) {
                if (res.data_win.win) {
                  this.btn.color = '#139349';
                } else {
                  this.btn.color = '#f7344f';
                }
                this.win = res.data_win;
              } else {
                this.ionViewWillLeave();
              }

              if (res.user && res.user.balance < amount) {
                amount = res.user.balance;
              }

              if (res.e_code) {
                this.auto_play = false;
              }

              this.amount = amount;
              // this.api.sound.play();
              if (this.auto_play) {
                setTimeout(() => {
                  if (this.auto_play) {
                    let action: any;
                    if (res.data_win.win > 1) {
                      action = this.change_auto.win;
                    } else if (res.data_win.win < 1) {
                      action = this.change_auto.lose;
                    }

                    if (action) {
                      switch (action.step) {
                        case 0:
                          amount = action.amount;
                          break;
                        case 1:
                          amount = Math.floor(amount * 2);
                          break;
                        case 2:
                          amount = Math.floor(amount / 2);
                          break;
                        case 3:
                          amount = Math.floor(amount * 3);
                          break;
                        case 4:
                          amount = Math.floor(amount / 3);
                          break;
                        case 5:
                          amount = Math.floor(amount * 4);
                          break;
                        case 6:
                          amount = Math.floor(amount / 4);
                          break;
                      }
                    }
                    this.loop_play(amount);
                  } else {
                    this.btn.disabled = false;
                  }
                }, 1000);
              } else {
                this.btn.disabled = false;
              }
            },
            (error) => {
              this.auto_play = false;
              this.btn.disabled = false;
            }
          );
      }, 500);
    }
  }
  play() {
    if (
      this.api.user.balance < this.min ||
      this.amount < this.min ||
      this.amount > this.api.user.balance
    ) {
      this.api.alertCode('amount_invalid');
    } else {
      if (this.tab_active == 'automatic' || this.auto_play) {
        //play auto
        this.auto_play = !this.auto_play;
        if (this.auto_play) {
          this.loop_play(this.amount);
        } else {
          this.btn.disabled = true;
        }
      } else {
        this.btn.color = '#585872';
        this.btn.disabled = true;
        this.loop_play(this.amount);
      }
    }
  }
  setAmount(x) {
    switch (x) {
      case 'min':
        x = this.min;
        break;
      case 'max':
        x = this.api.user.balance;
        break;
      case 'x2':
        x = Math.floor(this.amount * 2);
        break;
      case '/2':
        x = Math.floor(this.amount / 2);
        break;
    }
    if (x > this.api.user.balance) x = this.api.user.balance;
    if (x < this.min) x = this.min;

    this.amount = x;
  }
  checkAmount() {
    let rt = true;
    if (this.amount < this.min) {
      this.api.translate.get('min').subscribe((m: string) => {
        this.api.alert_m(m + ' ' + this.min, 1);
      });
      rt = false;
    } else if (!this.total_check) {
      this.api.alertCode('pick_card');
      rt = false;
    }
    if (!this.total_check) {
      rt = false;
    }
    if (!rt) {
      this.auto_play = false;
      this.btn.disabled = false;
    }
    return rt;
  }
  ionViewWillLeave() {
    this.auto_play = false;
  }
  setAutoAmount() {
    if (!this.auto_play) {
      this.change_auto.win.amount = this.amount;
      this.change_auto.lose.amount = this.amount;
    }
    // this.checkAmount();
  }

  check(i, type = -1) {
    if (type == -1) {
      let v = !this.pick_btn[i];
      this.pick_btn[i] = v;
      if (v) {
        this.total_check++;
      } else {
        this.total_check--;
      }
    } else {
      this.pick_btn = this.pick_btn.map(function (x) {
        return type;
      });
      this.total_check = type ? 9 : 0;
    }

    this.btn.disabled = this.total_check ? false : true;
  }
}
