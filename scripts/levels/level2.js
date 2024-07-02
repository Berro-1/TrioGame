class Level2 extends Phaser.Scene {
    constructor() {
        super({ key: "Level2" });
    }

    preload() {
        this.loadData();
        this.load.image("tileset", "../../assets/Levels/tileset.png");
        this.load.image("character", "../../assets/Images/kalkaboot.png");
        this.load.image("background", "../../assets/Images/chapter1-bg.jpg");
        this.load.image("bird", "../../assets/Images/bird.png");
        this.load.tilemapCSV("map2", "./assets/Levels/map2.csv");
    }

    create() {
        this.add.image(0, 0, 'background').setOrigin(0, 0).setDisplaySize(this.scale.width, this.scale.height);

        this.map = this.make.tilemap({
            key: "map2",
            tileWidth: 64,
            tileHeight: 64,
        });
        this.tiles = this.map.addTilesetImage("tileset");
        this.layer = this.map.createLayer(0, this.tiles, 0, 0);
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        this.player1 = this.createPlayer(40, 400);
        this.player2 = this.createPlayer(this.map.widthInPixels - 40, 500);

        this.layer.setCollisionByExclusion([-1, 66, 67, 68, 89, 90]);
        this.physics.add.collider(this.player1, this.layer, this.handleTileCollision, null, this);
        this.physics.add.collider(this.player2, this.layer, this.handleTileCollision, null, this);
        this.layer.setTileIndexCallback([66, 67, 68], this.handleHighBounce, this);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = {
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        };

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.player1, true, 0.5, 0.5, 0, 0);

        this.layer.setTileIndexCallback([6, 136], this.collectCoin, this);
        this.physics.add.overlap(this.player1, this.layer);
        this.physics.add.overlap(this.player2, this.layer);

        this.data.set('lives1', 3);
        this.data.set('level1', 1);
        this.data.set('lives2', 3);
        this.data.set('level2', 1);

        this.scoreText1 = this.add.text(10, 10, '', { font: '24px Courier', fill: '#00ff00' });
        this.scoreText2 = this.add.text(this.scale.width - 130, 10, '', { font: '24px Courier', fill: '#f3ce45' });
        this.updateScoreText();

        this.fadeRect = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000)
            .setOrigin(0, 0)
            .setAlpha(1);

        this.tweens.add({
            targets: this.fadeRect,
            alpha: { from: 1, to: 0 },
            duration: 1000,
            onComplete: () => {
                this.fadeRect.setAlpha(0);
            }
        });

        // Create the first bird that moves from right to left
        this.enemyBird1 = this.physics.add.sprite(this.scale.width, this.scale.height - 650, 'bird');
        this.enemyBird1.setOrigin(0.5, 0.5);
        this.enemyBird1.body.allowGravity = false;
        this.enemyBird1.body.immovable = true;
        this.enemyBird1.body.collideWorldBounds = true;
        this.enemyBird1.body.onWorldBounds = true;
        this.physics.world.on('worldbounds', (body) => {
            if (body.gameObject === this.enemyBird1) {
                this.enemyBird1.x = this.scale.width;
            }
        });

        // Create the second bird that moves from left to right and is flipped
        this.enemyBird2 = this.physics.add.sprite(0, this.scale.height - 600, 'bird');
        this.enemyBird2.setOrigin(0.5, 0.5);
        this.enemyBird2.setFlipX(true);
        this.enemyBird2.body.allowGravity = false;
        this.enemyBird2.body.immovable = true;
        this.enemyBird2.body.collideWorldBounds = true;
        this.enemyBird2.body.onWorldBounds = true;
        this.physics.world.on('worldbounds', (body) => {
            if (body.gameObject === this.enemyBird2) {
                this.enemyBird2.x = 0;
            }
        });

        // Add collision detection between players and birds
        this.physics.add.collider(this.player1, this.enemyBird1, this.resetPlayerAndCoins, null, this);
        this.physics.add.collider(this.player2, this.enemyBird1, this.resetPlayerAndCoins, null, this);
        this.physics.add.collider(this.player1, this.enemyBird2, this.resetPlayerAndCoins, null, this);
        this.physics.add.collider(this.player2, this.enemyBird2, this.resetPlayerAndCoins, null, this);
    }

    createPlayer(x, y) {
        let player = this.physics.add.sprite(x, y, "character")
            .setOrigin(0.5, 0)
            .setCollideWorldBounds(true)
            .setBounce(0.2)
            .setDrag(100)
            .setGravityY(600)
            .setScale(0.5);
        player.body.setSize(90, 120);
        return player;
    }

    updateEnemyBirds() {
        this.enemyBird1.x -= 5;
        this.enemyBird2.x += 5;
    }

    update() {
        this.updateCharacter(this.player1, this.wasd, 1);
        this.updateCharacter(this.player2, this.cursors, 2);
        this.updateEnemyBirds();

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

    handleHighBounce(player, tile) {
        if ([66, 67, 68].includes(tile.index)) {
            player.setVelocityY(-400);
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

        if (this.data.get(livesKey) > 1) {
            this.data.set(livesKey, this.data.get(livesKey) - 1);
            character.setPosition(startPosition, 500);
        } else {
            character.disableBody(true, true);
            this.data.set(livesKey, 0);
        }

        console.log(`Player ${playerNum} and coins have been reset.`);

        this.updateScoreText();

        if (this.data.get('lives1') === 0 && this.data.get('lives2') === 0) {
            this.advanceToNextLevel();
        }
    }

    getCoin(character, tile) {
        let points = (tile.index === 6 ? 1 : 3);
        if (character === this.player1) {
            this.player1Coins += points;
        } else {
            this.player2Coins += points;
        }
        console.log(`Coin collected by ${character === this.player1 ? 'Player 1' : 'Player 2'}, tile removed. Total coins: ${character === this.player1 ? this.player1Coins : this.player2Coins}`);
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
            'Coins: ' + this.player1Coins,
        ]);
        this.scoreText2.setText([
            'Player 2',
            'Level: ' + this.data.get('level2'),
            'Lives: ' + this.data.get('lives2'),
            'Coins: ' + this.player2Coins,
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

    saveToLocalStorage() {
        const gameData = {
            player1Coins: this.player1Coins,
            player2Coins: this.player2Coins,
        };
        localStorage.setItem('gameData', JSON.stringify(gameData));
    }

    loadData() {
        const savedData = localStorage.getItem('gameData');
        if (savedData) {
            const gameData = JSON.parse(savedData);
            this.player1Coins = gameData.player1Coins;
            this.player2Coins = gameData.player2Coins;
        } else {
            console.log('No saved data found, starting with default values.');
        }
    }

    advanceToNextLevel() {
        this.saveToLocalStorage();

        this.tweens.add({
            targets: this.fadeRect,
            alpha: 1,
            duration: 1000,
            onComplete: () => {
                this.scene.start('Level3');
            }
        });
    }
}

export default Level2;
