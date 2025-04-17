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
    scrollSpeed = 4;

    constructor() {
        super("MainScene");
    }

    init(data) {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.scene.launch("MenuScene");

        this.lives = data.lives ?? 5;
    }

    create() {

        this.scoreSound = this.sound.add("obstaclePassed");

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

            
            this.bubblesSound = this.sound.add("bubbles");
            this.bubblesSound.play({ volume: 1 });

            this.time.delayedCall(500, () => {
                this.tweens.add({
                    targets: this.bubblesSound,
                    volume: 0,
                    duration: 1000,
                    onComplete: () => {
                        this.bubblesSound.stop();
                    }
                });
            });
            

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

        // When the first background is completely off screen
        if (this.floor1.x <= -this.floor1.width) {
            // Reset it to the right of the second background
            this.floor1.x = this.floor2.x + this.floor1.width;
        }

        // When the second background is completely off screen
        if (this.floor2.x <= -this.floor1.width) {
            // Reset it to the right of the first background
            this.floor2.x = this.floor1.x + this.floor1.width;
        }
    }  

    increaseScore(player, scoreZone) {
        this.score += 1; // Increment score
        console.log("Score:", this.score);
    
        // Destroy the score zone to prevent duplicate scoring
        scoreZone.destroy();

        if(this.score == 2){
            this.levelUp();
            this.lives = 3;

            //update life counter
            const hud = this.scene.get("Hudscene");
            if(hud && hud.update_lives) {
                hud.update_lives(this.lives);
            }
        }
    }

    setLevelParameters() {

        if(this.currentLevel === 1) {
            this.scrollSpeed = 2;

        } else if(this.currentLevel === 2){
            this.scrollSpeed = 2.5;

            this.background1.setTint(0x555555);
            this.background2.setTint(0x555555);
            this.pipe_manager.setPipeTexture("coral2");
        } else if(this.currentLevel === 3){
            this.scrollSpeed = 3;

            // this.background.setTint(0x666666);
        } else if(this.currentLevel === 4){
            this.scrollSpeed = 3.5;
        } else if(this.currentLevel === 5){
            this.scrollSpeed = 4;
        } else if(this.currentLevel === 6){
            this.scrollSpeed = 4.5;
        }
    }

    levelUp(){

        this.currentLevel++;

        // call to change parameters based on level
        this.setLevelParameters();
        this.lives = 3; 

        // reset score 
        this.score = 0;

        // update life counter
        this.time.delayedCall(100, () => {
            const hud = this.scene.get("HudScene");
            if (hud && hud.update_lives) {
                hud.update_lives(this.lives);
            }
        });

        // message of levelUp
        this.cameras.main.flash(500, 0, 255, 0);
        console.log("Level Up! You are in level", this.currentLevel);

        
    }


    update(time, delta) {
        this.background_scroll(delta);
        this.pipe_manager.update();
        this.player.update();

    }
}
