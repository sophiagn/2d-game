import { GameObjects } from "phaser";

export class Pipe extends GameObjects.Image
{
    scroll_speed = 2;

    constructor(scene, x, y) {
        super(scene, x, y, "pipe");
        this.name = "pipe";
    }

    spawn(x, y, flag) {
        this.setPosition(x, y);
        if (flag) this.flipY = true;
        this.setScale(0.4, 0.4);
        this.setOrigin(0.5, 0);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
    }

    update ()
    {
        this.x -= this.scroll_speed;
        const pipeWidth = 100

        if (this.x < -pipeWidth) {
            this.setActive(false);
            this.setVisible(false);
            this.destroy();
        }
    }

}