console.log("v 1.0.14")

let canvas = document.getElementById("canvas");
let game;

const gameOptions = {
    gravity: 700,
    tileSize: 128,
    mainCharacterSpeed: 8,
    mainCharacterJump: 500,
    mainCharacterSlide: 0.88,
    mainCharacterSlideAir: 0.96,
    startHeight: 800,
    characterHeight: 123,
    characterwidth: 64,
    groundSpeed: 40
}

window.onload = function() {
    let Config = {
        type: Phaser.AUTO,
        backgroundColor: "#6666AA",
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: 1920,
            height: 1080,
        },
        pixelArt: true,
        physics: {
            default: "arcade",
            arcade: {
                gravity: {
                    y: 200
                }
            }
        },
        scene: PlayGame
    }

    game = new Phaser.Game(Config)
    window.focus();
}

class PlayGame extends Phaser.Scene {

    constructor() {
        super("PlayGame")
        this.logs = 0;
        this.height = gameOptions.startHeight;
        this.width = -gameOptions.tileSize;
        this.player = 0;
    }


    preload() {
        this.load.image("log", "assets/log.png");
        this.load.image("grass", "assets/ruoho2.png");
        this.load.image("dirt", "assets/keksi.png");
        this.load.image("CoolTree", "assets/coolTree.png");
        this.load.image("tallTree", "assets/Tree128x_384y.png");
        this.load.image("egg", "assets/egg64_64.png");
        this.load.image("slime", "assets/slime64_64.png");
        this.load.image("bird", "assets/mildlyInfuriatedBird.png");
        this.load.spritesheet("MainCharacter", "assets/MainCharacter.png", {frameWidth: gameOptions.characterwidth, frameHeight: gameOptions.characterHeight});
    }

    create() {
        this.logs = 0;
        this.height = gameOptions.startHeight;
        this.width = -gameOptions.tileSize;
        this.player = 0;
        this.ground = this.physics.add.group({
            immovable: true,
            allowGravity: false
        })

        this.trees = this.physics.add.group({
            immovable: false,
            allowGravity: true
        })

        this.pickUps = this.physics.add.group({
            immovable: false,
            allowGravity: true
        })
        this.birds = this.physics.add.group({
            immovable: true,
            allowGravity: false
        })
        this.eggs = this.physics.add.group({
            immovable: true,
            allowGravity: false
        })
        this.slimes = this.physics.add.group({
            immovable: false,
            allowGravity: true
        })


        this.keys = this.input.keyboard.createCursorKeys();
        this.mainCharacter = this.physics.add.sprite(game.config.width / 2, 100, "MainCharacter");
        
        this.mainCharacter.body.velocity.x = 0;
        this.mainCharacter.body.velocity.y = 0;
        this.physics.add.collider(this.mainCharacter, this.ground);
        this.physics.add.collider(this.ground, this.trees);
        this.physics.add.collider(this.ground, this.pickUps);
        this.physics.add.collider(this.ground, this.eggs);
        this.physics.add.collider(this.ground, this.slimes);
        this.physics.add.collider(this.mainCharacter, this.eggs, this.restart, null, this);
        this.physics.add.collider(this.mainCharacter, this.slimes, this.restart, null, this);
        this.physics.add.collider(this.ground);
        this.physics.add.overlap(this.mainCharacter, this.trees, this.chopTree, null, this);
        this.physics.add.overlap(this.mainCharacter, this.pickUps, this.pickUp, null, this); // https://www.youtube.com/watch?v=hkedWHfU_oQ&list=PLDyH9Tk5ZdFzEu_izyqgPFtHJJXkc79no&index=17

        this.add.image(32, 32, "log")
        this.logScore = this.add.text(64, 30, "0", {fontSize: "30px", fill: "#ffffff"})

        this.anims.create({
            key: "walk",
            frames: this.anims.generateFrameNumbers("MainCharacter", {start: 1, end: 4}),
            frameRate: 10,
            repeat: -1
        })
        this.anims.create({
            key: "stand",
            frames: [{key: "MainCharacter", frame: 0}],
            frameRate: 10,
            repeat: -1,
            
        })
        this.anims.create({
            key: "chop",
            frames: this.anims.generateFrameNumbers("MainCharacter", {start: 5, end: 7}),
            frameRate: 5,
            repeat: 0,
            
        })
        this.anims.create({
            key: "pickUp",
            frames: [{key: "MainCharacter", frame: 8}],
            frameRate: 1,
            repeat: 3,
            
        })

        this.builderAnimation = this.time.addEvent({
            callback: this.generateStartArea,
            callbackScope: this,
            delay: 100,
            loop: false,
            repeat: 14 
            //Math.floor((game.config.width + gameOptions.tileSize)/gameOptions.tileSize)
        })
        
        this.newAreaClock = this.time.addEvent({
            callback: this.generateNewArea,
            callbackScope: this,
            delay: 3000,
            loop: true,
            paused: true
        })

        this.generatePlayer = this.time.addEvent({
            callback: this.generateMainCharacter,
            callbackScope: this,
            delay: 1000,
            loop: false
        })
        
        this.eggening = this.time.addEvent({
            callback: this.eggTime,
            callbackScope: this,
            delay: 1600,
            loop: true
        })

        this.slimetime = this.time.addEvent({
            callback: this.slimeTime,
            callbackScope: this,
            delay: 2400,
            loop: true
        })

        this.deletionChecktimer = this.time.addEvent({
            callback: this.deletionCheck,
            callbackScope: this,
            delay: 800,
            loop: true
        })
        

    }

    
    
