export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        // Set up game variables
        this.gameStarted = false;
        this.gameOver = false;
        this.score = 0;
        this.targetScore = 10; // Score needed to trigger the announcement
        this.pipeGap = 200; // Gap between pipes
        this.pipeDelay = 1500; // Time between pipe spawns
        this.pipeSets = []; // Track pipe pairs for scoring

        // Add background
        const bg = this.add.image(0, 0, 'background');
        bg.setOrigin(0, 0);
        bg.displayWidth = this.sys.game.config.width;
        bg.displayHeight = this.sys.game.config.height;

        // Create groups
        this.pipes = this.physics.add.group();
        
        // Add ground
        this.ground = this.physics.add.sprite(this.cameras.main.width / 2, this.cameras.main.height - 20, 'ground');
        this.ground.setOrigin(0.5, 0.5);
        this.ground.displayWidth = this.cameras.main.width;
        this.ground.setImmovable(true);
        this.ground.body.allowGravity = false;
        
        // Add player
        this.player = this.physics.add.sprite(80, this.cameras.main.height / 2, 'player');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.player.body.allowGravity = false; // We'll enable gravity when game starts
        
        // Score text
        this.scoreText = this.add.text(
            this.cameras.main.width / 2, 
            50, 
            '0', 
            { 
                font: '32px Arial', 
                fill: '#ffffff',
                stroke: '#000000',
                strokeThickness: 6
            }
        );
        this.scoreText.setOrigin(0.5);
        
        // Start text
        this.tapText = this.add.text(
            this.cameras.main.width / 2, 
            this.cameras.main.height / 2, 
            'הקליקו כדי להתחיל', 
            { 
                font: '24px Arial', 
                fill: '#ffffff',
                stroke: '#000000',
                strokeThickness: 4
            }
        );
        this.tapText.setOrigin(0.5);
        
        // Set up collisions
        this.physics.add.collider(this.player, this.ground, this.hitObstacle, null, this);
        this.physics.add.collider(this.player, this.pipes, this.hitObstacle, null, this);
        
        // Add input
        this.input.on('pointerdown', this.flap, this);
        
        // Add sounds
        this.flapSound = this.sound.add('flap');
        this.scoreSound = this.sound.add('score');
        this.hitSound = this.sound.add('hit');
    }

    startGame() {
        if (this.gameStarted) return;
        
        this.gameStarted = true;
        this.player.body.allowGravity = true;
        
        // Remove tap text
        this.tapText.setVisible(false);
        
        // Start pipe timer
        this.pipeTimer = this.time.addEvent({
            delay: this.pipeDelay,
            callback: this.addPipes,
            callbackScope: this,
            loop: true
        });
    }

    flap() {
        if (!this.gameStarted) {
            this.startGame();
        }
        
        if (this.gameOver) return;
        
        // Make player jump
        this.player.setVelocityY(-350);
        
        // Play sound
        this.flapSound.play();
        
        // Rotate player
        this.tweens.add({
            targets: this.player,
            angle: -15,
            duration: 100,
            ease: 'Linear',
            yoyo: true
        });
    }

    addPipes() {
        if (this.gameOver) return;
        
        // Calculate random pipe position - adjust min/max positions to prevent floating appearance
        const hole = Phaser.Math.Between(150, this.cameras.main.height - 200);
        
        // Create top pipe
        const topPipe = this.pipes.create(this.cameras.main.width + 20, hole - this.pipeGap/2, 'pipe');
        topPipe.setOrigin(0.5, 1); // Origin at bottom center
        topPipe.body.allowGravity = false;
        topPipe.setImmovable(true);
        topPipe.setVelocityX(-200);
        
        // Create bottom pipe
        const bottomPipe = this.pipes.create(this.cameras.main.width + 20, hole + this.pipeGap/2, 'pipe');
        bottomPipe.setOrigin(0.5, 0); // Origin at top center
        bottomPipe.body.allowGravity = false;
        bottomPipe.setImmovable(true);
        bottomPipe.setVelocityX(-200);
        
        // Store the pipe pair for scoring
        const pipeSet = {
            topPipe: topPipe,
            bottomPipe: bottomPipe,
            scored: false,
            x: this.cameras.main.width + 20
        };
        
        this.pipeSets.push(pipeSet);
    }

    hitObstacle() {
        if (this.gameOver) return;
        
        this.gameOver = true;
        this.hitSound.play();
        
        // Stop pipes
        this.pipes.setVelocityX(0);
        if (this.pipeTimer) this.pipeTimer.remove();
        
        // Game over animation
        this.player.setTint(0xff0000);
        this.player.body.allowGravity = false;
        this.player.body.velocity.y = 0;
        
        // Restart game after a delay
        this.time.delayedCall(1500, () => {
            this.scene.restart();
        });
    }

    checkScore() {
        // Filter out pipe sets that are no longer in the game
        this.pipeSets = this.pipeSets.filter(pipeSet => 
            pipeSet.topPipe.active && pipeSet.bottomPipe.active);
            
        // Check each pipe set for scoring
        for (let i = 0; i < this.pipeSets.length; i++) {
            const pipeSet = this.pipeSets[i];
            
            // If pipe set is not scored and the player has passed it
            if (!pipeSet.scored && pipeSet.topPipe.x + pipeSet.topPipe.width/2 < this.player.x) {
                pipeSet.scored = true;
                this.score += 1;
                this.scoreText.setText(Math.floor(this.score));
                this.scoreSound.play();
                
                // Check if target score is reached
                if (Math.floor(this.score) >= this.targetScore) {
                    this.revealAnnouncement();
                }
            }
        }
    }

    revealAnnouncement() {
        // Stop the game
        this.gameOver = true;
        this.pipes.setVelocityX(0);
        if (this.pipeTimer) this.pipeTimer.remove();
        
        // Freeze player
        this.player.body.allowGravity = false;
        this.player.body.velocity.y = 0;
        
        // Transition to announcement scene
        this.time.delayedCall(1000, () => {
            this.scene.start('AnnouncementScene');
        });
    }

    update() {
        if (this.gameOver) return;
        
        // Rotate player based on velocity
        if (this.gameStarted && this.player.body.velocity.y > 0) {
            if (this.player.angle < 90) {
                this.player.angle += 2;
            }
        }
        
        // Remove pipes that have gone off screen
        this.pipes.getChildren().forEach(pipe => {
            if (pipe.x < -pipe.width) {
                pipe.destroy();
            }
        });
        
        // Check for score
        if (this.gameStarted) {
            this.checkScore();
        }
    }
} 