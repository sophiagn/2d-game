import { GameObjects } from "phaser";

export class Pipe extends Phaser.Physics.Arcade.Sprite
{
    scroll_speed = 2;
    scale = 0.4;

    constructor(scene, x, y) {
        super(scene, x, y, "coral1");
        this.name = "coral1";

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

    spawn(x, y, flag, texture, scroll_speed = 2) {
        this.setPosition(x, y);
        if (flag) {
            this.flipY = true;
        }
        this.setScale(this.scale, this.scale);
        this.setOrigin(0.5, 0);
        this.setTexture(texture)
        this.body.enable = true; // Enable physics body
        this.scroll_speed = scroll_speed;
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