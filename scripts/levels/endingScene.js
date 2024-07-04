class EndingScene extends Phaser.Scene {
    constructor() {
        super({ key: "EndingScene" });
    }

    preload() {
        this.load.image('castle', '../../assets/Images/aisle.png');
        this.load.image('princess', '../../assets/Images/princess.png');
        this.load.image('kalkaboot', '../../assets/Images/kalkaboot.png');
        this.load.image('fireworks', '../../assets/Images/fireworks.png');
        this.load.audio('celebrateMusic', '../../assets/audio/wedding_march.mp3');
 
 
    }

    create() {
        var music1 = this.game.registry.get('themeMusic');
        console.log(music1);
        
            music1.mute = true; 
            music1.volume = 0.0;
            console.log(music1.volume);
        
        
 
        this.add.image(960, 540, 'castle');
        this.add.image(1050, 700, 'princess');

        const gameData = this.loadData();
        const { winnerName, winnerImageKey } = this.determineWinner(gameData);

        this.loadWinnerImage(winnerImageKey);

        this.time.delayedCall(2000, () => {
            this.add.text(640, 200, 'Congratulations!', { fontSize: '48px', fill: '#000' });
            this.add.text(640, 250, `${winnerName} marries the princess!`, { fontSize: '36px', fill: '#000' });
            this.createFireworks();
        });

        this.time.delayedCall(3000, () => {
            this.createRestartButton();
        });
    }

    loadData() {
        const savedData = localStorage.getItem('gameData');
        return savedData ? JSON.parse(savedData) : { player1Coins: 0, player2Coins: 0 };
    }

    determineWinner(gameData) {
        let winnerName = 'Draw';
        let winnerImageKey = 'kalkaboot';  

        if (gameData.player1Coins > gameData.player2Coins) {
            winnerName = 'Player 1';
            winnerImageKey = 'character1';
        } else if (gameData.player2Coins > gameData.player1Coins) {
            winnerName = 'Player 2';
            winnerImageKey = 'character2';
        }

        return { winnerName, winnerImageKey };
    }

    loadWinnerImage(winnerImageKey) {
        const imageBase64 = localStorage.getItem(winnerImageKey);
        if (imageBase64) {
            const image = new Image();
            image.onload = () => {
                this.textures.addImage(winnerImageKey, image);
                this.add.image(800, 700, winnerImageKey).setScale(1.3);
            };
            image.src = imageBase64;
        } else {
            this.add.image(800, 700, 'kalkaboot').setScale(1.3);
        }
    }

    createFireworks() {
        const music = this.sound.add('celebrateMusic', { volume: 1 });
        music.play();

        this.time.addEvent({
            delay: 500,
            callback: () => {
                const x = Phaser.Math.Between(50, 750);
                const y = Phaser.Math.Between(50, 550);
                const firework = this.add.image(x, y, 'fireworks').setScale(0);
                this.tweens.add({
                    targets: firework,
                    scale: { from: 0, to: 1.5 },
                    alpha: { from: 1, to: 0 },
                    duration: 2000,
                    ease: 'Cubic.easeOut',
                    onComplete: () => firework.destroy()
                });
            },
            repeat: 100
        });
    }

    createRestartButton() {
        const buttonWidth = 200;
        const buttonHeight = 60;
        const buttonX = 960 - buttonWidth / 2;
        const buttonY = 850;

        const buttonBackground = this.add.graphics({ fillStyle: { color: 0x008000 } });
        buttonBackground.fillRoundedRect(buttonX, buttonY, buttonWidth, buttonHeight, 20);

        const restartButton = this.add.text(960, 881, 'Restart', {
            fontSize: '32px', fill: '#FFFFFF', fontFamily: 'Arial', fontStyle: 'bold'
        }).setOrigin(0.5).setInteractive().on('pointerdown', () => window.location.href = 'restart.html');

        restartButton.on('pointerover', () => restartButton.setStyle({ fill: '#fff' }));
        restartButton.on('pointerout', () => restartButton.setStyle({ fill: '#FFFFFF' }));
    }
}

export default EndingScene;
