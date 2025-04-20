export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super('MainMenuScene');
    }

    create() {
        // Add background
        const bg = this.add.image(0, 0, 'background');
        bg.setOrigin(0, 0);
        bg.displayWidth = this.sys.game.config.width;
        bg.displayHeight = this.sys.game.config.height;

        // Add title
        const titleText = this.add.text(
            this.cameras.main.width / 2, 
            this.cameras.main.height / 3, 
            'משחק מיוחד', 
            { 
                font: '32px Arial', 
                fill: '#ffffff',
                stroke: '#000000',
                strokeThickness: 6
            }
        );
        titleText.setOrigin(0.5);

        // Add start button
        const startButton = this.add.text(
            this.cameras.main.width / 2, 
            this.cameras.main.height / 2, 
            'התחל', 
            { 
                font: '28px Arial', 
                fill: '#ffffff',
                stroke: '#000000',
                strokeThickness: 4,
                padding: { x: 20, y: 10 }
            }
        );
        startButton.setOrigin(0.5);
        
        // Create a background for the button
        const buttonBg = this.add.rectangle(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            startButton.width + 20,
            startButton.height + 10,
            0x4a752c
        );
        buttonBg.setOrigin(0.5);
        buttonBg.setStrokeStyle(2, 0x000000);
        
        // Make sure the text is on top of the background
        buttonBg.depth = 1;
        startButton.depth = 2;
        
        // Make button interactive
        buttonBg.setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.startGame())
            .on('pointerover', () => buttonBg.fillColor = 0x5a853c)
            .on('pointerout', () => buttonBg.fillColor = 0x4a752c);
            
        // Add instructions
        const instructionsText = this.add.text(
            this.cameras.main.width / 2, 
            this.cameras.main.height * 0.7, 
            'הקליקו כדי לעוף\nהגיעו ל-10 נקודות!', 
            { 
                font: '20px Arial', 
                fill: '#ffffff',
                stroke: '#000000',
                strokeThickness: 3,
                align: 'center'
            }
        );
        instructionsText.setOrigin(0.5);
    }

    startGame() {
        this.scene.start('GameScene');
    }
} 