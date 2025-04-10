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
        this.currentLevel = 1;
    }

    init(data) {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.scene.launch("MenuScene");

        this.lives = 3;

        this.score = 0;

        // saves the current level, if no level is provided, it defaults to 1
        this.currentLevel = data.currentLevel ?? 1;
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

        //restores scroll speed 
        this.setLevelParameters();


        this.player.clearTint();
        this.player.setPosition(200, 100);
        this.player.setVelocity(0, 0);
        this.player.body.enable = true;
        this.player.state = "can_move";
        this.pipe_manager.clearPipes();

        this.pipe_manager.gap = this.pipeGap;
        // this.pipe_manager.frequency = this.pipeFrequency;
        // this.scrollSpeed = this.scrollSpeed ?? 2;
        this.pipe_manager.start();
        // this.scrollSpeed = 2;
        this.player.start();
        console.log("Resetting scene at Level", this.currentLevel, "with scrollSpeed:", this.scrollSpeed);
    }

    handlePlayerDeath(){
        if (this.player.state != "dead") {
            this.player.die();
            this.pipe_manager.stopPipes();
            this.scrollSpeed = 0;
            this.score = 0;
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
            this.pipeGap = 200;
            this.pipeFrequency = 350;
            
        } else if(this.currentLevel === 2){
            this.scrollSpeed = 2.5;
            this.pipeGap = 180;
            this.pipeFrequency = 290;
            // this.background.setTint(0x555555);
        } else if(this.currentLevel === 3){
            this.scrollSpeed = 3;
            this.pipeGap = 160;
            this.pipeFrequency = 230;
            // this.background.setTint(0x666666);
        } else if(this.currentLevel === 4){
            this.scrollSpeed = 3.5;
            this.pipeGap = 140;
            this.pipeFrequency = 170;
        } else if(this.currentLevel === 5){
            this.scrollSpeed = 4;
            this.pipeGap = 120;
            this.pipeFrequency = 110;
        } else if(this.currentLevel === 6){
            this.scrollSpeed = 4.5;
            this.pipeGap = 100;
            this.pipeFrequency = 50;
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
