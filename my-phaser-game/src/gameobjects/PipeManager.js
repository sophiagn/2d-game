import { GameObjects } from "phaser";
import { Pipe } from "./Pipe";

export class PipeManager extends GameObjects.Group
{
    scene = null;

    pipes = null;
    pipeFrequency = 150; // milliseconds between new pipes
    pipeGap = 100;
    lastPipeTime = 0;

    constructor(scene, pipeGap = 100, pipeFrequency = 150) {
        super(scene);
        this.scene = scene;
        this.pipeGap = pipeGap;
        this.pipeFrequency = pipeFrequency;
        scene.add.existing(this);

        this.pipes = this.scene.physics.add.group({
            classType: Pipe,
            runChildUpdate: true
        });
    }

    spawn_pipes() {
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