    update() {
        if(this.player){
            if(this.keys.left.isDown && this.mainCharacter.body.touching.down) {
                this.mainCharacter.anims.play("walk", true)
                this.mainCharacter.body.velocity.x -= gameOptions.mainCharacterSpeed;
                this.mainCharacter.flipX = true;
                if(this.mainCharacter.body.touching.left && this.mainCharacter.body.velocity.y == 0){
                    this.mainCharacter.body.velocity.y -= gameOptions.mainCharacterJump/2;
    
                }
            }
            else if(this.keys.left.isDown) {
                this.mainCharacter.body.velocity.x -= gameOptions.mainCharacterSpeed/4;
            }
            else if(this.keys.right.isDown && this.mainCharacter.body.touching.down) {
                this.mainCharacter.anims.play("walk", true)
                this.mainCharacter.body.velocity.x += gameOptions.mainCharacterSpeed;
                this.mainCharacter.flipX = false;
                if(this.mainCharacter.body.touching.right && this.mainCharacter.body.velocity.y == 0){
                    this.mainCharacter.body.velocity.y -= gameOptions.mainCharacterJump/2;
    
                }
            }
            else if(this.keys.right.isDown) {
                this.mainCharacter.body.velocity.x += gameOptions.mainCharacterSpeed/4;
            }
            else if (this.mainCharacter.body.touching.down){
                this.mainCharacter.body.velocity.x = this.mainCharacter.body.velocity.x * gameOptions.mainCharacterSlide;
                if(this.mainCharacter.body.velocity.x < 0.6 && this.mainCharacter.body.velocity.x > -0.6){
                    this.mainCharacter.body.velocity.x = 0; 
                } 
            }
            else{
                this.mainCharacter.body.velocity.x = this.mainCharacter.body.velocity.x * gameOptions.mainCharacterSlideAir;
            }
            
            if(this.keys.space.isDown && this.mainCharacter.body.velocity.y == 0) {
                this.mainCharacter.anims.play("chop", true);
            } else if (this.mainCharacter.body.velocity.x == 0){
                this.mainCharacter.anims.play("stand", true)
            }
    
    
            if(this.keys.up.isDown && this.mainCharacter.body.touching.down && this.mainCharacter.body.velocity.y == 0) {
                this.mainCharacter.body.velocity.y -= gameOptions.mainCharacterJump;
            }
    
            if(this.mainCharacter.y > game.config.height || this.mainCharacter.x < -gameOptions.tileSize) {
                this.restart
            }
        }
        
    }

    generateNewArea(){
        this.height += (Phaser.Math.Between(0, gameOptions.tileSize/2) * Phaser.Math.Between(-1, 1));
        if(this.height < 400) this.height += gameOptions.tileSize/2;
        if(this.height > 1000) this.height -= gameOptions.tileSize/2;
        this.ground.create(this.width, this.height-gameOptions.tileSize, "grass");
        for(let j = this.height; j < game.config.height+gameOptions.tileSize; j+=gameOptions.tileSize){
            this.ground.create(this.width, j, "dirt");
        }
        if(Phaser.Math.Between(1, 4) == 1){
            if(Phaser.Math.Between(1, 10) == 1) this.trees.create(this.width, this.height-gameOptions.tileSize-41-64, "CoolTree");
            else this.trees.create(this.width, this.height-gameOptions.tileSize-(348), "tallTree");
        } else if(Phaser.Math.Between(1, 5) == 1){
            this.birds.create(this.width+gameOptions.tileSize, Phaser.Math.Between(64, 128), "bird")
        } else if(Phaser.Math.Between(1, 2) == 1){
            this.slimes.create(this.width-gameOptions.tileSize, Phaser.Math.Between(64, 128), "slime")
        }


        this.ground.setVelocityX(-gameOptions.groundSpeed);
        this.trees.setVelocityX(-gameOptions.groundSpeed);
        this.pickUps.setVelocityX(-gameOptions.groundSpeed);
        this.birds.setVelocityX(-gameOptions.groundSpeed*3);
    }

