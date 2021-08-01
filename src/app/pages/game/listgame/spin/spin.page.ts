import { Component, OnInit } from '@angular/core';
import { ApiService } from './../../../../api.service';

@Component({
  selector: 'app-spin',
  templateUrl: './spin.page.html',
  styleUrls: ['./spin.page.scss'],
})
export class SpinPage implements OnInit {
  slots = [
    { a: null, v: 0 },
    { a: null, v: 1 },
    { a: null, v: 2 },
  ];
  list_s = [0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2];
  playing = false;

  data: any = {};
  history: any = false;
  btn: any = {};
  amount: any;
  current_amount = 0;
  payout: any;
  auto_play = false;
  limit_paging = 10;

  tab_active: any = 'manually';
  min = 1;
  change_auto = {
    win: { amount: this.min, step: 0, color: 'success' },
    lose: { amount: this.min, step: 0, color: 'danger' },
  };

  constructor(public api: ApiService) {}

  ngOnInit() {
    this.api.post('user?action=history&name=spin', {}).subscribe((r) => {
      this.history = r.history;
      if (r.limit_paging) {
        this.limit_paging = r.limit_paging;
      }
    });
    this.setAmount(1);
  }
  segmentChanged(e) {
    this.tab_active = e.detail.value;
  }
  waiting(res) {
    this.playing = false;

    if (res.data_history) {
      this.history.unshift(res.data_history);
      if (this.history.length > this.limit_paging) {
        this.history.pop();
      }
    }
    if (res.user && res.user.balance < this.current_amount) {
      this.current_amount = res.user.balance;
      this.amount = this.current_amount;
    }

    if (res.e_code) {
      this.auto_play = false;
    }
  }
  loop_play(amount) {
    var old_balance = this.api.user.balance;
    this.api.sound.play('tick');
    this.playing = true;
    this.slots.forEach((s, i) => {
      if (s.a) {
        s.a.destroy();
      }
    });

    this.current_amount = amount;
    this.api
      .post('user?action=spin', {
        amount: this.current_amount,
        auto_play: this.auto_play,
      })
      .subscribe(
        (res) => {
          // this.api.sound.play();
          if (this.auto_play) {
            this.waiting(res);

            this.slots.forEach((s, i) => {
              this.api.animationCtrl
                .create()
                .addElement(document.querySelector('#slot' + i))
                .duration(300)
                .to(
                  'transform',
                  'rotateX(-' + (res.win[i].angle + 360) + 'deg)'
                )
                .play();
            });

            setTimeout(() => {
              if (this.auto_play) {
                let action: any;
                if (res.value > 0) {
                  action = this.change_auto.win;
                } else {
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
            if (res.win) {
              this.playing = false;
              setTimeout(() => {
                this.btn.disabled = false;
                this.btn.color = res.value > 0 ? '#4caf50' : '#f44336';
                this.api.checkBalance(res);
                this.waiting(res);
              }, 3500);

              this.slots.forEach((s, i) => {
                this.api.animationCtrl
                  .create()
                  .addElement(document.querySelector('#slot' + i))
                  .duration(1000 + i * 1000)
                  .keyframes([
                    { offset: 0, transform: 'rotateX(0deg)' },
                    {
                      offset: 1,
                      transform:
                        'rotateX(-' + (res.win[i].angle + 360) + 'deg)',
                    },
                  ])
                  .onFinish((d, a) => {
                    this.api.sound.play('drop');
                    s.a = a;
                  })
                  .play();
              });
            } else {
              this.btn.disabled = false;
              this.playing = false;
            }
          }
        },
        (error) => {
          this.auto_play = false;
          this.btn.disabled = false;
          this.playing = false;
        }
      );
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
  ionViewWillLeave() {
    this.auto_play = false;
  }
  setAmount(x) {
    switch (x) {
      case 'min':
        x = 1;
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
    if (x < 1) x = 1;

    this.amount = x;
  }
  setAutoAmount() {
    if (!this.auto_play) {
      this.change_auto.win.amount = this.amount;
      this.change_auto.lose.amount = this.amount;
    }
  }
}
