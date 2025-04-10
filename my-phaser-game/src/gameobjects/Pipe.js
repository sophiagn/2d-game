import { GameObjects } from "phaser";

export class Pipe extends Phaser.Physics.Arcade.Sprite
{
    scroll_speed = 2;
    scale = 0.4;

    constructor(scene, x, y) {
        super(scene, x, y, "pipe");
        this.name = "pipe";

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.setImmovable(true); // Pipes should not move when hit
        
        if (this.name === "seaweed") {
            this.anims.play("seaweed-waving");
        }

        // Update the collider size to match the new scale
        //this.body.setSize(this.width * this.scale, this.height * this.scale);
        //this.body.setOffset((this.width - this.body.width) / 2, (this.height - this.body.height) / 2); 
    }

    spawn(x, y, flag) {
        this.setPosition(x, y);
        if (flag) {
            this.flipY = true;
        }
        this.setScale(this.scale, this.scale);
        this.setOrigin(0.5, 0);

        this.body.enable = true; // Enable physics body

    }
    

    update (time, delta)
    {
        this.x -= this.scroll_speed * delta / 10;
        const pipeWidth = 100

        if (this.x < -pipeWidth) {
            this.setActive(false);
            this.setVisible(false);
            this.destroy();
        }
    }

}