    generateStartArea(){
            this.width += gameOptions.tileSize;
            this.height += (Phaser.Math.Between(0, gameOptions.tileSize/2) * Phaser.Math.Between(-1, 1));
            this.ground.create(this.width, this.height-gameOptions.tileSize, "grass");
            for(let j = this.height; j < game.config.height+gameOptions.tileSize; j+=gameOptions.tileSize){
                this.ground.create(this.width, j, "dirt");
            }
            if(Phaser.Math.Between(1, 10) == 1){
                if(Phaser.Math.Between(1, 10) == 1) this.trees.create(this.width, this.height-gameOptions.tileSize-41-64, "CoolTree");
                else this.trees.create(this.width, this.height-gameOptions.tileSize-(348), "tallTree");
            } 
    }

    chopTree(character, tree){
        if(this.keys.space.isDown && this.mainCharacter.body.velocity.y == 0 && this.mainCharacter.body.velocity.x == 0){
            this.pickUps.create(tree.x, tree.y, "log")
            tree.destroy();
        }
    }

    pickUp(character, pickUp){
        this.logs += 1;
        this.logScore.setText(this.logs)
        pickUp.destroy(); 
    }

    generateMainCharacter(){
        this.mainCharacter.body.gravity.y = gameOptions.gravity;
        this.player = 1;
        this.newAreaClock.paused = false;
    }

    eggTime(){

        this.birds.children.entries.forEach(bird => {
            this.eggs.create(bird.x, bird.y, "egg");
        });
        this.eggs.setVelocityX(-gameOptions.groundSpeed*3);
        this.eggs.setVelocityY(gameOptions.gravity);
    }

    slimeTime(){

        this.slimes.children.entries.forEach(slime => {
            if(Phaser.Math.Between(1, 2) == 1 && slime.body.touching.down){
                slime.setVelocityY(-gameOptions.gravity/3)
                if(Phaser.Math.Between(1, 3) == 1){
                    slime.setVelocityX(gameOptions.groundSpeed*2);
                    slime.flipX = true;
                } else if (Phaser.Math.Between(1, 2) == 1){
                    slime.setVelocityX(-gameOptions.groundSpeed*2);
                    slime.flipX = false;
                }
                slime.body.velocity.x = slime.body.velocity.x * gameOptions.mainCharacterSlideAir;
                if(slime.body.velocity.x < 0.9 && slime.body.velocity.x > -0.9){
                    slime.body.velocity.x = 0; 
                } 
            }
        });
        
        
    }

    restart(){
        this.builderAnimation.destroy();
        
        this.newAreaClock.destroy();

        this.generatePlayer.destroy();
        
        this.eggening.destroy();

        this.slimetime.destroy();

        this.deletionChecktimer.destroy();
        
        this.ground.children.entries.forEach(entity => {
                entity.destroy();
        });

        this.trees.children.entries.forEach(entity => {
                entity.destroy();
        });

        this.pickUps.children.entries.forEach(entity => {
                entity.destroy();
        });
        this.birds.children.entries.forEach(entity => {
                entity.destroy();
        }); 
        this.eggs.children.entries.forEach(entity => {
               entity.destroy();
        }); 
        this.slimes.children.entries.forEach(entity => {
                entity.destroy();
        });  

        this.scene.start("PlayGame");
    }

    deletionCheck(){
        this.ground.children.entries.forEach(entity => {
            if(entity.x < -gameOptions.tileSize){
                entity.destroy();
            }
        });

        this.trees.children.entries.forEach(entity => {
            if(entity.x < -gameOptions.tileSize){
                entity.destroy();
            }
        });

        this.pickUps.children.entries.forEach(entity => {
            if(entity.x < -gameOptions.tileSize){
                entity.destroy();
            }
        });
        this.birds.children.entries.forEach(entity => {
            if(entity.x < -gameOptions.tileSize){
                entity.destroy();
            }
        }); 
        this.eggs.children.entries.forEach(entity => {
            if(entity.x < -gameOptions.tileSize || entity.y > game.config.height + gameOptions.tileSize){
               entity.destroy();
            }
        }); 
        this.slimes.children.entries.forEach(entity => {
            if(entity.x < -gameOptions.tileSize || entity.y > game.config.height + gameOptions.tileSize){
                entity.destroy();
            }
        });  
    }
}




