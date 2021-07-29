import { Alien } from "../alien";
import { AnimationType } from "../factory/animation-factory";

export class AlienManager {
    aliens: Phaser.Physics.Arcade.Group;
    get hasAliveAliens(): boolean {
        return !(this.aliens.children.size < 5);
        // return !!this.aliens.children.size
    }

    constructor(private _scene: Phaser.Scene) {
        this.aliens = this._scene.physics.add.group({
            classType: Alien,
            // setScale: {x: 0.5, y: 0.5}
        });
        this._sortAliens();
    }
    _sortAliens(clear = true) {
        if(clear){
            this.aliens.clear(true, true);
        }
        var w = this._scene.scale.width/10;
        var full_item = this._scene.scale.width - ((w)*2);
        var x = w;
        var y = w;
        for (var i = 0; i < 20; i++) {
            let alien: Alien = this.aliens.create();
            alien.setPosition(x, y);
            alien.setCollideWorldBounds(true).setBounce(1);
            alien.setImmovable(false);
            if (x >= full_item){
                x = w;
                y += (w*2);
            }else{
                x += (w*2);
            }
            alien.setLevel(Phaser.Math.Between(0, alien.listLevel.length-1));
            alien.displayWidth = w;
            alien.displayHeight = w;
            this._scene.tweens.add({
                targets: alien,
                ease: "Power1",
                duration: Phaser.Math.Between(1000, 5000),
                y: Phaser.Math.Between(0, this._scene.scale.height/3),
                x: Phaser.Math.Between(0, this._scene.scale.width),
                paused: false,
                delay: 0,
                yoyo: true,
                repeat: -1,
                onActive: function(t, target){
                    console.log(target);
                }
            })
        }
    }
}