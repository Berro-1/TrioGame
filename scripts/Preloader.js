class Preloader extends Phaser.Scene {
    constructor() {
        super('Preloader');
    }

    preload() {
        this.load.tilemapCSV('map2', '../assets/Levels/map2.csv');
        this.load.image('tileset', '../assets/Levels/tileset.png');
    }

    create() {
        this.scene.start('Level2');
    }
}

export default Preloader;
