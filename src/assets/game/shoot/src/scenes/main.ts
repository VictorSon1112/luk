import { AssetType, SoundType } from "../interface/assets";
import { AssetManager } from "../interface/manager/asset-manager";
import { AlienManager } from "../interface/manager/alien-manager";
// import { Ship } from "../interface/ship";
import {
    AnimationFactory,
    AnimationType,
} from "../interface/factory/animation-factory";
import { Alien } from "../interface/alien";
import { Bullet } from "../interface/bullet";
import { Kaboom } from "../interface/kaboom";
import Phaser from 'phaser';
export class MainScene extends Phaser.Scene {
    assetManager: AssetManager;
    animationFactory: AnimationFactory;
    bulletTime = 0;
    angle = 0;
    firingTimer = 0;
    starfield: Phaser.GameObjects.TileSprite;
    // player: Phaser.Physics.Arcade.Sprite;
    player: any = [];
    alienManager: AlienManager;
    fireKey: Phaser.Input.Pointer;
    board: any;
    bullets: any;
    value: any = {
        ship: 1,
        power: 1,
    };
    fit_width = 10;
    data_shoot: any = {
        balance: 0,
        play: 0,
        time: 0
    };
    user: any;
    sending = 0;
    sending_delay = 3000;
    api: any;
    constructor() {
        super({
            key: "MainScene",
        });
    }
    preload() {
        this.load.setBaseURL("assets/");
        this.load.image('bg', "images/bg_shoot.jpg");
        this.load.image('bullet', "images/bullet.png");
        this.load.image('board', "images/board3.png");
        this.load.image('diamond', "images/diamond.png");
        this.load.atlas('gems', 'images/frame/gems.png', 'images/frame/gems.json');

        this.load.image('ship', "images/player.png");
        this.load.spritesheet(AssetType.Kaboom, "images/exp1.png", {
            frameWidth: 100,
            frameHeight: 100
        });
        // this.load.spritesheet(AssetType.Kaboom, "images/explode.png", {
        //     frameWidth: 128,
        //     frameHeight: 128
        // });

        // this.sound.volume = 0.1;
        // this.load.audio(SoundType.Shoot, "sounds/shoot.wav");
        // this.load.audio(SoundType.Kaboom, "sounds/explosion.wav");
        // this.load.audio(SoundType.InvaderKilled, "sounds/invaderkilled.wav");

        this.api = this.registry.get('api');
        this.fit_width = this.scale.width/12;
    }

