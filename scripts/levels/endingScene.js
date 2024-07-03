class EndingScene extends Phaser.Scene {
    constructor() {
        super({ key: "EndingScene" });
    }

    preload() {
        this.load.image('castle', '../../assets/Images/aisle.png');
        this.load.image('princess', '../../assets/Images/princess.png');
        this.load.image('kalkaboot', '../../assets/Images/kalkaboot.png'); // Default image
        this.load.image('fireworks', '../../assets/Images/fireworks.png');
        this.load.audio('celebrateMusic', '../../assets/audio/wedding_march.mp3');
    }

    create() {
        // Load game data and determine the winner
        const gameData = this.loadData();
        const winnerName = this.determineWinner(gameData);

        // Set the background image
        this.add.image(960, 540, 'castle'); 
        const princess = this.add.image(1050, 700, 'princess');

        // Load winner image from local storage or default
        const winnerImageKey = localStorage.getItem('winnerImage') || 'kalkaboot';
        const winner = this.add.image(800, 700, winnerImageKey).setScale(1.3);  // Adjust scale accordingly

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
            return 'Draw';  // Handle a draw situation
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
        // Define button dimensions
        const buttonWidth = 200;
        const buttonHeight = 60;
        const buttonX = 960 - buttonWidth / 2; // Centered on a 1920 width screen
        const buttonY = 850; // Adjust the Y position as needed

        // Create a graphics object for the button background
        const buttonBackground = this.add.graphics({ fillStyle: { color: 0x008000 } });
        buttonBackground.fillRoundedRect(buttonX, buttonY, buttonWidth, buttonHeight, 20);

        // Create the text for the button
        const restartButton = this.add.text(960, 881, 'Restart', {
            fontSize: '32px',
            fill: '#FFFFFF', // White text color
            fontFamily: 'Arial', // Specify the font family
            fontStyle: 'bold' // Bold text
        })
        .setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => {
            window.location.href = 'restart.html';
        });

        // Hover and interaction styles
        restartButton.on('pointerover', () => {
            restartButton.setStyle({ fill: '#fff' }); // Yellow text on hover
            buttonBackground.fillStyle(0x00E700, 1); // Lighter green background on hover
            buttonBackground.fillRoundedRect(buttonX, buttonY, buttonWidth, buttonHeight, 20);
        });

        restartButton.on('pointerout', () => {
            restartButton.setStyle({ fill: '#FFFFFF' }); // White text normally
            buttonBackground.fillStyle(0x008000, 1); // Dark green background normally
            buttonBackground.fillRoundedRect(buttonX, buttonY, buttonWidth, buttonHeight, 20);
        });

        restartButton.on('pointerdown', () => {
            restartButton.setStyle({ fill: '#0f0' }); // Bright green text on click
            buttonBackground.fillStyle(0x555555, 1); // Dark gray background on click
            buttonBackground.fillRoundedRect(buttonX, buttonY, buttonWidth, buttonHeight, 20);
        });
    }
}

   


export default EndingScene;
