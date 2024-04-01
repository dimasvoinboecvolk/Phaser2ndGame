var config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    parent: game,
    playerSpeed: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var platforms;
var score = 0;
var scoreText;
var gameOver = false;
var stars;
var bombs;
var worldWidth = 9600;
var live = 3;
var life = 3;
var lifeText;
var lifeLine;
var textLine;


var game = new Phaser.Game(config);

function preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    this.load.image('enemy', 'assets/enemy.png');
    this.load.image('enemy2', 'assets/enemy.png');
    this.load.image('asset1', 'assets/asset1.png');
    this.load.image('asset2', 'assets/asset2.png');
    this.load.image('asset3', 'assets/asset3.png');
    this.load.image('heart', 'assets/heart.png');
    this.load.image('spike', 'assets/spike.png');
    

    //повітряні платформи
    this.load.image('skyGroundStart', 'assets/14.png');
    this.load.image('skyGround', 'assets/15.png');
    this.load.image('skyGroundEnd', 'assets/16.png');
}




var platforms;

function create() {
    //  this.add.image(960, 550, 'sky');
    this.add.tileSprite(0, 0, worldWidth, 1080, "sky")
        .setOrigin(0, 0)
        .setDepth(0);


    platforms = this.physics.add.staticGroup();

    for (var x = 0; x < worldWidth; x = x + 250) {
        console.log(x)
        platforms.create(x, 1080 - 120, 'ground').setOrigin(0, 0).refreshBody();
    }


    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });


    lifeText = this.add.text(1500, 100, showLife(), { fontSize: '40px', fill: '#FFF' })
        .setOrigin(0, 0)
        .setScrollFactor(0)


        


    //створення гравця
    player = this.physics.add.sprite(100, 450, 'dude');

    player
        .setBounce(0.2)
        .setDepth(5)
        .setCollideWorldBounds(true);

    //налаштування кмери
    this.cameras.main.setBounds(0, 0, worldWidth, 1080);
    this.physics.world.setBounds(0, 0, worldWidth, 1080);

   
    //слідкування камери
    this.cameras.main.startFollow(player);

    rock = this.physics.add.staticGroup();

    for (var x = 0; x < worldWidth; x = x + Phaser.Math.FloatBetween(300, 500)) {

        rock.create(x, 1080 - 128, 'asset1')
            .setOrigin(0, 0.8)
            .setScale(Phaser.Math.FloatBetween(0.3, 0.9))
            .setDepth(Phaser.Math.Between(1, 10));

    }

    for (var x = 0; x < worldWidth; x = x + Phaser.Math.FloatBetween(100, 200)) {

        rock.create(x, 1080 - 128, 'asset2')
            .setOrigin(0, 0.8)
            .setScale(Phaser.Math.FloatBetween(0.3, 0.9))
            .setDepth(Phaser.Math.Between(1, 10));

    }


    for (var x = 0; x < worldWidth; x = x + Phaser.Math.FloatBetween(400, 700)) {

        rock.create(x, 1080 - 128, 'asset3')
            .setOrigin(0, 0.8)
            .setScale(Phaser.Math.FloatBetween(0.3, 0.9))
            .setDepth(Phaser.Math.Between(1, 10));

    }


    //рандомне розміщення платформ
    for (var x = 0; x < worldWidth; x = x + 650) {
        var y = Phaser.Math.FloatBetween(300, 700)
        // ліво
        platforms.create(x, y, 'skyGroundStart')
            .setOrigin(0, 0)
            .refreshBody();
        // центр
        platforms.create(x + 128, y, 'skyGround')
            .setOrigin(0, 0)
            .refreshBody();
        // право
        platforms.create(x + 128 * 2, y, 'skyGroundEnd')
            .setOrigin(0, 0)
            .refreshBody();

        // Bigplatforms.create(x, 1080 - 50, 'BigP').setOrigin(0, 0).refreshBody();
    }



    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    this.physics.add.collider(player, platforms);

    cursors = this.input.keyboard.createCursorKeys();

    stars = this.physics.add.group({
        key: 'star',
        repeat: 60,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    stars.children.iterate(function (child) {

        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });

    this.physics.add.collider(stars, platforms);

    this.physics.add.overlap(player, stars, collectStar, null, this)

    bombs = this.physics.add.group();

    this.physics.add.collider(bombs, platforms);

    this.physics.add.collider(player, bombs, hitBomb, null, this);

    this.add.text(450, 450, 'good luck', { fontSize: '50px', fill: '#456' });

    enemy = this.physics.add.sprite(600, 400, 'enemy');
    enemy.setCollideWorldBounds(true);
    enemy.setVelocityX(-100); // Example: enemy moves left
    
    this.physics.add.collider(enemy, platforms); // Ensure enemy collides with platforms
    this.physics.add.collider(player, enemy, hitEnemy, null, this)
}



function update() {

    console.log(player.x)

    if (cursors.left.isDown) {
        player.setVelocityX(-config.playerSpeed);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(config.playerSpeed);

        player.anims.play('right', true);
    }
    else {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }

    if (enemy.body.touching.right || enemy.body.blocked.right) {
        enemy.setVelocityX(-100); // Move left

    } else if (enemy.body.touching.left || enemy.body.blocked.left) {
        enemy.setVelocityX(100); // Move right
    }





}

var firstStarCollected = false; // Flag to track if the first star is collected


function collectStar(player, star) {
    star.disableBody(true, true);

    var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
    var bomb = bombs.create(x, 36, 'bomb');
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

    if (stars.countActive(true) === 0) {
        stars.children.iterate(function (child) {
            child.enableBody(true, child.x, 16, true, true);
        });
    }
}


function hitBomb(player, bomb) {
    if (live == 1) this.physics.pause();

    player.setTint(0xff0000);
    live -= 1
    if (life === 0) {
        gameOver = true;
        
    }
}

function hitEnemy(player, enemy) {

    player.setTint(0xff0000); // Tint player red
    player.anims.play('turn'); // Display 'turn' animation for player

    life--; // Decrement lives
    if (life === 0) {
        gameOver = true;
       
}
}


function collectHeart(player, heart) {
    heart.disableBody(true, true); // Remove the heart from the game

    // Restore player's health or apply healing logic here

    // Example: Increase player's health by 1 (adjust as needed)
    player.health += 1;

    // Update the UI or perform other actions to reflect the change in player's health
}


//формування смуги життя
function showLife() {
    var textLine = ''
    for (var i = 0; i < life; i++) {
        textLine = textLine + '💖'
    }
    return textLine
}

//відпрацьовування колізії
function hitHeart(player, heart) {
    heart.disableBody(true, true);
    life += 1
    lifeText.setText(showLife())
    if (life > 10) life = 10;

}



