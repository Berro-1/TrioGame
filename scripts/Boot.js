var Game = Game || {};

Game.Boot = class Boot extends Phaser.Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        this.load.image('preloaderBar', 'assets/Images/spinner.png');
    }

    create() {
        this.scene.start('Preloader');
    }
};
