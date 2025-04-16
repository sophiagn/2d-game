import { GameObjects } from "phaser";

export class ScoreZone extends Phaser.Physics.Arcade.Sprite
{
    scroll_speed = 2;
    scale = 0.4;

    constructor(scene, x, y) {
        super(scene, x, y, null);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

    }

    spawn(x, y, width, height, scroll_speed = 2) {
        this.setPosition(x, y);
        this.setSize(width, height); // Set collider size
        this.setOrigin(0.5);
        this.setAlpha(0); // Make it invisible

        this.scroll_speed = scroll_speed;
    }

    update (time, delta)
    {
        this.x -= this.scroll_speed * delta / 10;

        if (this.x < 0) {
            this.setActive(false);
            this.setVisible(false);
            this.destroy();
        }
    }

}