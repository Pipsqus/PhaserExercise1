const explosionAnimation = {
	key: 'explosion',
	frames: 'bomb',
	frameRate: 15,
	repeat: 0 
};

class uiScene extends Phaser.Scene {
constructor(mainSceneConfig) {
		super(mainSceneConfig)
}

preload() {
		this.load.spritesheet('spells', 'assets/Spells.png', {frameWidth: 16, frameHeight: 16});
}

create() {
	this.spell = this.add.sprite(game.scene.getAt(0).player.x, game.scene.getAt(0).player.y, 'spells', 3);
	this.input.keyboard.on('keydown-SPACE', function(){})
	
}

update() {
	if (this.spell) {
		this.spell.x += 4;
		
			let enemyEntities = game.scene.getAt(0).enemies.getChildren();
	for (var i = 0; i < enemyEntities.length; i++) {
		if (Phaser.Geom.Intersects.RectangleToRectangle
		(enemyEntities[i].getBounds(), this.spell.getBounds())) {
			enemyEntities[i].destroy();
			game.scene.getAt(0).bomb.x = this.spell.x;
			game.scene.getAt(0).bomb.y = this.spell.y;
			var explosion = this.anims.create(explosionAnimation);
			this.spell.destroy();
			}
		}		
	}
	this.time.delayedCall(350, function() {this.spell.destroy()}, [], this);
	}
}
