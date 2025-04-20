export default class AnnouncementScene extends Phaser.Scene {
    constructor() {
        super('AnnouncementScene');
    }

    create() {
        // Add background
        const bg = this.add.image(0, 0, 'background');
        bg.setOrigin(0, 0);
        bg.displayWidth = this.sys.game.config.width;
        bg.displayHeight = this.sys.game.config.height;
        
        // Dim the background
        const dimOverlay = this.add.rectangle(
            0, 0,
            this.cameras.main.width,
            this.cameras.main.height,
            0x000000, 0.7
        );
        dimOverlay.setOrigin(0, 0);
        
        // Add congratulations text
        const congratsText = this.add.text(
            this.cameras.main.width / 2,
            100,
            '!מזל טוב',
            {
                font: '36px Arial',
                fill: '#ffffff',
                stroke: '#000000',
                strokeThickness: 6
            }
        );
        congratsText.setOrigin(0.5);
        
        // Add envelope or letter
        const envelope = this.add.image(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 - 50,
            'announcement'
        );
        envelope.setOrigin(0.5);
        envelope.setScale(0);
        
        // Play reveal sound
        const revealSound = this.sound.add('reveal');
        revealSound.play();
        
        // Animate envelope appearance
        this.tweens.add({
            targets: envelope,
            scale: 1,
            duration: 1000,
            ease: 'Back.out',
            onComplete: () => {
                this.showMessage();
            }
        });
        
        // Add restart button
        const restartButton = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height - 100,
            'שחק שוב',
            {
                font: '24px Arial',
                fill: '#ffffff',
                stroke: '#000000',
                strokeThickness: 4,
                padding: { x: 20, y: 10 }
            }
        );
        restartButton.setOrigin(0.5);
        
        // Create a background for the button
        const buttonBg = this.add.rectangle(
            this.cameras.main.width / 2,
            this.cameras.main.height - 100,
            restartButton.width + 20,
            restartButton.height + 10,
            0x4a752c
        );
        buttonBg.setOrigin(0.5);
        buttonBg.setStrokeStyle(2, 0x000000);
        
        // Make sure the text is on top of the background
        buttonBg.depth = 1;
        restartButton.depth = 2;
        
        // Make button interactive
        buttonBg.setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.restartGame())
            .on('pointerover', () => buttonBg.fillColor = 0x5a853c)
            .on('pointerout', () => buttonBg.fillColor = 0x4a752c);
    }
    
    showMessage() {
        // Add the announcement message
        const message = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 + 100,
            '!המשפחה שלנו מתרחבת\n\nאוחנה הקטן בדרך!',
            {
                font: '28px Arial',
                fill: '#ffffff',
                stroke: '#000000',
                strokeThickness: 5,
                align: 'center'
            }
        );
        message.setOrigin(0.5);
        message.alpha = 0;
        
        // Animate the message appearance
        this.tweens.add({
            targets: message,
            alpha: 1,
            y: this.cameras.main.height / 2 + 80,
            duration: 1000,
            ease: 'Power2'
        });
        
        // Add confetti effect
        this.createConfetti();
    }
    
    createConfetti() {
        // Create confetti particles
        const confettiColors = [0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00, 0xFF00FF, 0x00FFFF];
        
        // Create a particle emitter manager for each color
        confettiColors.forEach((color, index) => {
            // Create emitter configuration
            const emitterConfig = {
                frame: 'pixel',
                lifespan: 6000,
                speed: { min: 100, max: 300 },
                scale: { start: 0.2, end: 0.1 },
                gravityY: 300,
                quantity: 1,
                frequency: 200 + (index * 50),
                rotate: { min: 0, max: 360 },
                tint: [color],
                emitZone: {
                    type: 'random',
                    source: new Phaser.Geom.Rectangle(0, -10, this.cameras.main.width, 1)
                }
            };
            
            // Create particles
            const particles = this.add.particles(0, 0, 'pixel', emitterConfig);
            
            // Stop after a few seconds
            this.time.delayedCall(3000, () => {
                particles.destroy();
            });
        });
        
        // Also add some simple falling shapes as a backup
        for (let i = 0; i < 100; i++) {
            const x = Phaser.Math.Between(0, this.cameras.main.width);
            const y = -10;
            const size = Phaser.Math.Between(5, 15);
            const color = confettiColors[Phaser.Math.Between(0, confettiColors.length - 1)];
            
            const confetti = this.add.rectangle(x, y, size, size, color);
            confetti.setAlpha(0.8);
            
            this.tweens.add({
                targets: confetti,
                y: this.cameras.main.height + 20,
                x: x + Phaser.Math.Between(-100, 100),
                rotation: Phaser.Math.Between(0, 6.28),
                duration: Phaser.Math.Between(2000, 6000),
                ease: 'Linear',
                onComplete: () => {
                    confetti.destroy();
                }
            });
        }
    }
    
    restartGame() {
        this.scene.start('MainMenuScene');
    }
} 