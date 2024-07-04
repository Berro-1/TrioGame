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
            // Stop the music from the Boot scene
            var music = this.game.registry.get('html5Audio');
            if (music) {
                music.pause();  // Stop the audio
                music.currentTime = 0;  // Reset the playback position
            }
        const gameData = this.loadData();
        const winnerName = this.determineWinner(gameData);

        this.add.image(960, 540, 'castle'); 
        const princess = this.add.image(1050, 700, 'princess');

        const winnerImageKey = localStorage.getItem('winnerImage') || 'kalkaboot';
        const winner = this.add.image(800, 700, winnerImageKey).setScale(1.3);  

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
        if (gameData.player1Coins > gameData.player2Coins) {
            return 'Player 1';
        } else if (gameData.player2Coins > gameData.player1Coins) {
            return 'Player 2';
        } else {
            return 'Draw';  
        }
    }

    createFireworks() {
        const music = this.sound.add('celebrateMusic', { volume: 0.5 });
        music.play();

        this.time.addEvent({
            delay: 500,
            callback: () => {
                const x = Phaser.Math.Between(50, 750);
                const y = Phaser.Math.Between(50, 550);
                const firework = this.add.image(x, y, 'fireworks').setScale(0);

                this.tweens.add({
                    targets: firework,
                    scale: { from: 0, to: 1.5},
                    alpha: { from: 1.5, to: 0 },
                    duration: 2000,
                    ease: 'Cubic.easeOut',
                    onComplete: () => {
                        firework.destroy();
                    }
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
            fontSize: '32px',
            fill: '#FFFFFF', 
            fontFamily: 'Arial', 
            fontStyle: 'bold'
        })
        .setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => {
            window.location.href = '../../pages/finalPage.html';
        });

        restartButton.on('pointerover', () => {
            restartButton.setStyle({ fill: '#fff' });
            buttonBackground.fillStyle(0x00E700, 1);
            buttonBackground.fillRoundedRect(buttonX, buttonY, buttonWidth, buttonHeight, 20);
        });

        restartButton.on('pointerout', () => {
            restartButton.setStyle({ fill: '#FFFFFF' }); 
            buttonBackground.fillStyle(0x008000, 1);
            buttonBackground.fillRoundedRect(buttonX, buttonY, buttonWidth, buttonHeight, 20);
        });

        restartButton.on('pointerdown', () => {
            restartButton.setStyle({ fill: '#0f0' });
            buttonBackground.fillStyle(0x555555, 1); 
            buttonBackground.fillRoundedRect(buttonX, buttonY, buttonWidth, buttonHeight, 20);
        });
    }
}

   


export default EndingScene;
