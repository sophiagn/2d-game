import { GameObjects } from "phaser";
import { Pipe } from "./Pipe";
import { ScoreZone } from "./ScoreZone";

export class PipeManager extends GameObjects.Group
{
    scene = null;
    state = "e";
    pipes = null;
    scoreZones = null;
    pipeFrequency = 0; // milliseconds between new pipes
    pipeGap = 0;
    lastPipeTime = 0;
    pipeTexture = "coral1";

    scroll_speed = 2;

    constructor(scene, pipeGap, pipeFrequency) {
        super(scene);
        this.scene = scene;
        this.pipeGap = pipeGap;
        this.pipeFrequency = pipeFrequency;
        scene.add.existing(this);

        this.pipes = this.scene.physics.add.group({
            classType: Pipe,
            runChildUpdate: true,
            immovable: true
        });

        this.scoreZones = this.scene.physics.add.group({
            classType: ScoreZone,
            runChildUpdate: true,
            immovable: true
        });
    }

    update(time, delta) {
        if (this.state != "e") {
            
            if (this.lastPipeTime > this.pipeFrequency) {
                const pipeX = this.scene.sys.canvas.width + 100; // Spawn x position (off-screen to the right)
                const minPipeY = -200; // Minimum y position for the bottom pipe
                const pipeHeight = 300;

                // Randomizer
                const rand = Math.floor(Math.random() * (150 - (-50) + 1)) + (-50);
                // const coin = Math.random() < 0.5;
                
                // Top pipe (flipped)
                const topPipe = this.pipes.get();
                if (topPipe) {
                    // if (coin) {
                    //     topPipe.setTexture("seaweed");
                    //     topPipe.name = "seaweed";
                    //     topPipe.anims.play("seaweed-waving");
                    //     topPipe.spawn(pipeX, minPipeY + rand, true);
                        // } else {
                            topPipe.spawn(pipeX, minPipeY + rand, true, this.pipeTexture, this.scroll_speed);
                        // }
                    
                }

                    const bottomPipe = this.pipes.get();
                    if (bottomPipe) {
                        // if (coin) {
                        //     bottomPipe.setTexture("seaweed");
                        //     bottomPipe.name = "seaweed";
                        //     bottomPipe.anims.play("seaweed-waving");
                        //     bottomPipe.spawn(pipeX, this.pipeGap + minPipeY + pipeHeight + rand, false); 
                        // } else {
                            bottomPipe.spawn(pipeX, this.pipeGap + minPipeY + pipeHeight + rand, false, this.pipeTexture, this.scroll_speed); 
                        // }
                    
                    }

                // **ADD SCORE ZONE**
                const scoreZoneX = pipeX; // Position in the center of the pipes
                const scoreZoneY = minPipeY + pipeHeight + rand + (this.pipeGap / 2); // Middle of the gap
                const scoreZoneWidth = 10; // Thin collider
                const scoreZoneHeight = this.pipeGap; // Same height as gap

                const scoreZone = this.scoreZones.get();
                if (scoreZone) {
                    scoreZone.spawn(scoreZoneX, scoreZoneY, scoreZoneWidth, scoreZoneHeight, this.scroll_speed);
                }

                this.lastPipeTime = 0;
            }

            this.lastPipeTime++;
            
        }
    }

    start() {
        this.state = ""
    }

    stopPipes() {
        this.pipes.children.iterate((pipe) => {
            pipe.scroll_speed = 0;
        });
        this.scoreZones.children.iterate((zone) => {
            zone.scroll_speed = 0; 
        });
        this.state = "e";
    }

    stopSpawn() {
        this.state = "e";
    }

    clearPipes() {
        this.pipes.children.iterate((pipe) => {
            if (pipe)
                pipe.destroy(); // Destroy each pipe instance
        });

        if (this.scoreZones) {
            this.scoreZones.children.iterate((zone) => {
                if (zone) zone.destroy();
            });
            this.scoreZones.clear(true, true);
        }
    
        this.pipes.clear(true, true); // Remove all pipes from the group
    }

    setPipeTexture(key) {
        this.pipeTexture = key;
    }

    changeDifficulty(pipeGap, pipeFrequency) {
        this.pipeGap = pipeGap;
        this.pipeFrequency = pipeFrequency;
    }

    changeScrollSpeed(speed) {
        this.scroll_speed = speed;
        this.pipes.children.iterate((pipe) => {
            pipe.scroll_speed = speed;
        });
        this.scoreZones.children.iterate((zone) => {
            zone.scroll_speed = speed; 
        });
    }

}