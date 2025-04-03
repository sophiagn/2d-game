import { Scene } from "phaser";

// The HUD scene is the scene that shows the points and the remaining time.
export class HudScene extends Scene {

    lives_text;

    constructor() {
        super("HudScene");
    }

    init(data) {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.lives = data.lives;
    }

    create() {
        this.lives_text = this.add.bitmapText(10, 10, "pixelfont", `LIVES:${this.lives}`, 24);
    }

    update_lives(newLives) {
        this.lives = newLives;
        this.lives_text.setText(`LIVES:${this.lives}`);

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
    }

}