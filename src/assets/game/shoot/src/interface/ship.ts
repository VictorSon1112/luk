import { AssetType } from "./assets";

export class Ship {
    static create(scene: Phaser.Scene): Phaser.Physics.Arcade.Sprite {
        let ship = scene.physics.add.sprite(scene.game.scale.width/2, scene.game.scale.height, AssetType.Ship);
        ship.setCollideWorldBounds(true);
        return ship;
    }
}