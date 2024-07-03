class Boot extends Phaser.Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        // this.load.image('preloaderBar', 'assets/preloader.png');
    }

    create() {
        var theme = document.createElement('audio')
        theme.setAttribute('src', '../../assets/audio/theme.mp3')
        theme.play()
        this.scene.start('Preloader');
    }
}

export default Boot;
