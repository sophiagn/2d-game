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
        
    }

    
    start() {

        //set player to start state
        this.state = "start";

        // Stops bouncing 
        this.idleTween.stop();

        // Enable player movement
        this.body.enable = true;
        this.setVelocityY(0);
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
    }

    die() {

        // Set player to die state
        if (this.state === "dead") return; 

        // Set player to die state & red & stop movement
        this.state = "dead";
        //this.body.enable = false; 
        this.setTint(0xff0000);
        
    }
}