class Boot extends Phaser.Scene {
    constructor() {
        super('Boot');
    }

    create() {
        var theme = document.createElement('audio')
        theme.setAttribute('src', '../../assets/audio/theme.mp3')
        this.game.registry.set('html5Audio', theme);

        theme.play()
        this.scene.start('Preloader');
    }
}

export default Boot;
