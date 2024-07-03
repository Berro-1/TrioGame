class Level5 extends Phaser.Scene {
    constructor() {
        super({ key: "Level5" });
    }

    preload() {
        this.loadData();
        this.load.image("tileset", "../../assets/Levels/tileset.png");

        let savedCharacter1 = localStorage.getItem("character1");
        let savedCharacter2 = localStorage.getItem("character2");

        if (savedCharacter1) {
            this.load.image("player1", savedCharacter1);
        } else {
            this.load.image("player1", "../../assets/Images/kalkaboot.png");
        }

        if (savedCharacter2) {
            this.load.image("player2", savedCharacter2);
        } else {
            this.load.image("player2", "../../assets/Images/kalkaboot.png");
        }

        this.load.image("background", "../../assets/Images/chapter3-bg.png");
        this.load.image("penguin", "../../assets/Images/penguin.png");
        this.load.tilemapCSV("map5", "./assets/Levels/map5.csv");
    }

    create() {
        this.add.image(0, 0, 'background').setOrigin(0, 0).setDisplaySize(this.scale.width, this.scale.height);

        this.map = this.make.tilemap({
            key: "map5",
            tileWidth: 64,
            tileHeight: 64,
        });
        this.tiles = this.map.addTilesetImage("tileset");
        this.layer = this.map.createLayer(0, this.tiles, 0, 0);
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        this.player1 = this.createPlayer(40, 200, "player1");
        this.player2 = this.createPlayer(this.map.widthInPixels - 40, 300, "player2");
        this.player1.setDepth(1);
        this.player2.setDepth(1);

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

        this.penguin = this.physics.add.sprite(this.scale.width - 200, this.scale.height - 555, 'penguin');
        this.penguin.setOrigin(0.5, 0.5);
        this.penguin.setScale(0.2);
        this.penguin.body.allowGravity = false;
        this.penguin.body.immovable = true;
        this.penguin.body.collideWorldBounds = true;
        this.penguin.setDepth(0);
        this.penguin.body.onWorldBounds = true;
        this.physics.world.on('worldbounds', (body) => {
            if (body.gameObject === this.penguin) {
                this.penguin.x = this.scale.width;
            }
        });
    }

    createPlayer(x, y, spriteKey) {
        let player = this.physics.add.sprite(x, y, spriteKey)
            .setOrigin(0.5, 0)
            .setCollideWorldBounds(true)
            .setBounce(0.2)
            .setDrag(100)
            .setGravityY(600)
            .setScale(0.5);
        player.body.setSize(90, 120);
        return player;
    }

    update() {
        this.updateCharacter(this.player1, this.wasd, 1);
        this.updateCharacter(this.player2, this.cursors, 2);

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
            if (character.body.blocked.down) {
                character.setDrag(100);
                if (character.body.velocity.x === 0) {
                    character.setVelocityX(playerNum === 1 ? 10 : -10);
                }
            } else {
                character.setDrag(100);
            }
        }

        if (controls.up.isDown && character.body.blocked.down) {
            character.setVelocityY(-625);
            this.tweens.add({
                targets: character,
                angle: { from: 0, to: -360 },
                duration: 500,
                ease: 'Linear',
                onComplete: () => {
                    character.angle = 0;
                }
            });
        }
    }

    handleHighBounce(player, tile) {
        if ([66, 67, 68].includes(tile.index)) {
            player.setVelocityY(-400);
        }
    }

    handleTileCollision(character, tile) {
        if (tile && (tile.index === 170 || tile.index === 27)) {
            this.resetPlayerAndCoins(character);
        }
    }

    resetPlayerAndCoins(character) {
        const playerNum = character === this.player1 ? 1 : 2;
        const livesKey = `lives${playerNum}`;
        const startPosition = playerNum === 1 ? 50 : this.map.widthInPixels - 100;

        if (this.data.get(livesKey) > 1) {
            this.data.set(livesKey, this.data.get(livesKey) - 1);
            character.setPosition(startPosition, 220);
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
        const fadeScreen = document.getElementById('fade-screen');
        const fadeText = document.getElementById('fade-text');
        fadeText.innerHTML = '';
        fadeScreen.style.display = 'flex';
        setTimeout(() => {
            fadeScreen.style.opacity = 1;
            setTimeout(() => {
                this.scene.start('EndingScene');
                fadeScreen.style.opacity = 0;
                setTimeout(() => {
                    fadeScreen.style.display = 'none';
                }, 1000);
            }, 1000);
        }, 10);
    }
}

export default Level5;
