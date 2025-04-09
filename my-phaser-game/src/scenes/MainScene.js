import { Scene } from "phaser";
import { Player } from "../gameobjects/Player";
import { PipeManager } from "../gameobjects/PipeManager";

export class MainScene extends Scene {
    player = null;
    cursors = null;
    pipe_manager = null;

    score = 0;

    background1 = null;
    background2 = null;

    // Scene Values
    scrollSpeed = 2;
    pipeGap = 200;
    pipeFrequency = 350;

    constructor() {
        super("MainScene");
    }

    init(data) {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.scene.launch("MenuScene");

        this.lives = data.lives ?? 5;
    }

    create() {

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
        this.physics.add.collider(this.player, floor, this.handlePlayerDeath, null, this);
        
        // Pipe Manager
        this.pipe_manager = new PipeManager(this, this.pipeGap, this.pipeFrequency);
        this.physics.add.collider(this.player, this.pipe_manager.pipes, this.handlePlayerDeath, null, this); // pipe collider
        this.physics.add.overlap(this.player, this.pipe_manager.scoreZones, this.increaseScore, null, this); // score overlap

        // Cursor keys 
        this.cursors = this.input.keyboard.createCursorKeys();

        // This event comes from MenuScene
        this.game.events.on("start-game", () => {
            this.scene.stop("MenuScene");
            this.scene.launch("HudScene", { lives: this.lives });
            this.scrollSpeed = 2;
            this.player.start();
            this.pipe_manager.start();
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

        this.pipe_manager.start();
        this.scrollSpeed = 2;
        //this.pipe_manager.state = "";
    }

    handlePlayerDeath(){
        if (this.player.state != "dead") {
            this.player.die();
            this.pipe_manager.stopPipes();
            this.scrollSpeed = 0;
            this.lives--;

            // Update life counter
            const hud = this.scene.get("HudScene");
            if (hud && hud.update_lives) {
                hud.update_lives(this.lives);
            }

            // Handles life logic
            this.time.delayedCall(1000, () => {
                if(this.lives > 0){
                    // Calls to reset scene, delays to allow user to have time to restart
                    this.resetScene();
                } else {
                    //Game is over
                    this.scene.stop("HudScene");
                    this.scene.start("GameOverScene");
                }
            });
        }
    }

    background_scroll(delta) {
        // Move both backgrounds
        const speed = this.scrollSpeed * delta / 10;
        this.background1.x -= speed;
        this.background2.x -= speed;

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

    increaseScore(player, scoreZone) {
        this.score += 1; // Increment score
        console.log("Score:", this.score);
    
        // Destroy the score zone to prevent duplicate scoring
        scoreZone.destroy();
    }

    update(time, delta) {
        this.background_scroll(delta);
        this.pipe_manager.update();
        this.player.update();

    }
}
