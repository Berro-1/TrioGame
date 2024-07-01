Game.Preloader = class Preloader extends Phaser.Scene {
    constructor() {
        super('Preloader');
    }

    preload() {
        this.preloadBar = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'preloaderBar');
        this.preloadBar.setOrigin(0.5, 0.5);
        this.load.on('progress', (value) => {
            this.preloadBar.setScale(value, 1);
        });


        this.load.image('tileset', 'assets/tileset.png');

    }

    create() {

        this.scene.start('Level');
    }
};
