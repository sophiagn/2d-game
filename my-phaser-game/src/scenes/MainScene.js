import { Scene } from "phaser";
import { Player } from "../gameobjects/Player";
import { PipeManager } from "../gameobjects/PipeManager";

export class MainScene extends Scene {
    player = null;
    cursors = null;
    pipe_manager = null;

    points = 5;

    background1 = null;
    background2 = null;
    scrollSpeed = 2;

    constructor() {
        super("MainScene");
    }

    init() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.scene.launch("MenuScene");

        // Reset points and timeout
        this.points = 0;
        this.game_over_timeout = 20;
    }

    create() {
        
        const { width, height } = this.scale;

        this.background1 = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'ocean-background')
            .setOrigin(0, 0);
        
        this.background2 = this.add.tileSprite(this.scale.width, 0, this.scale.width, this.scale.height, 'ocean-background')
            .setOrigin(0, 0);

        // Create the floor image and enable it as a static physics object
        const floor = this.add.image(0, this.scale.height, "floor").setOrigin(0, 1);
        this.physics.add.existing(floor, true); // true makes it static

        // Create the player
        this.player = new Player({ scene: this });

        //Collider
        this.physics.add.collider(this.player, floor-1, (player, floor) => {
    
            // Calculate the bottom of the player's body (using its y and half its height)
            const playerBottom = player.y + player.displayHeight / 2;
            
            // The top of the floor is at floor.y because the floor's origin is (0,1)
            if (playerBottom >= floor.y-5) { // 5-pixel tolerance
                player.die();
            }
        });
        
        // Pipe Manager
        this.pipe_manager = new PipeManager(this, 100, 300);

        // Cursor keys 
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursors.space.on("down", () => {
            this.player.fire();
        });

        this.input.on("pointerdown", (pointer) => {
            this.player.fire(pointer.x, pointer.y);
        });

        // This event comes from MenuScene
        this.game.events.on("start-game", () => {
            this.scene.stop("MenuScene");
            this.scene.launch("HudScene", { remaining_time: this.game_over_timeout });
            this.player.start();

            // Game Over timeout event
            // this.time.addEvent({
            //     delay: 1000,
            //     loop: true,
            //     callback: () => {
            //         if (this.game_over_timeout === 0) {
            //             this.game.events.removeListener("start-game");
            //             this.scene.stop("HudScene");
            //             this.scene.start("GameOverScene", { points: this.points });
            //         } else {
            //             this.game_over_timeout--;
            //             this.scene.get("HudScene").update_timeout(this.game_over_timeout);
            //         }
            //     }
            // });
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

    background_scroll() {
        // Move both backgrounds
        this.background1.x -= this.scrollSpeed;
        this.background2.x -= this.scrollSpeed;

        // When the first background is completely off screen
        if (this.background1.x <= -this.scale.width) {
            // Reset it to the right of the second background
            this.background1.x = this.background2.x + this.scale.width;
            
        }

        // When the second background is completely off screen
        if (this.background2.x <= -this.scale.width) {
            // Reset it to the right of the first background
            this.background2.x = this.background1.x + this.scale.width;
        }
    }  

    update() {
        this.background_scroll();
        this.pipe_manager.spawn_pipes();

        this.player.update();

        // // Player movement entries
        // // Freezes screen when clicking up or down when uncommented!
        // if (this.cursors.up.isDown) {
        //     this.player.move("up");
        // }
        // if (this.cursors.down.isDown) {
        //     this.player.move("down");
        // }
    }
}
