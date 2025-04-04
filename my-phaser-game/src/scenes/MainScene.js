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

    init(data) {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.scene.launch("MenuScene");

        this.lives = data.lives ?? 5;
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
        this.pipe_manager = new PipeManager(this, 200, 300);
        this.physics.add.collider(this.player, this.pipe_manager.pipes, this.handlePipeCollision, null, this);

        // Cursor keys 
        this.cursors = this.input.keyboard.createCursorKeys();

        // This event comes from MenuScene
        this.game.events.on("start-game", () => {
            this.scene.stop("MenuScene");
            this.scene.launch("HudScene", { lives: this.lives });
            this.player.start();
   
        });

    }

    // Resets the scene if lives > 0
    resetScene() {

        this.player.clearTint();
        this.player.setPosition(200, 100);
        this.player.setVelocity(0, 0);
        this.player.body.enable = true;
        this.player.state = "can_move";
        this.pipe_manager.clearPipes();
        this.pipe_manager.state = "";
        this.scrollSpeed = 2;
    }

    handlePlayerDeath(){

        this.lives--;

        // Update life counter
        const hud = this.scene.get("HudScene");
        if (hud && hud.update_lives) {
            hud.update_lives(this.lives);
        }

        // Handles life logic
        if(this.lives > 0){

            // Calls to reset scene, delays to allow user to have time to restart
            this.time.delayedCall(1000, () => {this.resetScene();});

        } else {

            //Game is over
            this.scene.stop("HudScene");
            this.scene.start("GameOverScene");

        }
    }

    handlePipeCollision(player) {
        if(player.state != "dead") {
            console.log("Player hit a pipe!");
            // player.state = "dead"
            this.scrollSpeed = 0
            this.pipe_manager.pipes.children.iterate((pipe) => {
                pipe.scroll_speed = 0; // Modify each pipe's scroll speed
            });

            // Disable physics on player collision to stop pipes from moving
            this.physics.world.removeCollider(this.pipeCollision);

            // this.player.die();

            this.pipe_manager.state = "e"
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

    }
}
