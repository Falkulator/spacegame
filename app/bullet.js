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

 	function fire(bullet, force, angle) {

 		bullet.body.setCollisionGroup(cGroups.bulletCollisionGroup);
 		bullet.body.collides([  cGroups.shipCollisionGroup,
 								cGroups.planetCollisionGroup,
 								cGroups.bulletCollisionGroup]);

 		//bullet.body.collides(pandaCollisionGroup, hitPanda, this);
 		bullet.body.mass = 2;
 		bullet.body.force.x = Math.cos(angle) * force;
 		bullet.body.force.y = Math.sin(angle) * force;

 	}

 	function update() {

 	}

		
		return {
			init: init,
			update: update,
			fire: fire
		}
	 


}