module.exports = function(game) {
	var bullets,
		cGroups;

 	function init(c) {
 		cGroups = c;
 		bullets = game.add.group();

 		bullets.enableBody = true;
    	bullets.physicsBodyType = Phaser.Physics.P2JS;
    	

    	return bullets;
	
 	} 

 	function fire(shipx, shipy, force, angle) {
		var bullet = bullets.create(shipx, shipy - 23, 'bullet');
 		bullet.body.setCollisionGroup(cGroups.bulletCollisionGroup);
 		bullet.body.collides([  cGroups.shipCollisionGroup,
 								cGroups.planetCollisionGroup,
 								cGroups.bulletCollisionGroup]);

 		bullet.body.collides(cGroups.planetCollisionGroup, hitPlanet, this);
 		bullet.body.mass = 2;
 		bullet.body.velocity.x = Math.cos(angle) * force;
 		bullet.body.velocity.y = Math.sin(angle) * force;



 	}

 	function update() {
 	

 	}

 	function hitPlanet(bullet) {


 	}

 	// function drawForce(bullet) {
 	// 	var graphics = game.add.graphics(0, 0);

	 //    // set a fill and line style
	 // //    graphics.beginFill(0xFFFFFF);
	 // //    graphics.lineStyle(1, 0xffffff, 1);

  // //   	graphics.lineTo(100, 550);
 	// // }

		
		return {
			init: init,
			update: update,
			fire: fire
		}
	 


}