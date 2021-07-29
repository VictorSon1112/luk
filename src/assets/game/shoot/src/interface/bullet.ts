import { AssetType, SoundType } from "./assets";

export class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0, AssetType.Bullet);
    }
}

