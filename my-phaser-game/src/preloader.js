// Class to preload all the assets
// Remember you can load this assets in another scene if you need it
export class Preloader extends Phaser.Scene {
    constructor() {
        super({ key: "Preloader" });
    }

    preload() {
        // Load all the assets
        this.load.setPath("assets");
        this.load.image("logo", "logo.png");
        this.load.image("floor");
        this.load.image("background", "background.png");
        this.load.image("background1", "background.png");
        this.load.image("background2", "background2.png");
        this.load.image("backgroundPlain", "backgroundPlain.png");

        this.load.image("titleLogo", "FFgamename.png");
        this.load.image("gameOver", "gameoverimage.png");

        this.load.image("0hearts", "/lives/0hearts.png");
        this.load.image("1hearts", "/lives/1hearts.png");
        this.load.image("2hearts", "/lives/2hearts.png");
        this.load.image("3hearts", "/lives/3hearts.png");
        this.load.image("4hearts", "/lives/4hearts.png");
        this.load.image("5hearts", "/lives/5hearts.png");

        this.load.image("ocean-background", "ocean-background.png");
        this.load.image("coral1", "obstacles/coral1.png");
        this.load.image("coral2","obstacles/coral2.png")
        this.load.image("seaweed1", "obstacles/seaweed1r.png"); // for seaweed animation
        this.load.image("seaweed2", "obstacles/seaweed2r.png"); // for seaweed animation

        this.load.image("player", "player/fish1.png");
        this.load.image("player2", "player/fish2.png");
        this.load.image("playerDead", "player/fish_dead.png");
        // this.load.atlas("propulsion-fire", "player/propulsion/propulsion-fire.png", "player/propulsion/propulsion-fire_atlas.json");
        // this.load.animation("propulsion-fire-anim", "player/propulsion/propulsion-fire_anim.json");

        //audios
        this.load.audio("bubbles", "/audio/bubbles-003-6397.mp3");
        this.load.audio("levelUp", "/audio/levelPassed.mp3");
        this.load.audio("obstaclePassed", "/audio/success.mp3");
        this.load.audio("drop", "/audio/drop.mp3");

        // Fonts
        this.load.bitmapFont("pixelfont", "fonts/pixelfont.png", "fonts/pixelfont.xml");
        this.load.image("knighthawks", "fonts/knight3.png");

        // Event to update the loading bar
        this.load.on("progress", (progress) => {
            console.log("Loading: " + Math.round(progress * 100) + "%");
        });

        // Bubble
        this.load.image("bubble", "player/propulsion/bubbles.png");
    }

    create() {
        // Create bitmap font and load it in cache
        const config = {
            image: 'knighthawks',
            width: 31,
            height: 25,
            chars: Phaser.GameObjects.RetroFont.TEXT_SET6,
            charsPerRow: 10,
            spacing: { x: 1, y: 1 }
        };

        
        this.cache.bitmapFont.add('knighthawks', Phaser.GameObjects.RetroFont.Parse(this, config));

        // When all the assets are loaded go to the next scene
        this.scene.start("SplashScene");

        this.anims.create({
            key: "fish-swim",
            frames: [
                { key: "player" },
                { key: "player2" },
            ],
            frameRate: 3, 
            repeat: -1 
        });

        this.anims.create({
            key: "seaweed-waving",
            frames: [
                { key: "seaweed1" },
                { key: "seaweed2" },
            ],
            frameRate: 3,
            repeat: -1
        });
    }
}