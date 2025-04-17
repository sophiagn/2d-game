import { Scene } from "phaser";

// The HUD scene is the scene that shows the points and the remaining time.
export class HudScene extends Scene {

    lives_text;
    lives_image;


    constructor() {
        super("HudScene");
    }

    init(data) {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.lives = data.lives;
    }

    create() {
        this.lives_text = this.add.bitmapText(10, 10, "pixelfont", `LIVES:${this.lives}`, 24);

        this.lives_image = this.add.image(
            this.lives_text.x + this.lives_text.width / 2 + 5,
            this.lives_text.y + this.lives_text.height + 10,
            `${this.lives}hearts` 
        ).setOrigin(0.5, 0);
    
        this.lives_image.setScale(0.4);

        const heartWidth = 72;
        this.lives_image.setCrop(0, 0, this.lives * heartWidth, this.lives_image.height);
    }

    update_lives(newLives) {
        this.lives = newLives;
        this.lives_text.setText(`LIVES:${this.lives}`);

        this.lives_image.setTexture(`${this.lives}hearts`);

        // Kill exisiting tween to prevent stacking
        this.tweens.killTweensOf(this.lives_text);

        if (this.lives === 1) {

            // Set it red and start pulsing
            this.lives_text.setTint(0xff0000); // red
    
            // Create a pulsing tween
            this.tweens.add({
                targets: this.lives_text,
                scale: { from: 1, to: 1.5 },
                duration: 500,
                yoyo: true,
                repeat: -1, // loop forever
                ease: 'Sine.easeInOut'
            });
        } else {

            // Reset to normal if lives are more than 1
            this.lives_text.clearTint();
            this.lives_text.setScale(1);
        }

        console.log("HUD updated lives to:", newLives);
    }

}