    create() {
        this.sending = this.time.now;
        this.player = this.physics.add.group();
        this.registry.events.on('changedata', (parent, key, value)=>{
            if(key == 'set_power'){
                this.value = value;
                this.setPower();
            }
        }, this);

        this.starfield = this.add.tileSprite(0, 0, 0, 0, 'bg').setDisplaySize(this.scale.width, this.scale.height).setOrigin(0,0);

  
        this.board = this.add.image(this.scale.width/2, this.scale.height, 'board');
        this.board.displayWidth = this.scale.width;
        this.board.scaleY = this.board.scaleX;
        this.board.setY(this.scale.height - (this.board.displayHeight/2));

        this.assetManager = new AssetManager(this);
        this.animationFactory = new AnimationFactory(this);
        this.alienManager = new AlienManager(this);


        this.bullets = this.physics.add.group({
            max: 0,
            classType: Bullet,
            runChildUpdate: true,
            collideWorldBounds: true,
        });

        //che do nay tuong
        this.physics.world.setBoundsCollision(false, false, true, false);

        this.value = this.registry.get('set_power');
        this.setPower();
        this.events.on('resume', ()=>{
            this.sending = this.time.now;
        })
        this.events.on('destroy', ()=>{
            this.sendData(true);
        })

        this.time.addEvent({
            delay: this.sending_delay,
            callback: this.sendData,
            callbackScope: this,
            loop: true
        })
    }
    update() {
        this.starfield.tilePositionY -= 2;
        var hold = this.input.activePointer;
        if(hold.isDown){
            this._fireBullet(hold);
        }

        this.physics.overlap(
            this.bullets,
            this.alienManager.aliens,
            this._bulletHitAliens,
            null,
            this
        );
        //destroy bullet
        this.bullets.children.iterate((b: Bullet)=>{
            if(b && (b.x < 0 || b.x > this.scale.width)){
                b.destroy();
            }
        })
    }
    private sendData(force = false){
        if(force){
            if(this.sending){
                this.sending = this.time.now - 1;
            }
        }
        if(this.sending && this.sending < this.time.now || this.data_shoot.time > 100){
            if(this.data_shoot.balance){
                this.sending = 0;
                var old_data = this.data_shoot;
                this.api.post('user?action=shoot', {shoot: this.api.hh(this.data_shoot)}).subscribe(r=>{
                    this.sending = this.time.now + this.sending_delay;
                    if(r.update){
                        this.api.user.balance = r.update;
                        this.data_shoot.balance -= old_data.balance;
                        this.data_shoot.play -= old_data.play;
                        this.data_shoot.time -= old_data.time;
                    }
                })
            }
        }
    }
    private setPower(){
        this.player.clear(true, true);
        var player_y = this.scale.height-this.board.displayHeight;
        for(var i = 0; i< this.value.ship; i++){
            var p = this.physics.add.sprite(this.scale.width/2, this.scale.height, 'ship');
            //tu dong can giua
            var player_x = (this.scale.width/2) - (p.width*this.value.ship/2) + (p.width*(i+1)) - (p.width/2);
            p.setPosition(player_x, player_y);
            p.setVisible(false);
            this.player.add(p);
        }
    }
    private _bulletHitAliens(bullet: Bullet, alien: Alien) {
        let explosion: Kaboom = this.assetManager.explosions.get();
        if(explosion){
            var w = this.fit_width;
            explosion.setDisplaySize(w,w);
            var win = alien.kill(explosion);
            if(win){
                //win
                this.api.sound.play('invaderkilled');
                this.api.user.balance += win;
                this.data_shoot.balance += win;
            }
            bullet.destroy();
            //win
            if (!this.alienManager.hasAliveAliens) {
                setTimeout(()=>{
                    if (!this.alienManager.hasAliveAliens) {
                        this.alienManager._sortAliens(false);
                    } 
                }, Phaser.Math.Between(0, 5) * 1000)
                // if(Math.abs(this.data_shoot.balance) > 100 || this.data_shoot.play > 100){
                //     this.sendData();
                // }
            }
        }
    }
    private _fireBullet(cursor) {
        if (cursor.event && cursor.event.target && cursor.event.target.localName == 'canvas' && this.time.now > this.bulletTime && cursor.y < (this.scale.height - this.board.displayHeight)) {

            if(this.api.user.balance >= this.player.children.size){
                var w = this.fit_width/1.5;
                var l = this.player.children.size;
                this.player.children.iterate(p=>{
                    let bullet: Bullet = this.bullets.create()
                    if(bullet){
                        bullet.setDisplaySize(w,w);
                        bullet.setBounce(1);
                        bullet.enableBody(true, p.x, p.y, true, true);
                        this.physics.velocityFromRotation(Phaser.Math.Angle.BetweenPoints(bullet, cursor), 300, bullet.body.velocity);
                    }
                })
                this.api.sound.play('shoot');
                this.data_shoot.time++;
                this.data_shoot.play+= l;
                this.data_shoot.balance-= l;
                this.api.user.balance-= l;
                this.bulletTime = this.time.now + 100;
                if(this.sending){
                    this.sending = this.time.now + this.sending_delay;
                }
            }else{
                this.api.alertCode('diamond_is_not_enough');
                this.bulletTime = this.time.now + 3000;
            }

        }
    }
}
