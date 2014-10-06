module.exports = function(game) {
	var planets,
		cGroups;

 	function init(c) {
 		cGroups = c;
 		planets = game.add.group();

 		planets.enableBody = true;
    	planets.physicsBodyType = Phaser.Physics.P2JS;
    	var num = game.rnd.integerInRange(4, 10);
		for (var i = 0; i < num; i++)
	    {
	    	var mass = game.rnd.integerInRange(500000, 2000000);
	    	var rad = (mass/500000)*64;
	    	var pscale = (rad/64)*4;//for now to scale small shinyball
	        var planet = planets.create(game.world.randomX, game.world.randomY, 'ball');
	        planet.body.mass = mass;
	        planet.scale.set(pscale, pscale);
	        planet.body.setCircle(rad);
	        game.physics.p2.enable(planet);
	    }

	    var planet = planets.create(0, 140, 'ball');

        game.physics.p2.enable(planet);
        planet.body.mass = 500000;
        planet.scale.set(4, 4);
        planet.body.setCircle(64);
        //planet.body.kinematic = true;

    	return planets;
	
 	} 



 	function update() {
 	

 	}


		
	return {
		init: init,
		update: update
	}
	 


}