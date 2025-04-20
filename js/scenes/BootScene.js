export default class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Loading screen
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(this.cameras.main.width / 2 - 160, this.cameras.main.height / 2 - 25, 320, 50);
        
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Loading text
        const loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'טוען...',
            style: {
                font: '20px Arial',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);
        
        // Progress percentage text
        const percentText = this.make.text({
            x: width / 2,
            y: height / 2,
            text: '0%',
            style: {
                font: '18px Arial',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);
        
        // Update progress bar
        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(this.cameras.main.width / 2 - 150, this.cameras.main.height / 2 - 15, 300 * value, 30);
            percentText.setText(parseInt(value * 100) + '%');
        });
        
        // Clear progress bar when complete
        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
        });
        
        // Load assets
        this.loadAssets();
    }

    loadAssets() {
        // Character
        this.load.image('player', 'assets/images/player.png');
        
        // Game objects
        this.load.image('pipe', 'assets/images/pipe.png');
        this.load.image('ground', 'assets/images/ground.png');
        this.load.image('background', 'assets/images/background.png');
        
        // UI elements
        this.load.image('title', 'assets/images/title.png');
        this.load.image('button', 'assets/images/button.png');
        this.load.image('announcement', 'assets/images/announcement.png');
        
        // Particle
        this.load.image('pixel', 'assets/images/pixel.png');
        
        // Audio
        this.load.audio('flap', 'assets/audio/flap.mp3');
        this.load.audio('score', 'assets/audio/score.mp3');
        this.load.audio('hit', 'assets/audio/hit.mp3');
        this.load.audio('reveal', 'assets/audio/reveal.mp3');
    }

    create() {
        this.scene.start('MainMenuScene');
    }
} 