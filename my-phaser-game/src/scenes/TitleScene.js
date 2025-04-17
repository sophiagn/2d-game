import { Scene } from "phaser";

export class TitleScene extends Scene {
    constructor() {
        super("TitleScene");
    }

    init() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);   
    }

    create() {
        // Set up background switching
        this.currentBackground = 1;
        this.backgroundImage = this.add.image(0, 0, "background1")
            .setOrigin(0, 0)
            .setDisplaySize(this.scale.width, this.scale.height);

        this.time.addEvent({
            delay: 500, // switch every 500ms (0.5s)
            callback: () => {
                this.currentBackground = this.currentBackground === 1 ? 2 : 1;
                const newKey = `background${this.currentBackground}`;
                this.backgroundImage.setTexture(newKey);
            },
            loop: true
        });

        // Title Logo at top middle
        this.add.image(this.scale.width / 2, 80, "titleLogo")
            .setOrigin(0.5, 0.35)
            .setScale(0.8)
            .postFX.addShine(1, .2, 5);
        //const fx = titleLogo.postFX.addShine(1, .2, 5);

        // Description paragraph
        this.add.text(
            this.scale.width / 2,
            this.scale.height / 1.25,
            "In this game of Floppy Fish, flap your fins and avoid obstacles! Good luck!",
            {
                font: "18px Arial",
                color: "#ffffff",
                align: "center",
                wordWrap: { width: this.scale.width * 0.8 }
            }
        ).setOrigin(0.5, 0.5);

        // Start Button
        const startButton = this.add.text(
            this.scale.width / 2,
            this.scale.height / 2 + 220,
            "START",
            {
                font: "28px Arial",
                backgroundColor: "#008042",
                padding: { x: 20, y: 10 },
                color: "#fff"
            }
        )
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", () => {
            this.scene.start("MainScene");
            this.sound.play("drop");
        });
    }
}
