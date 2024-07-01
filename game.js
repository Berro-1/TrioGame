import Boot from './scripts/Boot.js';
import Preloader from './scripts/Preloader.js';
import MainMenu from './scripts/MainMenu.js';
import Level1 from './scripts/levels/level1.js';

export function startGame() {
    const config = {
        type: Phaser.AUTO,
        width: 1920,
        height: 960,
        scale: {
            mode: Phaser.Scale.FIT, 
            autoCenter: Phaser.Scale.CENTER_BOTH  
        },
        parent: 'game-container',
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 250 },
                debug: true
            }
        },
        scene: [Boot, Preloader, MainMenu, Level1]
    };

    new Phaser.Game(config);
}
