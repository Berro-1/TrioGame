import Boot from "./scripts/Boot.js";
import Preloader from "./scripts/Preloader.js";
import MainMenu from "./scripts/mainMenu.js";
import Level1 from "./scripts/levels/level1.js";
import Level2 from "./scripts/levels/Level2.js";
import Level3 from "./scripts/levels/Level3.js";
import Level4 from "./scripts/levels/level4.js";
import Level5 from "./scripts/levels/level5.js";
import EndingScene from "./scripts/levels/endingScene.js";


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
        debug: true
      },
   
    },
    scene: [Boot, Preloader, MainMenu, Level1, Level2, Level3,Level4,Level5, EndingScene],
  };

  new Phaser.Game(config);
}