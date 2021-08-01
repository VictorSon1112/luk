import { Component, OnInit } from '@angular/core';
import Phaser from 'phaser';
import { ApiService } from './../../../../api.service';

let gameOptions = {
  timeLimit: 30,
  gravity: 1,
  crateHeight: 500,
  crateRange: [-300, 300],
  crateSpeed: 800,
};
class TowerGame extends Phaser.Scene {
  movingCrate: any;
  canDrop = true;
  timer = 0;
  timerEvent = null;
  timeText: any;
  crateGroup: any;
  sky: any;
  ground: any;
  actionCamera: any;
  api: any;
  data_p: any = {};
  constructor() {
    super('TowerGame');
  }
  preload() {
    this.api = this.registry.get('api');
    this.load.image('ground', 'assets/game/tower/assets/sprites/ground4.png');
    this.load.image('sky', 'assets/images/bg_shoot.jpg');
    this.load.image('crate', 'assets/game/tower/assets/sprites/crate4.png');
    this.load.bitmapFont(
      'font',
      'assets/game/tower/assets/fonts/font.png',
      'assets/game/tower/assets/fonts/font.fnt'
    );
  }
  create() {
    this.matter.world.update30Hz();
    this.addSky();
    this.addGround();
    this.addMovingCrate();
    this.timeText = this.add.bitmapText(
      10,
      10,
      'font',
      gameOptions.timeLimit.toString(),
      50
    );

    this.crateGroup = this.add.group();
    this.matter.world.on('collisionstart', this.checkCollision, this);
    this.setCameras();
    this.input.on('pointerdown', this.dropCrate, this);
  }
  addSky() {
    this.sky = this.add.sprite(0, 0, 'sky');
    this.sky.setDisplaySize(this.api.screen_size.w, this.api.screen_size.h);
    this.sky.setOrigin(0, 0);
  }
  addGround() {
    this.ground = this.matter.add.sprite(
      this.api.screen_size.w / 2,
      this.api.screen_size.h,
      'ground'
    );
    this.ground.setBody({
      type: 'rectangle',
      width: this.ground.displayWidth,
      height: this.ground.displayHeight * 2,
    });
    this.ground.setOrigin(0.5, 1);
    this.ground.setStatic(true);
  }
  addMovingCrate() {
    this.movingCrate = this.add.sprite(
      this.api.screen_size.w / 2 - gameOptions.crateRange[0],
      this.ground.getBounds().top - gameOptions.crateHeight,
      'crate'
    );
    this.tweens.add({
      targets: this.movingCrate,
      x: this.api.screen_size.w / 2 - gameOptions.crateRange[1],
      duration: gameOptions.crateSpeed,
      yoyo: true,
      repeat: -1,
    });
  }
  checkCollision(e, b1, b2) {
    if (b1.isCrate && !b1.hit) {
      b1.hit = true;
      this.nextCrate();
    }
    if (b2.isCrate && !b2.hit) {
      b2.hit = true;
      this.api.sound.play('drop');
      this.nextCrate();
    }
  }
  setCameras() {
    this.actionCamera = this.cameras.add(
      0,
      0,
      this.api.screen_size.w,
      this.api.screen_size.h
    );
    this.actionCamera.ignore([this.sky, this.timeText]);
    this.cameras.main.ignore([this.ground, this.movingCrate]);
  }
  dropCrate() {
    if (this.canDrop && this.timer < gameOptions.timeLimit) {
      this.api.sound.play('tick');
      this.addTimer();
      this.canDrop = false;
      this.movingCrate.visible = false;
      this.addFallingCrate();
    }
  }
  update() {
    this.crateGroup.getChildren().forEach(function (crate) {
      if (crate.y > this.api.screen_size.h + crate.displayHeight) {
        if (!crate.body.hit) {
          this.nextCrate();
        }
        crate.destroy();
      }
    }, this);
  }
  addTimer() {
    if (this.timerEvent == null) {
      this.timerEvent = this.time.addEvent({
        delay: 1000,
        callback: this.tick,
        callbackScope: this,
        loop: true,
      });
    }
  }
  addFallingCrate() {
    let fallingCrate: any = this.matter.add.sprite(
      this.movingCrate.x,
      this.movingCrate.y,
      'crate'
    );
    fallingCrate.body.isCrate = true;
    fallingCrate.body.hit = false;
    this.crateGroup.add(fallingCrate);
    this.cameras.main.ignore(fallingCrate);
  }
  nextCrate() {
    this.zoomCamera();
    this.canDrop = true;
    this.movingCrate.visible = true;
  }
  zoomCamera() {
    let maxHeight = 0;
    this.crateGroup.getChildren().forEach(function (crate) {
      if (crate.body.hit) {
        maxHeight = Math.max(
          maxHeight,
          Math.round(
            (this.ground.getBounds().top - crate.getBounds().top) /
              crate.displayWidth
          )
        );
      }
    }, this);
    this.movingCrate.y =
      this.ground.getBounds().top -
      maxHeight * this.movingCrate.displayWidth -
      gameOptions.crateHeight;
    let zoomFactor =
      gameOptions.crateHeight /
      (this.ground.getBounds().top - this.movingCrate.y);
    this.actionCamera.zoomTo(zoomFactor, 500);
    let newHeight = this.api.screen_size.h / zoomFactor;
    this.actionCamera.pan(
      this.api.screen_size.w / 2,
      this.api.screen_size.h / 2 - (newHeight - this.api.screen_size.h) / 2,
      500
    );
  }
  tick() {
    this.timer++;
    this.timeText.text = (gameOptions.timeLimit - this.timer).toString();
    if (this.timer >= gameOptions.timeLimit) {
      this.timerEvent.remove();
      this.timerEvent = null;
      this.movingCrate.visible = false;
      // this.movingCrate.destroy();
      this.timeText.text = '';
      setTimeout(() => {
        //remove current drop
        this.data_p = { c: [], g: { x: this.ground.x, y: this.ground.y } };
        this.crateGroup.getChildren().forEach((c) => {
          this.data_p.c.push(c.getCenter());
          this.tweens.add({
            targets: c,
            y: { value: 0, duration: 2000, ease: 'Power1' },
            alpha: { value: 0, duration: 2000, ease: 'Power1' },
            onComplete: function (c) {
              c.destroy();
            }.bind(this, c),
          });
        }, this);

        this.api.loadInters();
        this.api
          .post('user?action=tower', { data: this.api.hh(this.data_p) })
          .subscribe((r) => {
            setTimeout(() => {
              this.resetGame();
            }, 2000);
          });
      }, 2000);
    }
  }
  resetGame() {
    this.timer = 0;
    this.movingCrate.visible = true;
    this.crateGroup.clear(true, true);
    this.scene.start('TowerGame');
    // this.canDrop = true;
    // this.timerEvent = null;
  }
}

@Component({
  selector: 'app-tower',
  templateUrl: './tower.page.html',
  styleUrls: ['./tower.page.scss'],
})
export class TowerPage implements OnInit {
  game: any;
  config: any;
  show = 0;
  constructor(public api: ApiService) {
    gameOptions.crateHeight =
      this.api.screen_size.h - this.api.screen_size.h / 3;
    var w = this.api.screen_size.w / 2;
    gameOptions.crateRange = [-w, w];
    this.config = {
      type: Phaser.AUTO,
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      physics: {
        default: 'matter',
        matter: {
          gravity: {
            y: gameOptions.gravity,
          },
        },
      },
      width: this.api.screen_size.w,
      height: this.api.screen_size.h,
      parent: 'game2',
      transparent: true,
      scene: TowerGame,
    };
  }

  ngOnInit() {}
  ionViewDidEnter() {
    this.game = new Phaser.Game(this.config);
    if (this.game) {
      this.game.registry.set('api', this.api);
    }

    // this.game.scene.resume('TowerGame');
    setTimeout(() => {
      this.show = 1;
    }, 1000);
  }

  ionViewWillLeave() {
    this.show = 0;
    this.game.destroy(true);
    // this.game.scene.pause('TowerGame');
  }
}
