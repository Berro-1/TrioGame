class Level3 extends Phaser.Scene {
    constructor() {
        super({ key: "Level3" });
        this.player1Coins = 0;
        this.player2Coins = 0;
    }
    preload(){
        this.loadData();
        this.load.image("tileset", "../../assets/Levels/tileset.png");
        this.load.image("character", "../../assets/Images/kalkaboot.png");
        this.load.image("background2", "../../assets/Images/chapter2-bg.jpg");
        this.load.tilemapCSV("map3", "./assets/Levels/map3.csv");
    }

    create(){
        
        this.add.image(0, 0, 'background2').setOrigin(0, 0).setDisplaySize(this.scale.width, this.scale.height);

        this.map = this.make.tilemap({
            key: "map3",
            tileWidth: 64,
            tileHeight: 64,
        });
        this.tiles = this.map.addTilesetImage("tileset");
        this.layer = this.map.createLayer(0, this.tiles, 0, 0);
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

    }

    loadData() {
        const savedData = localStorage.getItem('gameData');
        if (savedData) {
            const gameData = JSON.parse(savedData);
            this.player1Coins = gameData.player1Coins;
            this.player2Coins = gameData.player2Coins;
        } else {
            this.player1Coins = 0;
            this.player2Coins = 0;
            console.log('No saved data found, starting with default values.');
        }
    }
}

export default Level3;