import { AssetType, SoundType } from "./assets";
import { AnimationType } from "./factory/animation-factory";
// import { Kaboom } from "./kaboom";

export class Alien extends Phaser.Physics.Arcade.Sprite {
  // listLevel = [ 'diamond', 'prism', 'ruby', 'square'];
  listLevel = ['prism', 'ruby', 'square'];
  private level = 0;
  private rate_win = 0;
  private win = 0;
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, AssetType.Alien)
    this.win = Math.pow(2, this.level+1);
    this.rate_win = 100/this.win;
    //cong them % ty le thang
    this.rate_win += (this.rate_win/100*45);
  }
  setLevel(l){
    this.level = l;
    this.play(this.listLevel[l]);
  }
  kill(explosion) {
    explosion.setPosition(this.x, this.y);
    explosion.play(AnimationType.Kaboom)
    explosion.once('animationcomplete', () => {
      explosion.destroy()
    })
    var rand = Phaser.Math.Between(1, 100);

    if(rand < this.rate_win){
      this.destroy();
      // them hieu ung diamond collect

      // var d = this.scene.physics.add.sprite(this.x, this.y, 'diamond');
      // var w = this.width/4;
      // d.setDisplaySize(w,w);
      // this.scene.tweens.add({
      //     targets: this,
      //     y: this.scene.scale.height-100,
      //     alpha: { value: 0, duration: 1500, ease: 'Power1' },
      //     onComplete: function (d) {
      //       d.destroy(); 
      //     }.bind(this, this)
      // });
      
      return this.win;
    }else{
      return false;
    }
  }

}