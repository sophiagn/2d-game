import { Scene } from "phaser";
import { Player } from "../gameobjects/Player";

export class MainScene extends Scene {
    player = null;

    points = 5;

    constructor() {
        super("MainScene");
    }

    init() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.scene.launch("MenuScene");

        // Use the lives or go to default if none
        this.lives = this.data.lives ?? 5;

    }

    create() {
        // Create background image
        this.add.image(0, 0, "background").setOrigin(0, 0);
        
        // Create the floor image and enable it as a static physics object
        const floor = this.add.image(0, this.scale.height, "floor").setOrigin(0, 1);
        this.physics.add.existing(floor, true); // true makes it static

        // Create the player
        this.player = new Player({ scene: this });

        // Collider
        this.physics.add.collider(this.player, floor, (player, floor) => {

            // Calculate the bottom of the player's body (using its y and half its height)
            const playerBottom = player.y + player.displayHeight / 2;

            // The top of the floor is at floor.y because the floor's origin is (0,1)
            if (playerBottom >= floor.y - 5) { // 5-pixel tolerance
                player.die();
            }
        });

        // This event comes from MenuScene
        this.game.events.on("start-game", () => {
            this.scene.stop("MenuScene");
            this.scene.launch("HudScene", { remaining_time: this.game_over_timeout });
            this.player.start();
        });
    }

    handlePlayerDeath(){

        this.lives--;

        if(this.lives > 0){

            this.scene.launch("HudScene");

        } else {

            this.scene.stop("HudScene");
            this.scene.launch("GameOverScene");

        }
    }

    update() {

        this.player.update();

    }
}
