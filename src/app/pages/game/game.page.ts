/* eslint-disable no-var */
/* eslint-disable eqeqeq */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {
  list_game: any;
  list_game_small: any;
  reward: any = 0;
  reward_percent = '0%';
  timer: any;
  history: any = {};
  next_top: any;
  current_reward = 0;
  constructor(public api: ApiService) {
    this.list_game = [
      {
        level: false,
        title: 'Knife',
        name: 'assets/images/square.gif',
        in: 'assets/game/galaxy/galaxyLG.png',
        active: true,
        link: 'knife',
      },
    ];

    this.list_game_small = [
      {
        level: false,
        title: 'Tower',
        name: 'assets/images/square.gif',
        in: 'assets/images/tower.png',
        active: true,
        link: 'tower',
      },
    ];
  }
  ngOnInit() {
    this.doRefresh();
  }
  doRefresh(event: any = false) {
    // get history
    this.history = {};
    // this.api
    //   .post('user?action=history&name=galaxy&next_top=1', {})
    //   .subscribe((r) => {
    //     if (r.history) {
    //       this.history = r.history;
    //     }
    //     if (r.next_top) {
    //       this.next_top = r.next_top;
    //     }
    //   });
    //get game
    this.api.get('user?action=get_config').subscribe((r) => {
      this.list_game = r.data_game.filter(
        (game) => game.title == this.api.gameName
      );
    });

    // get list_game_small
    this.api.get('user?action=get_config').subscribe((r) => {
      let list_game_r = r.data_game.filter(
        (dataArr) => dataArr.title != this.api.gameName
      );
      this.list_game_small = list_game_r.map((vl) => {
        if (vl.active) {
          switch (this.api.device.platform) {
            case 'android':
              return { ...vl, link: vl.android_id };
            case 'ios':
              return { ...vl, link: vl.ios_id };

            default:
              return { ...vl, link: 'https://www.facebook.com/luckystd' };
              break;
          }
        }
        return vl;
      });
    });

    if (event) {
      this.api.loadInters();
      event.target.complete();
    }
  }

  getAvatar(h) {
    var u = { id: h.u_id, img: h.img };
    return this.api.getAvatar(u);
  }
  getGifGame(game) {
    switch (game) {
      case 'lucky':
        return 'round.gif';
        break;

      case 'spin':
        return 'spin.gif';
        break;

      default:
        return 'square.gif';
    }
  }
  getImgGame(game) {
    switch (game) {
      case 'shoot':
        return game + '.gif';
        break;

      case 'lucky':
        return 'wheel.png';
        break;

      default:
        return game + '.png';
        break;
    }
    return false;
  }
  ionViewDidEnter() {
    this.countDown();
  }
  ionViewWillLeave() {
    clearInterval(this.timer);
  }
  countDown() {
    this.timer = setInterval(() => {
      var max = this.api.user.reward_hour * 24;
      var current_reward =
        (new Date(
          new Date().toLocaleString('en-US', { timeZone: 'Asia/Singapore' })
        ).getTime() -
          new Date(this.api.user.last_reward).getTime()) /
        1000;
      if (current_reward > 0) {
        current_reward *= this.api.user.reward_hour / 3600;
        if (current_reward > max) {
          current_reward = max;
        }
        this.reward = this.api.num2text(Math.floor(current_reward));
      } else {
        current_reward = 0;
        this.reward = 0;
      }
      this.reward_percent = ((current_reward / max) * 100 || 0) + '%';
      this.reward = this.api.num2text(current_reward);
    }, 1000);
  }
}
