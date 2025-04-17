
export class LeaderBoardScene extends Phaser.Scene {
    constructor() {
      super("LeaderBoardScene");
    }
  
    init(data) {
      // receive final score from MainScene
      this.finalScore = data.score ?? 0;
    }
  
    create() {

     this.add.image(0, 0, "backgroundPlain")
        .setOrigin(0, 0);
     this.add.image(0, this.scale.height, "floor")
        .setOrigin(0, 1);

      // load saved leaderboard array
      const stored = localStorage.getItem("leaderboard");
      const board = stored ? JSON.parse(stored) : [];
      
      // add run’s score, sort descending, keep top 10
      board.push(this.finalScore);
      board.sort((a, b) => b - a);
      if (board.length > 10) board.length = 10;
      
      localStorage.setItem("leaderboard", JSON.stringify(board));
      
      // display title & entry
      this.add.text(
        this.scale.width/2, 80,
        "🏆 Leaderboard 🏆",
        { fontSize: "32px", color: "#ffffff" }
      ).setOrigin(0.5, 0.5);
      

      board.forEach((score, idx) => {
        this.add.text(
          this.scale.width/2, 150 + idx * 30,
          `${idx+1}. Anonymous: ${score}`,
          { fontSize: "24px", color: "#ffff66" }
        ).setOrigin(0.5, 0);
      });
      
      // prompt to play again
      this.add.text(
        this.scale.width/2, this.scale.height - 60,
        "Click to play again",
        { fontSize: "18px", color: "#ffffff" }
      ).setOrigin(0.5, 0.5);
  
      this.input.once("pointerdown", () => {
        this.scene.start("MainScene");
      });
    }
  }
  