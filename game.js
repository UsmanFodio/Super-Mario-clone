
const config = {game.js}
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 500 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

let player, cursors, coins, score = 0, scoreText;
let coinSound, jumpSound, bgMusic;

const game = new Phaser.Game(config);

function preload() {
  this.load.image('bg', 'assets/bg.png');
  this.load.image('platform', 'assets/platform.png');
  this.load.image('coin', 'assets/coin.png');
  this.load.spritesheet('player', 'assets/player.png', { frameWidth: 32, frameHeight: 48 });

  this.load.audio('coinSound', 'assets/coin.wav');
  this.load.audio('jumpSound', 'assets/jump.wav');
  this.load.audio('bgMusic', 'assets/bg_music.mp3');
}

function create() {
  this.add.image(400, 300, 'bg');

  bgMusic = this.sound.add('bgMusic', { loop: true, volume: 0.3 });
  bgMusic.play();

  coinSound = this.sound.add('coinSound');
  jumpSound = this.sound.add('jumpSound');

  const platforms = this.physics.add.staticGroup();
  platforms.create(400, 580, 'platform').setScale(2).refreshBody();
  platforms.create(600, 400, 'platform');
  platforms.create(50, 250, 'platform');

  player = this.physics.add.sprite(100, 450, 'player');
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);
  this.physics.add.collider(player, platforms);

  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'turn',
    frames: [ { key: 'player', frame: 4 } ],
    frameRate: 20
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  });

  cursors = this.input.keyboard.createCursorKeys();

  coins = this.physics.add.group({
    key: 'coin',
    repeat: 9,
    setXY: { x: 50, y: 0, stepX: 70 }
  });

  coins.children.iterate(child => {
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  });

  this.physics.add.collider(coins, platforms);
  this.physics.add.overlap(player, coins, collectCoin, null, this);

  scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });
}

function update() {
  if (cursors.left.isDown) {
    player.setVelocityX(-160);
    player.anims.play('left', true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);
    player.anims.play('right', true);
  } else {
    player.setVelocityX(0);
    player.anims.play('turn');
  }

  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-330);
    jumpSound.play();
  }
}

function collectCoin(player, coin) {
  coin.disableBody(true, true);
  score += 10;
  scoreText.setText('Score: ' + score);
  coinSound.play();
}
