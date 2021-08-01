import { Component, OnInit } from '@angular/core';

// import { ModalController, IonRouterOutlet } from '@ionic/angular';
// import { ActivatedRoute, Router } from '@angular/router';
// import { TopPage } from '../top/top.page';
// import { ShopPage } from '../shop/shop.page';
// import { SettingPage } from '../setting/setting.page';
// import { NavController } from 'ionic-angular';
import { ApiService } from './../../../../api.service';

declare var TimelineMax: any;
declare var Winwheel: any;
@Component({
  selector: 'app-wheel',
  templateUrl: './wheel.page.html',
  styleUrls: ['./wheel.page.scss'],
})
export class WheelPage implements OnInit {
  // user: any = {};
  theWheel: any;
  playing: any = false;
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
  segments = [
    { fillStyle: '#139349', text: 'x2' },
    { fillStyle: '#f7344f', text: 'Lose' },
    { fillStyle: '#139349', text: 'x2' },
    { fillStyle: '#f7344f', text: 'Lose' },
    { fillStyle: '#139349', text: 'x2' },
    { fillStyle: '#f7344f', text: 'Lose' },
    { fillStyle: '#139349', text: 'x2' },
    { fillStyle: '#8e49c4', text: 'x0' },
    { fillStyle: '#f7344f', text: 'Lose' },
    { fillStyle: '#139349', text: 'x2' },
    { fillStyle: '#f7344f', text: 'Lose' },
    { fillStyle: '#139349', text: 'x2' },
    { fillStyle: '#f7344f', text: 'Lose' },
    { fillStyle: '#139349', text: 'x2' },
    { fillStyle: '#f7344f', text: 'Lose' },
  ];
  anm: any;
  constructor(public api: ApiService) {}
  winwheelPercentToDegrees(a) {
    var c = 0;
    0 < a && 100 >= a && (c = (a / 100) * 360);
    return c;
  }

  ngOnInit() {
    this.api.post('user?action=history&name=lucky', {}).subscribe((r) => {
      this.history = r.history;
      if (r.limit_paging) {
        this.limit_paging = r.limit_paging;
      }
    });
    this.drawGame();
    this.setAmount(1);
  }
  segmentChanged(e) {
    this.tab_active = e.detail.value;
  }
  drawGame() {
    // f4a300 vang
    // 139349 xanh
    // 00b3b7  tim
    // 8e49c4 xanh nhat
    // f7344f do

    this.theWheel = new Winwheel({
      numSegments: this.segments.length,
      textFillStyle: '#fff',
      textFontSize: 30,
      segments: this.segments,
      strokeStyle: '#36313d',
      lineWidth: 10,
      innerRadius: 90,
      outerRadius: 235,
      animation: {
        // 'type'     : 'spinToStop',
        duration: 1,
        callbackFinished: () => {
          this.theWheel.rotationAngle = 0;
          this.theWheel.draw();
        },
        // 'spins'    : 2,
      },
    });
  }
  waiting(res) {
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
    this.btn.color = res.value > 0 ? '#4caf50' : '#f44336';
  }

  loop_play(amount) {
    this.theWheel.startAnimation();
    this.api.sound.play('tick');
    this.current_amount = amount;
    this.api
      .post('user?action=lucky2', {
        amount: amount,
        auto_play: this.auto_play,
      })
      .subscribe(
        (res) => {
          if (this.auto_play) {
            this.waiting(res);
            this.theWheel.stopAnimation();
            this.api.animationCtrl
              .create()
              .addElement(document.querySelector('#canvas'))
              .to('transform', 'rotate(' + (res.data_win.rand + 360) + 'deg)')
              .play();

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
            this.theWheel.stopAnimation();
            if (res.data_win) {
              setTimeout(() => {
                this.api.checkBalance(res);
                this.waiting(res);
                this.btn.disabled = false;
              }, 3500);

              this.api.animationCtrl
                .create()
                .addElement(document.querySelector('#canvas'))
                .duration(3000)
                .easing('ease-out')
                .fromTo(
                  'transform',
                  'rotate(0deg)',
                  'rotate(' + (res.data_win.rand + 360) + 'deg)'
                )
                .play();
            } else {
              this.btn.disabled = false;
            }
          }
        },
        (error) => {
          this.auto_play = false;
          this.btn.disabled = false;
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
