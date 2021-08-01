import { Component, OnInit } from '@angular/core';
import Phaser from 'phaser';
import { ApiService } from './../../../../api.service';
import { MainScene } from './../../../../../assets/game/shoot/src/scenes/main';

@Component({
  selector: 'app-shoot',
  templateUrl: './shoot.page.html',
  styleUrls: ['./shoot.page.scss'],
})
export class ShootPage implements OnInit {
  game: any;
  config: any;
  value: any = {
    ship: 5,
  };
  show = 0;
  constructor(public api: ApiService) {
    this.config = {
      width: this.api.screen_size.w,
      height: this.api.screen_size.h,
      type: Phaser.AUTO,
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      physics: {
        default: 'arcade',
      },
      parent: 'game',
      transparent: true,
      scene: MainScene,
    };
  }

  ngOnInit() {}
  setValue(type, v) {
    this.value[type] = v;
    this.game.registry.set('set_power', this.value);
  }

  ionViewDidEnter() {
    this.api.sound.volume(0.1);

    this.game = new Phaser.Game(this.config);
    if (this.game) {
      this.game.registry.set('api', this.api);
      this.game.registry.set('set_power', this.value);

      setTimeout(() => {
        this.show = 1;
      }, 1000);
    }
    // this.game.scene.resume('MainScene');
  }

  ionViewWillLeave() {
    this.show = 0;
    //gui du lieu truoc khi thoat
    this.api.sound.volume(1);
    // this.game.scene.pause('MainScene');
    this.game.destroy(true);
  }
}
