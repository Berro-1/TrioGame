class Boot extends Phaser.Scene {
    constructor() {
        super('Boot');
    }

    create() {
        var theme = document.createElement('audio');
        theme.setAttribute('src', '../../assets/audio/theme.mp3');

        // Set the volume
        theme.volume = 0.5; // Set volume to 50%

        // Start playing the audio
        theme.play();

        // Store the audio element in the Phaser registry for global access
        this.game.registry.set('themeMusic', theme);

        this.scene.start('Preloader');
    }
}

export default Boot;
