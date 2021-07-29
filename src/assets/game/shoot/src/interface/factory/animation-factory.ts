import { AssetType } from "../assets";

export enum AnimationType {
    Fly = "fly",
    Kaboom = "kaboom"
}

export class AnimationFactory {
    constructor(private _scene: Phaser.Scene) {
        this._init();
    }

    private _init() {
        this._scene.anims.create({ key: 'diamond', frames: this._scene.anims.generateFrameNames('gems', { prefix: 'diamond_', end: 15, zeroPad: 4 }), repeat: -1 });
        this._scene.anims.create({ key: 'prism', frames: this._scene.anims.generateFrameNames('gems', { prefix: 'prism_', end: 6, zeroPad: 4 }), repeat: -1 });
        this._scene.anims.create({ key: 'ruby', frames: this._scene.anims.generateFrameNames('gems', { prefix: 'ruby_', end: 6, zeroPad: 4 }), repeat: -1 });
        this._scene.anims.create({ key: 'square', frames: this._scene.anims.generateFrameNames('gems', { prefix: 'square_', end: 14, zeroPad: 4 }), repeat: -1 });
        
        // this._scene.anims.create({
        //     key: AnimationType.Fly,
        //     frames: this._scene.anims.generateFrameNumbers(AssetType.Alien, {
        //         start: 0,
        //         end: 3
        //     }),
        //     frameRate: 20,
        //     repeat: -1
        // });

        this._scene.anims.create({
            key: AnimationType.Kaboom,
            frames: this._scene.anims.generateFrameNumbers(AssetType.Kaboom, {
                start: 0,
                end: 150
            }),
            frameRate: 30,
            repeat: 0
        })
    }
}