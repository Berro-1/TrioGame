import Boot from "./scripts/Boot.js";
import Preloader from "./scripts/Preloader.js";
import MainMenu from "./scripts/mainMenu.js";
import Level1 from "./scripts/levels/level1.js";
import Level2 from "./scripts/levels/Level2.js";
// import Level3 from "./scripts/levels/Level3.js";
import Level5 from "./scripts/levels/level5.js";

export function startGame() {
  const config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 960,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    parent: "game-container",
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 250 },
      },
   
    },
    scene: [Boot, Preloader, MainMenu, Level1, Level2, Level5],
  };

  new Phaser.Game(config);
}
