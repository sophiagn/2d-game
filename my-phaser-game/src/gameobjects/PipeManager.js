import { GameObjects } from "phaser";
import { Pipe } from "./Pipe";
import { ScoreZone } from "./ScoreZone";

export class PipeManager extends GameObjects.Group
{
    scene = null;
    state = "e";
    pipes = null;
    scoreZones = null;
    pipeFrequency = 150; // milliseconds between new pipes
    pipeGap = 0;
    lastPipeTime = 0;

    constructor(scene, pipeGap, pipeFrequency = 150) {
        pipeGap = 250;
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
                const pipeX = 1000; // Spawn x position (off-screen to the right)
                const minPipeY = -200; // Minimum y position for the bottom pipe
                const pipeHeight = 300;

                // Randomizer
                const rand = Math.floor(Math.random() * (150 - (-50) + 1)) + (-50);

                // Top pipe (flipped)
                const topPipe = this.pipes.get();
                if (topPipe) {
                    topPipe.spawn(pipeX, minPipeY + rand, false); // Spawn bottom pipe
                }

                const bottomPipe = this.pipes.get();
                if (bottomPipe) {
                    bottomPipe.spawn(pipeX, this.pipeGap + minPipeY + pipeHeight + rand, true); // Spawn top pipe (flipped)
                }

                // **ADD SCORE ZONE**
                const scoreZoneX = pipeX; // Position in the center of the pipes
                const scoreZoneY = minPipeY + pipeHeight + rand + (this.pipeGap / 2); // Middle of the gap
                const scoreZoneWidth = 10; // Thin collider
                const scoreZoneHeight = this.pipeGap; // Same height as gap

                const scoreZone = this.scoreZones.get();
                if (scoreZone) {
                    scoreZone.spawn(scoreZoneX, scoreZoneY, scoreZoneWidth, scoreZoneHeight);
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
        this.state = "e"
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

}