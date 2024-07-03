class Preloader extends Phaser.Scene {
    constructor() {
        super('Preloader');
    }

    preload() {
        this.load.tilemapCSV('map1', '../assets/Levels/map1.csv');
        this.load.image('tileset', '../assets/Levels/tileset.png');
    }

    create() {
        this.scene.start('Level5');
    }
}

export default Preloader;
