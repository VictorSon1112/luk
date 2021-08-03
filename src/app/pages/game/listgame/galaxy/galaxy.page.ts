import { Component, OnInit } from '@angular/core';
import Phaser from 'phaser';
import { ApiService } from '../../../../api.service';

// let playing = false;
class GalaxyGame extends Phaser.Scene {
  api: any = {};
  ship: any;
  scoreLabel: any;
  diamonds = [];
  lastSpawn = Date.now();
  score: number = 0;
  // start: any;
  eatDiamond: any;
  pointer = {
    isDown: false,
    x: 0,
    y: 0,
  };
  sky: any;
  value: any = {
    spawn: 1100,
  };
  LABEL = {
    PLAYER: 'PLAYER',
    DIAMOND: 'DIAMOND',
    ASTEROID: 'ASTEROID',
  };
  CONSTANTS = {
    SHIP_SPEED: 10,
  };
  ENTITY_LIST = [this.LABEL.DIAMOND, this.LABEL.ASTEROID];

  // post data
  sending = 0;
  sending_delay = 3000;
  constructor() {
    super('GalaxyGame');
  }

  preload() {
    this.api = this.registry.get('api');

    this.load.setBaseURL('assets/');
    this.load.image('sky', 'images/bggalaxy.jpg');
    // this.load.atlas(
    //   'entities',
    //   'game/galaxy/sprites/entities.png',
    //   'game/galaxy/sprites/entities.json'
    // );

    this.load.image('rocket', 'game/galaxy/spaceship.png');
    this.load.image('diamond', 'images/diamond.png');

    this.load.spritesheet('kaboom', 'images/exp2.png', {
      frameWidth: 100,
      frameHeight: 100,
    });

    this.load.audio('eat', 'sounds/in/win.mp3');

    this.load.json('galaxy', 'game/galaxy/galaxy.json');
    this.load.json('shapes', 'game/galaxy/shapes.json');

    // this.load.bitmapFont(
    //   'Starfont',
    //   'game/galaxy/starfont.png',
    //   'game/galaxy/starfont.xml'
    // );

    this.load.on('complete', () => {
      this.scene.start('GalaxyGame');
    });
  }

  create() {
    this.matter.world.update30Hz();
    this.registry.events.on(
      'changedata',
      (parent, key, value) => {
        if (key == 'set_spawn') {
          this.value = value;
        }
      },
      this
    );
    const { width, height } = this.cameras.main;
    // const touchToStart = this.add
    //   .sprite(width / 2, height / 2, "entities", "UI/start")
    //   .setScale(4)
    //   .setDepth(100);
    // const bg = this.add.rectangle(
    //   width / 2,
    //   height / 2,
    //   width,
    //   height,
    //   0x111111
    // );
    // bg.setInteractive();
    // bg.on("pointerup", () => {
    //   if (!playing) {
    //     playing = true;
    //     this.start = Date.now();
    //     touchToStart.setVisible(false);
    //     console.log(playing);
    //   }
    // });
    this.sky = this.add.sprite(0, 0, 'sky');
    this.sky.setDisplaySize(width, height);
    this.sky.setOrigin(0, 0);
    this.anims.create({
      key: 'boom',
      frames: this.anims.generateFrameNumbers('kaboom', {
        start: 0,
        end: 150,
      }),
      frameRate: 30,
      repeat: 0,
    });
    const bounds = this.matter.world.setBounds(0, -200, width, height + 200);
    for (let key in bounds.walls) {
      bounds.walls[key].label = key;
      bounds.walls[key].isWall = true;
    }

    this.ship = this.matter.add
      .sprite(width / 2, height - 80, 'rocket', '', {
        label: this.LABEL.PLAYER,
        shape: this.cache.json.get('galaxy').spaceship,
      } as any)
      .setDisplaySize(width / 5, height / 6);
    this.ship.setFixedRotation();

    this.matter.world.on('collisionstart', (e) => {
      for (let collision of e.pairs) {
        const { bodyA, bodyB } = collision;
        let player = null;
        let objHit = null;
        if (bodyA.parent.label === this.LABEL.PLAYER) {
          player = bodyA;
          objHit = bodyB;
        }
        if (bodyB.parent.label === this.LABEL.PLAYER) {
          player = bodyB;
          objHit = bodyA;
        }
        let point = 0;
        if (player) {
          if (objHit.parent.label === this.LABEL.DIAMOND) {
            this.removeDiamond(objHit);
            point = Math.floor(this.value.spawn / 200);
            this.score += point;
            this.api.animate(point);
            this.api.user.balance += point;
          } else if (objHit.parent.label === this.LABEL.ASTEROID) {
            if (this.api.user.balance == 0) {
              point = 0;
            } else {
              point = -Math.floor(this.value.spawn / 150);
            }
            this.score += point;
            this.api.animate(point);
            this.api.user.balance += point;
            var explosion = this.add
              .sprite(bodyB.position.x, bodyB.position.y / 0.8, 'kaboom')
              .play('boom');
            explosion.depth = 2;
            explosion.once('animationcomplete', () => {
              explosion.destroy();
              this.removeDiamond(objHit);
            });
          }
        }

        // Floor check
        if (bodyA.isWall || bodyB.isWall) {
          const wall = bodyA.isWall ? bodyA : bodyB;
          const obj = bodyA.isWall ? bodyB : bodyA;

          if (
            wall.label == 'bottom' &&
            (obj.parent.label == this.LABEL.DIAMOND ||
              obj.parent.label == this.LABEL.ASTEROID)
          ) {
            this.removeDiamond(obj);
          }
        }
      }
    });

    this.input.on('pointerdown', (pointer) => {
      this.pointer.isDown = true;
      this.pointer.x = pointer.worldX;
      this.pointer.y = pointer.worldY;
    });
    this.input.on('pointermove', (pointer) => {
      this.pointer.x = pointer.worldX;
      this.pointer.y = pointer.worldY;
    });
    this.input.on('pointerup', () => {
      this.pointer.isDown = false;
    });

    //  core UI
    // this.add
    //   .sprite(width - 5, 5, "diamond")
    //   .setScale(0.2)
    //   .setOrigin(1, 0)
    //   .setDepth(1000);
    // this.scoreLabel = this.add
    //   .bitmapText(width - 50, 10, "Starfont", "")
    //   .setOrigin(1, 0)
    //   .setDepth(1000);

    // sendData
    // this.events.on('destroy', () => {
    //   this.sendData();
    //   this.registry.destroy(); // destroy registry
    // });
    // this.time.addEvent({
    //   delay: 3000,
    //   callback: this.sendData,
    //   callbackScope: this,
    //   loop: true,
    // });
  }
  removeDiamond(obj) {
    this.diamonds = this.diamonds.filter((e) => e.body.id !== obj.parent.id);
    obj.gameObject.setVisible(false).setActive(false);
    obj.parent.destroy();
  }

