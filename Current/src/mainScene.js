function init() {
	this.enemyMinY = 80;
	this.enemyMaxY = 500;    
}

// ------------------------------------------------
function preload ()
{
	this.load.spritesheet('paladin', 'assets/Paladin.png', {frameWidth: 16, frameHeight: 16, endFrame: 2})
	this.load.spritesheet('tool', 'assets/Tool.png', {frameWidth: 16, frameHeight: 16, endFrame: 22});
	this.load.spritesheet('player', 'assets/Player.png', {frameWidth: 16, frameHeight: 16});
	this.load.spritesheet('tileSet', 'assets/Tile.png', {frameWidth: 16, frameHeight: 16});
	this.load.spritesheet('bomb', 'assets/Explosion.png', {frameWidth: 96, frameHeight: 96});
	this.load.spritesheet('spells', 'assets/Spells.png', {frameWidth: 16, frameHeight: 16});
	this.load.spritesheet('shortWeapon', 'assets/ShortWeapon.png', {frameWidth: 16, frameHeight: 16})
	this.load.image('background', 'assets/background.png');
}

// ------------------------------------------------
function create()
	{
		var background = this.add.image(0, 0, 'background')
		background.setOrigin(0, 0);
		background.setScale(0.5);
		
		this.enemies = this.add.group({
				key: 'player',
				repeat: 3,
				setXY: {
						x: 230,
						y: 300,
						stepX: 120,
						stepY: 60
				},
				setScale: {
						x: 2.6,
						y: 3
				}
		});


		this.magicalLadel = this.add.sprite(700, 300, 'tool', 15);
		this.magicalLadel.setScale(3);

		this.player = this.add.sprite(100, 300, 'paladin', 0);
		this.player.setScale(3.3);
		this.player.isAlive = true;

		var playerAnimation = {
				key: 'playerAnimation',
				frames: 'paladin',
				frameRate: 7,
				repeat: 0
		};
		this.playerAnimation = this.anims.create(playerAnimation);

		let enemyEntities = this.enemies.getChildren();
		for (var i = 0; i < enemyEntities.length; i++) {
			var randomSpeed = Math.random() * 3;
			enemyEntities[i].speed = randomSpeed > 2 ? randomSpeed : randomSpeed + 3;
		}

		this.bomb = this.add.sprite(-100, -300, 'bomb', 0)
		this.bomb.setScale(2)
		
		this.spell = this.add.sprite(1000, 1000, 'shortWeapon', 9).setScale(2);
		var gameInstance = this
		this.input.keyboard.on('keydown-ESC', function(){
			gameInstance.spell.x = gameInstance.player.x;
			gameInstance.spell.y = gameInstance.player.y;
			
			gameInstance.time.delayedCall(450, function() {
				gameInstance.spell.x = 1000;
				gameInstance.spell.y = 1000;
				}, [], this);
			
		})
	}
	
// ------------------------------------------------------
function update()
{
	if (!this.player.isAlive) {return};
	
	if (this.input.activePointer.leftButtonDown()) {
	this.player.x += 4;
	if (!hasAnimationStarted) {
		this.player.play(this.playerAnimation);
		hasAnimationStarted = true;
		this.time.delayedCall(300, function() {hasAnimationStarted = false}, [], this)
	}
};
	if (this.input.activePointer.leftButtonReleased()) {
		hasAnimationStarted = false;
	}

	let enemyEntities = this.enemies.getChildren();

	for (var i = 0; i < enemyEntities.length; i++) {
		if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), enemyEntities[i].getBounds())) {
		this.player.isAlive = false;
		this.bomb.x = this.player.x;
		this.bomb.y = this.player.y;
		const explosionAnimation = {
			key: 'explosion',
			frames: 'bomb',
			frameRate: 15,
			repeat: -1 
		};
		var explosion = this.anims.create(explosionAnimation);
		this.bomb.play(explosion);
		// this.cameras.main.shake(500);
		this.time.delayedCall(250, function() {this.cameras.main.fade(250)}, [], this);
		this.time.delayedCall(500, function() {this.scene.restart()}, [], this)
		}
		if (enemyEntities[i].y > this.enemyMaxY) 
		{
			enemyEntities[i].speed *= -1;
		} else if (enemyEntities[i].y < this.enemyMinY) 
		{
			enemyEntities[i].speed *= -1;	
		}
		enemyEntities[i].y += enemyEntities[i].speed
	}

	if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.magicalLadel.getBounds())) 
	{
		this.player.isAlive = false;
		this.time.delayedCall(250, function() {this.cameras.main.fade(250)}, [], this);
		this.time.delayedCall(500, function() {this.scene.restart()}, [], this);
	}
	
	if (this.spell) {
		this.spell.x += 7;
		
	const explosionAnimation = {
			key: 'explosion',
			frames: 'bomb',
			frameRate: 15,
			repeat: 0 
			};
			
	var explosion = this.anims.create(explosionAnimation);
		
	var gameInstance = this;
	for (var i = 0; i < enemyEntities.length; i++) {
		if (Phaser.Geom.Intersects.RectangleToRectangle
		(enemyEntities[i].getBounds(), this.spell.getBounds())) {
			enemyEntities[i].destroy();
			this.bomb.x = this.spell.x;
			this.bomb.y = this.spell.y;
			this.bomb.play(explosion);
			gameInstance.spell.x = 1000;
			gameInstance.spell.y = 1000;
			
			gameInstance.time.delayedCall(800, function() {
				gameInstance.bomb.x = 1000;
				gameInstance.bomb.y = 1000;
				}, [], this);
			}
		}		
	}
};

