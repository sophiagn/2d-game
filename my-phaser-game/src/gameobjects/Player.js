import { GameObjects, Physics } from "phaser";
import { Scene } from "phaser";

export class Player extends Physics.Arcade.Image {
    
    // Player states: waiting, start, can_move
    state = "waiting";
    propulsion_fire = null;
    scene = null;
    spaceKey = null;
    lives = 5;

    constructor({ scene }) {
        super(scene, 200, 100, "player");
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        // Enable gravity on the player and allow collision with stuff
        this.body.setGravityY(400);
        this.setCollideWorldBounds(true); 
        this.body.enable = false;

        // Bullets group to create pool
        this.bullets = this.scene.physics.add.group();

        // Set up space key input for flapping
        this.spaceKey = this.scene.input.keyboard.addKey("SPACE");

        // Bouncing before game starts
        this.idleTween = this.scene.tweens.add({
            targets: this,
            y: this.y - 70,
            duration: 600,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        this.iddleTween = true;

        
    }

    
    start() {

        //set player to start state
        this.state = "start";

        // Stops bouncing 
        if (this.iddleTween) {
            this.idleTween.stop();
            this.idleTween = null;
        }

        // Enable player movement
        this.body.enable = true;
        this.setVelocityY(-200);
        this.state = "can_move";
    }

    update() {

        // Check if player can move, if so they can jump
        if (this.state === "can_move") {

            // If the space key is pressed, apply upward velocity
            if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
                this.setVelocityY(-200); 
            }

        }

        // Check if player has collided
        if (this.body.blocked.down || this.body.touching.down) {
            this.die();
        }
    }

    // handlePipeCollision(player) {
    //     if(player.state != "dead") {
    //         console.log("Player hit a pipe!");
    //         // player.state = "dead"
    //         this.scrollSpeed = 0
    //         this.pipe_manager.state = "e"
    //         this.pipe_manager.pipes.children.iterate((pipe) => {
    //             pipe.scroll_speed = 0; // Modify each pipe's scroll speed
    //         });
            
    //         this.die();
    //     }
    // }

    die() {

        // Set player to die state
        if (this.state === "dead") return; 

        // Set player to die state & red & stop movement
        this.state = "dead";
        this.body.enable = false; 
        this.setTint(0xff0000);

        // Delay the scene transition to allow any effects to play, call handlePlayerDeath
        this.scene.time.delayedCall(1000, () => {
            this.scene.handlePlayerDeath();
        });
        
    }
}