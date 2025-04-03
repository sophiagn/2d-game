import { GameObjects } from "phaser";
import { Pipe } from "./Pipe";

export class PipeManager extends GameObjects.Group
{
    scene = null;
    state = "e";
    pipes = null;
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
    }

    spawn_pipes() {
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
            pipe.scroll_speed = 0; // Modify each pipe's scroll speed
        });
        this.state = "e"
    }

    clearPipes() {
        this.pipes.children.iterate((pipe) => {
            if (pipe)
                pipe.destroy(); // Destroy each pipe instance
        });
    
        this.pipes.clear(true, true); // Remove all pipes from the group
    }

}