  // sendData() {
  //   this.api
  //     .post('user?action=galaxy', {
  //       data: this.score,
  //       balance: this.api.user.balance,
  //     })
  //     .subscribe((r) => {
  //       this.score = 0;
  //     });
  // }

  update() {
    if (this.pointer.isDown) {
      const difX = this.pointer.x - this.ship.x;
      const difY = this.pointer.y - this.ship.y;

      if (
        Math.abs(difX) < this.CONSTANTS.SHIP_SPEED &&
        Math.abs(difY) < this.CONSTANTS.SHIP_SPEED
      ) {
        this.ship.x = this.pointer.x;
        this.ship.y = this.pointer.y;
      } else {
        const direction = new Phaser.Math.Vector2(difX, difY).normalize();
        this.ship.x += direction.x * this.CONSTANTS.SHIP_SPEED;
        this.ship.y += direction.y * this.CONSTANTS.SHIP_SPEED;
      }
    }
    if (Date.now() > this.lastSpawn + (1 / this.value.spawn) * 200000) {
      const { width } = this.cameras.main;
      const newType =
        this.ENTITY_LIST[Math.floor(Math.random() * this.ENTITY_LIST.length)];

      let newObject = null;
      if (newType === this.LABEL.DIAMOND) {
        newObject = this.matter.add
          .sprite(width * Math.random(), -80, 'diamond', '', {
            label: this.LABEL.DIAMOND,
            id: Math.floor(Math.random() * 1000000),
            shape: this.cache.json.get('galaxy').diamond,
          } as any)
          .setScale(0.2);
      } else {
        const ASTEROIDS = ['big', 'med', 'small', 'tiny'];
        const size = ASTEROIDS[Math.floor(ASTEROIDS.length * Math.random())];
        newObject = this.matter.add.sprite(
          width * Math.random(),
          -80,
          'entities',
          `asteroids/brown/${size}`,
          {
            label: this.LABEL.ASTEROID,
            id: Math.floor(Math.random() * 1000000),
            shape: this.cache.json.get('shapes')[size],
          } as any
        );
      }
      newObject.setFrictionAir(0);

      newObject.setVelocityY(2 + this.value.spawn / 200);
      this.diamonds.push(newObject);
      this.lastSpawn = Date.now();
    }
    // this.scoreLabel.text = this.score;
  }
}

@Component({
  selector: 'app-galaxy',
  templateUrl: './galaxy.page.html',
  styleUrls: ['./galaxy.page.scss'],
})
export class GalaxyPage implements OnInit {
  game: any;
  config: any;
  show = 0;
  value: any = {
    spawn: 1100,
  };

  constructor(public api: ApiService) {
    this.config = {
      width: 400,
      height: 480,
      type: Phaser.AUTO,
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      physics: {
        default: 'matter',
        matter: {
          debug: false,
          gravity: {
            x: 0,
            y: 0,
          },
        },
      },
      parent: 'galaxygame',
      scene: [GalaxyGame],
    };
  }
  ngOnInit() {
    // this.api.post('user?action=history&name=galaxy', {}).subscribe((r) => {
    //   this.api.crash_game.history = r.history;
    // });
  }
  setValue(type, v) {
    this.value[type] = v;
    this.game.registry.set('set_spawn', this.value);
  }
  ionViewWillEnter() {
    this.game = new Phaser.Game(this.config);
    if (this.game) {
      this.game.registry.set('api', this.api);
      this.game.registry.set('set_spawn', this.value);
      setTimeout(() => {
        this.show = 1;
      }, 1000);
    }
  }

  ionViewWillLeave() {
    this.show = 0;
    this.game.destroy(true);
  }
}
