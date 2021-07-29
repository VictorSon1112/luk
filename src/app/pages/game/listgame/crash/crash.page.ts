/* eslint-disable eqeqeq */
/* eslint-disable curly */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import Phaser from 'phaser';
import { ApiService } from '../../../../api.service';
// import { Socket } from 'ngx-socket-io';

class CrashGame extends Phaser.Scene {
  api: any = {};

  bg: any;
  curve: any;
  rocket: any;
  line: any;
  tween: any;
  handles: any;
  path: any;
  graphics: any;
  particles: any;
  emitter: any;
  angle = 90;
  first_angle = 90;
  text: any;
  spacing = 50;
  max = 0;
  step_x: any;
  screen: any = {};
  constructor() {
    super('CrashGame');
  }
  preload() {
    this.api = this.registry.get('api');
    this.load.image('bg', 'assets/images/bg_shoot.jpg');
    this.load.image('rocket', 'assets/images/rocket.png');
    this.load.image('diamond', 'assets/images/diamond.png');
    // this.load.atlas('flares', 'assets/images/frame/flares.png', 'assets/images/frame/flares.json');
    // this.load.bitmapFont("font", "assets/game/tower/assets/fonts/font.png", "assets/game/tower/assets/fonts/font.fnt");

    this.screen.x = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    this.screen.y =
      this.cameras.main.worldView.y + this.cameras.main.height / 2;
  }
  create() {
    this.bg = this.add
      .tileSprite(0, 0, 0, 0, 'bg')
      .setDisplaySize(this.scale.width, 0)
      .setOrigin(0, 0);
    this.bg.scaleY = this.bg.scaleX;
    this.text = this.add
      .text(this.screen.x, this.spacing, 'x1.00', {
        color: '#f44336',
      })
      .setOrigin(0.5);
    this.text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
    this.text.setStroke('#fff', this.spacing / 5);
    var tween = this.tweens.add({
      targets: this.path,
      t: 1,
      ease: 'Sine.easeInOut',
      duration: 10000,
      // repeat: -1
    });
    this.particles = this.add.particles('diamond');

    this.emitter = this.particles.createEmitter({
      lifespan: 1500,
      speedY: { min: 100, max: 200 },
      speedX: { min: -100, max: 100 },
      gravityY: 50,
      scale: { start: 0.2, end: 0 },
      quantity: 1,
      blendMode: 'ADD',
      visible: false,
    });

    this.matter.world.setBounds();
    this.rocket = this.matter.add.image(0, 0, 'rocket').setDisplaySize(75, 150);

    this.init();

    this.registry.events.on(
      'changedata',
      (parent, key, value) => {
        if (key == 'play') {
          this.play(value);
        }
      },
      this
    );
  }
  update() {
    if (this.api.crash_game.playing) {
      this.bg.tilePositionY -= 2;

      if (this.rocket.y > 300) {
        var y = this.rocket.y - 5;
        this.rocket.setY(y);
        this.emitter.setPosition(this.rocket.x, this.rocket.y);
      }
    }
    if (this.api.crash_game.value) {
      //xoa chu x o dau
      var x = parseFloat(this.text.text.substring(1));
      if (x < this.api.crash_game.value.x) {
        if (x > 2) {
          this.step_x = Math.round(x) * 0.01;
        }
        this.text.setText('x' + (x + this.step_x).toFixed(2));
      } else {
        // this.physics.moveTo(this.rocket, this.screen.x, this.scale.height+100, 500);
        // this.rocket.body.setRestitution(0.3);
        // this.rocket.body.setFrictionAir(0);
        // this.rocket.body.setMass(0.1);

        this.text.setText('x' + this.api.crash_game.value.x.toFixed(2));
        this.api.crash_game.playing = false;
        this.emitter.setVisible(false);
      }
      if (x >= this.api.crash_game.value.x_bet) {
        this.text.setColor('#4caf50');
      } else {
        this.text.setColor('#f44336');
      }
    }
    this.emitter.setPosition(this.rocket.x, this.rocket.y);
  }
  init(value = false) {
    if (this.api.crash_game) {
      this.api.crash_game.value = value;
    }

    this.max = 0;
    this.step_x = 0.01;
    if (this.rocket) {
      this.rocket.setPosition(this.scale.width / 2, this.scale.height - 30);
      this.emitter.setPosition(this.rocket.x, this.rocket.y);
    }
  }
  play(value) {
    this.init();
    this.text.setText('x1.00');
    this.emitter.setVisible(true);
    // this.rocket.setVelocity(0, 10)
    // this.rocket.moveToY(100);
    this.api.post('user?action=crash', value).subscribe((res) => {
      if (res.x) {
        res.x_bet = value.x;
        this.api.crash_game.value = res;
        var s = setInterval(() => {
          if (!this.api.crash_game.playing) {
            this.api.checkBalance(res);
            this.api.crash_game.btn.disabled = false;
            if (res.data_history) {
              this.api.crash_game.history.unshift(res.data_history);
              if (this.api.crash_game.history.length > 10) {
                this.api.crash_game.history.pop();
              }
            }
            clearInterval(s);
          }
        }, 500);
      } else {
        this.api.crash_game.playing = false;
        this.emitter.setVisible(false);
        this.api.crash_game.btn.disabled = false;
      }
    });
  }
}

@Component({
  selector: 'app-crash',
  templateUrl: './crash.page.html',
  styleUrls: ['./crash.page.scss'],
})
export class CrashPage implements OnInit {
  game: any;
  config: any;
  show = 0;

  history: any = false;
  btn: any = {};
  amount: any;
  x = 2;
  current_amount = 0;
  payout: any;
  auto_play = false;
  tab_active: any = 'manually';
  min = 100;
  change_auto = {
    win: { amount: this.min, step: 0, color: 'success' },
    lose: { amount: this.min, step: 0, color: 'danger' },
  };
  constructor(public api: ApiService) {
    this.config = {
      type: Phaser.AUTO,
      physics: {
        default: 'matter',
      },
      width: 500,
      height: 500,
      parent: 'crash_game',
      scene: CrashGame,
    };
  }

  ngOnInit() {
    this.api.post('user?action=history&name=crash', {}).subscribe((r) => {
      this.api.crash_game.history = r.history;
    });
    this.setAmount(1);
  }
  segmentChanged(e) {
    this.tab_active = e.detail.value;
  }
  setAmount(x) {
    switch (x) {
      case 'min':
        x = this.min;
        break;
      case 'max':
        x = Math.floor(this.api.user.balance / 100) * 100;
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
  setAutoAmount() {
    if (!this.auto_play) {
      this.change_auto.win.amount = this.amount;
      this.change_auto.lose.amount = this.amount;
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
      //add 2 registry cho tung loai
      this.api.crash_game.btn.disabled = true;
      this.api.crash_game.playing = true;
      this.game.registry.set('play', { amount: this.amount, x: this.x });
    }
  }
  ionViewWillEnter() {
    this.game = new Phaser.Game(this.config);
    if (this.game) {
      this.game.registry.set('api', this.api);
      this.game.registry.set('play', {});
      setTimeout(() => {
        this.show = 1;
      }, 1000);
    }
  }

  ionViewWillLeave() {
    this.show = 0;
    this.auto_play = false;
    this.game.destroy(true);
  }
}
