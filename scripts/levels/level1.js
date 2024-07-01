class Level1 extends Phaser.Scene {
  constructor() {
      super({ key: "Level1" });
      this.coins = 0; // Shared coin count, or manage separately if needed
      this.initialCoinPositions = [];
      this.availablePositions = []; // Stores potential positions for coin repositioning
      this.repositionCooldown = 2000; // Time between repositions
      this.lastRepositionTime = 0; // Last time coins were repositioned
  }

  preload() {
      this.load.image("tileset", "../../assets/Levels/tileset.png");
      this.load.image("character", "../../assets/Images/kalkaboot.png");
      this.load.image("background", "../../assets/Images/chapter1-bg.jpg"); // Load the background image
      this.load.tilemapCSV("map1", "./assets/Levels/map1.csv");
  }

  create() {
      // Add background image
      this.add.image(0, 0, 'background').setOrigin(0, 0).setDisplaySize(this.scale.width, this.scale.height);

      this.map = this.make.tilemap({
          key: "map1",
          tileWidth: 64,
          tileHeight: 64,
      });
      this.tiles = this.map.addTilesetImage("tileset");
      this.layer = this.map.createLayer(0, this.tiles, 0, 0);
      this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

      // Player 1 creation
      this.player1 = this.createPlayer(100, 500);

      // Player 2 creation, opposite side of the map
      this.player2 = this.createPlayer(this.map.widthInPixels - 100, 500);

      this.layer.setCollisionByExclusion([-1]);
      this.physics.add.collider(this.player1, this.layer, this.handleTileCollision, null, this);
      this.physics.add.collider(this.player2, this.layer, this.handleTileCollision, null, this);

      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasd = {
          left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
          right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
          up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      };

      this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
      this.cameras.main.startFollow(this.player1, true, 0.5, 0.5, 0, 0);

      this.map.forEachTile(tile => {
          if (tile.index === 6 || tile.index === 136) {
              this.initialCoinPositions.push({ x: tile.x, y: tile.y, index: tile.index });
              this.availablePositions.push({ x: tile.x, y: tile.y });
          }
      });

      // Set up overlap callbacks for collecting coins and repositioning tiles
      this.layer.setTileIndexCallback([6, 136], this.collectCoin, this);
      this.layer.setTileIndexCallback(47, this.handleOverlapWithTile47, this);
      this.physics.add.overlap(this.player1, this.layer);
      this.physics.add.overlap(this.player2, this.layer);

      // Initialize scene data for both players
      this.data.set('lives1', 3);
      this.data.set('level1', 1);
      this.data.set('score1', 0);
      this.data.set('lives2', 3);
      this.data.set('level2', 1);
      this.data.set('score2', 0);

      // Create text objects to display the data for both players
      this.scoreText1 = this.add.text(10, 10, '', { font: '24px Courier', fill: '#00ff00' });
      this.scoreText2 = this.add.text(this.scale.width - 130, 10, '', { font: '24px Courier', fill: '#f3ce45' });
      this.updateScoreText();

      // Create a black rectangle for fade effect
      this.fadeRect = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000)
          .setOrigin(0, 0)
          .setAlpha(0); // Initially transparent
  }

  createPlayer(x, y) {
      let player = this.physics.add.sprite(x, y, "character")
          .setOrigin(0.5, 0)
          .setCollideWorldBounds(true)
          .setBounce(0.2)
          .setDrag(100)
          .setGravityY(600)
          .setScale(0.5);
      player.body.setSize(120, 120);
      return player;
  }

  update() {
      this.updateCharacter(this.player1, this.cursors, 1);
      this.updateCharacter(this.player2, this.wasd, 2);

      // Check if all coins are collected
      if (this.getRemainingCoinsCount() <= 0) {
          this.advanceToNextLevel();
      }
  }

  updateCharacter(character, controls, playerNum) {
      if (controls.left.isDown) {
          character.setDrag(0);
          character.setVelocityX(-200);
          character.setFlipX(true);
      } else if (controls.right.isDown) {
          character.setDrag(0);
          character.setVelocityX(200);
          character.setFlipX(false);
      } else {
          character.setDrag(100);
          character.setVelocityX(0);
      }
      if (controls.up.isDown && character.body.blocked.down) {
          character.setVelocityY(-625);
          this.tweens.add({
              targets: character,
              angle: { from: 0, to: -360 },
              duration: 500,
              ease: 'Linear',
              onComplete: () => character.angle = 0
          });
      }
  }

  handleTileCollision(character, tile) {
      if (tile && (tile.index === 5 || tile.index === 27)) {
          this.resetPlayerAndCoins(character);
      }
  }

  resetPlayerAndCoins(character) {
      const playerNum = character === this.player1 ? 1 : 2;
      const livesKey = `lives${playerNum}`;
      const startPosition = playerNum === 1 ? 100 : this.map.widthInPixels - 100;

      if (this.data.get(livesKey) > 0) {
          this.data.set(livesKey, this.data.get(livesKey) - 1);
          character.setPosition(startPosition, 500);
      } else {
          character.disableBody(true, true); // Disable the player if no lives left
      }

      console.log(`Player ${playerNum} and coins have been reset.`);
      

      this.updateScoreText();

      // Check if both players are out of lives
      if (this.data.get('lives1') <= 0 && this.data.get('lives2') <= 0) {
          this.advanceToNextLevel();
      }
  }

  getCoin(character, tile) {
      let points = (tile.index === 6 ? 1 : 3);
      if (character === this.player1) {
          this.data.set('score1', this.data.get('score1') + points);
      } else {
          this.data.set('score2', this.data.get('score2') + points);
      }
      console.log(`Coin collected by ${character === this.player1 ? 'Player 1' : 'Player 2'}, tile removed. Total points: ${character === this.player1 ? this.data.get('score1') : this.data.get('score2')}`);
      this.layer.removeTileAt(tile.x, tile.y);
      this.updateScoreText();
  }

  collectCoin(character, tile) {
      if (tile && (tile.index === 6 || tile.index === 136)) {
          this.getCoin(character, tile);
      }
  }

  updateScoreText() {
      this.scoreText1.setText([
          'Player 1',
          'Level: ' + this.data.get('level1'),
          'Lives: ' + this.data.get('lives1'),
          'Score: ' + this.data.get('score1')
      ]);
      this.scoreText2.setText([
          'Player 2',
          'Level: ' + this.data.get('level2'),
          'Lives: ' + this.data.get('lives2'),
          'Score: ' + this.data.get('score2')
      ]);
  }

  getRemainingCoinsCount() {
      let count = 0;
      this.layer.forEachTile(tile => {
          if (tile.index === 6 || tile.index === 136) {
              count++;
          }
      });
      return count;
  }

  advanceToNextLevel() {
      console.log("Advancing to the next level...");

      // Fade out the scene
      this.tweens.add({
          targets: this.fadeRect,
          alpha: 1,
          duration: 1000,
          onComplete: () => {
              this.scene.start('Level2'); // Replace 'NextLevel' with your next level scene key
          }
      });
  }
}

export default Level1;
