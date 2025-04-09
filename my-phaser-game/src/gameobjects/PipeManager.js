import { GameObjects } from "phaser";
import { Pipe } from "./Pipe";

export class PipeManager extends GameObjects.Group
{
    scene = null;
    state = "";
    pipes = null;
    pipeFrequency = 100; // milliseconds between new pipes
    pipeGap = 0;
    lastPipeTime = 0;

    constructor(scene, pipeGap, pipeFrequency = 100) {
        //pipeGap = 250;
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
        if (this.state != "e") {
            
        if (this.lastPipeTime > this.pipeFrequency) {
                const pipeX = 1000; // Spawn x position (off-screen to the right)
                const minPipeY = -200; // Minimum y position for the bottom pipe
                const pipeHeight = 300;

                // Randomizer
                const rand = Math.floor(Math.random() * (150 - (-50) + 1)) + (-50);
                const coin = Math.random() < 0.5;
                
                // Top pipe (flipped)
                const topPipe = this.pipes.get();
                if (topPipe) {
                    if (coin) {
                        topPipe.setTexture("seaweed");
                        topPipe.name = "seaweed";
                        topPipe.anims.play("seaweed-waving");
                        topPipe.spawn(pipeX, minPipeY + rand, true);
                    } else {
                        topPipe.spawn(pipeX, minPipeY + rand, false);
                    }
                    
                }

                    const bottomPipe = this.pipes.get();
                    if (bottomPipe) {
                        if (coin) {
                        bottomPipe.setTexture("seaweed");
                        bottomPipe.name = "seaweed";
                        bottomPipe.anims.play("seaweed-waving");
                        bottomPipe.spawn(pipeX, this.pipeGap + minPipeY + pipeHeight + rand, false); 
                    } else {
                        bottomPipe.spawn(pipeX, this.pipeGap + minPipeY + pipeHeight + rand, true); 
                    }
                    
                    }

                this.lastPipeTime = 0;
            }
            this.lastPipeTime++;
            
        }
    }

    clearPipes() {
        this.pipes.children.iterate((pipe) => {
            if (pipe)
                pipe.destroy(); // Destroy each pipe instance
        });
    
        this.pipes.clear(true, true); // Remove all pipes from the group
    }

}