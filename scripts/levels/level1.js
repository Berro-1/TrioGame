class Level1 extends Phaser.Scene {
  constructor() {
    super({ key: "Level1" });
    this.coins = 0;
    this.initialCoinPositions = [];  }

  preload() {
    this.load.image("tileset", "../../assets/Levels/tileset.png");
    this.load.image("character", "../../assets/Images/kalkaboot.png");
    this.load.tilemapCSV("map1", "./assets/Levels/map1.csv");
  }

  create() {
    this.map = this.make.tilemap({
      key: "map1",
      tileWidth: 64,
      tileHeight: 64,
    });
    this.tiles = this.map.addTilesetImage("tileset");
    this.layer = this.map.createLayer(0, this.tiles, 0, 0);
    this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

    this.character = this.physics.add.sprite(100, 500, "character") // Adjusted to correct asset key
      .setOrigin(0.5, 0)
      .setCollideWorldBounds(true)
      .setBounce(0.2)
      .setDrag(100)
      .setGravityY(600);
    this.character.body.setSize(80, 150);
    this.character.setScale(0.5);

    this.layer.setCollisionByExclusion([-1, 47]);

    this.physics.add.collider(this.character, this.layer, this.handleTileCollision, null, this);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.cameras.main.startFollow(this.character, true, 0.2, 0.2, 0, -this.cameras.main.height / 2);
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

    this.layer.setDepth(1);
    this.character.setDepth(2);

    this.character.setDebug(true, true, 0xff0000);

    this.map.forEachTile(tile => {
      if (tile.index === 6 || tile.index === 136) { // Assuming these are your coin tile indices
        this.initialCoinPositions.push({ x: tile.x, y: tile.y, index: tile.index });
      }
    });

  }

  resetCharacter(character, character2) {
    character.setPosition(100, 500);
    character2.setPosition(100, 500);
    // Call to reset the coins on the map, assuming you implement this method
    console.log("Characters and coins reset due to hazard.");
  }


 

  update() {
    this.updateCharacter(this.character, this.cursors);

    // Manually adjust camera position based on character's Y position
    if (this.character.y < this.cameras.main.scrollY + this.cameras.main.height / 2) {
      this.cameras.main.scrollY = this.character.y - this.cameras.main.height / 2;
    }
  }

  updateCharacter(character, controls) {
    if (controls.left.isDown || controls.right.isDown) {
      character.setDrag(0); // No drag when moving
      character.setVelocityX(controls.left.isDown ? -200 : 200);
    } else {
      character.setDrag(100); // Apply drag to stop more abruptly when no keys are pressed
      character.setVelocityX(0); // Reset horizontal velocity to stop sliding
    }
    if (controls.up.isDown && character.body.blocked.down) {
      character.setVelocityY(-625); // Jump functionality
    }
  }
}

export default Level1;
