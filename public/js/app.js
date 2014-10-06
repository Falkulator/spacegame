(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
module.exports = function(game) {
 	var cursors;
 	var o_mcamera;

 	function init() {
 		cursors = game.input.keyboard.createCursorKeys();
	
 	} 

	function cameraUpdate() {
		cameraByPointer(game.input.mousePointer);
	    cameraByPointer(game.input.pointer1);


	    if (cursors.up.isDown)
	    {
	        if (cursors.up.shiftKey)
	        {

	        }
	        else
	        {
	            game.camera.y -= 4;
	        }
	    }
	    else if (cursors.down.isDown)
	    {
	        if (cursors.down.shiftKey)
	        {

	        }
	        else
	        {
	            game.camera.y += 4;
	        }
	    }

	    if (cursors.left.isDown)
	    {
	        if (cursors.left.shiftKey)
	        {
	            game.world.rotation -= 0.05;
	        }
	        else
	        {
	            game.camera.x -= 4;
	        }
	    }
	    else if (cursors.right.isDown)
	    {
	        if (cursors.right.shiftKey)
	        {
	            game.world.rotation += 0.05;
	        }
	        else
	        {
	            game.camera.x += 4;
	        }
	    }
	}

	function cameraByPointer(pointer) {
	    if (!pointer.timeDown) { return; }
	    if (pointer.isDown && !pointer.targetObject) {
	        if (o_mcamera) {
	            game.camera.x += o_mcamera.x - pointer.position.x;
	            game.camera.y += o_mcamera.y - pointer.position.y;
	        }
	        o_mcamera = pointer.position.clone();
	    }
	    if (pointer.isUp) { o_mcamera = null; }
	}
		
		return {
			init: init,
			update: cameraUpdate
		}
	 


}
},{}],3:[function(require,module,exports){
module.exports = function(game) {

	var arrow,
		ship,
		angle,
		buttonaim,
		baPosX = 600,
		baPosY = 500,
		bfPosX = 700,
		bfPosY = 500,
		buttonpow,
		target,
		power,
		px,
		py,
		ui,
		aimFlag = false,
		powFlag = false,
		fireFlag = false,
		overview = false;

	function init(arw, shp) {

		//aim arrow
		arrow = arw;
		arrow.anchor.setTo(0.1, 0.5);
	    arrow.alpha = 0;

	    //drag target
		target = game.add.sprite(baPosX, baPosY, 'target');
		target.alpha = 0;

		//drag power meter
		power = game.add.sprite(bfPosX,bfPosY, 'power');
		power.alpha = 0;

		ship = shp;


		buttonaim = game.add.button(baPosX, baPosY, 'buttonaim', null, this, 0, 1, 0, 1);  //game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame
		buttonpow = game.add.button(bfPosX, bfPosY, 'buttonpow', null, this, 0, 1, 0, 1);
		buttonfire = game.add.button(350, bfPosY, 'buttonfire', null, this, 0, 1, 0, 1);
		buttonmap = game.add.button(20, bfPosY, 'buttonfire', null, this, 0, 1, 0, 1);


	    
	    buttonaim.fixedToCamera = true;
	    buttonaim.events.onInputDown.add(setAimTrue);
	    //buttonaim.events.onInputUp.add();

	    
	    buttonpow.fixedToCamera = true;
	    buttonpow.events.onInputDown.add(setPowTrue);
	    //buttonpow.events.onInputUp.add(function(){}); 

	   	buttonfire.fixedToCamera = true;
	    buttonfire.events.onInputUp.add(confirmFire);

	    buttonmap.fixedToCamera = true;
	    buttonmap.events.onInputUp.add(mapOverview);
	    
	}

	function buttonScale() {
		buttonfire.scale.setTo(2,2);
	}

	function confirmFire() {
		fireFlag = true;
	}

	function mapOverview() {
		if (overview) {
			game.world.scale.setTo(1,1);
			uiScale(1);
			overview = false;
		} else {
			game.world.scale.setTo(0.3,0.3);
			uiScale(3);
			overview = true;
		}
		
	}

	function uiScale(x) {
		buttonaim.scale.setTo(x,x);
		buttonpow.scale.setTo(x,x);
		buttonfire.scale.setTo(x,x);
		buttonmap.scale.setTo(x,x);
	}

	function uiRemove() {
		buttonaim.kill();
		buttonpow.kill();
		buttonfire.kill();
		buttonmap.kill();
	}

	function uiRevive() {
		buttonaim.revive();
		buttonpow.revive();
		buttonfire.revive();
		buttonmap.revive();
	}

	function setPowTrue() {
		px = game.input.x;
		py = game.input.y;
		powFlag = true;
	}

	function setAimTrue() {
		aimFlag = true;

	}

	function setAim(x,y) {
		target.x = x;
		target.y = y;
		aimFlag = false;

	}

	function aimFlagCheck() {
		return aimFlag;
	}

	function powFlagCheck() {
		return powFlag;
	}

	function fireFlagCheck() {
		return fireFlag;
	}

	function setFireFalse() {
		fireFlag = false;
	}


	function getAngle() {
		return angle;
	}

	function update() {
		
		if (aimFlag) {
			arrow.alpha = 0.4;
			target.alpha = 0.9;
			if (game.input.mousePointer.isUp) {
				//bullet.fire(ship.x, ship.y , 300, input.getAngle());
				target.x = game.input.worldX;
				target.y = game.input.worldY;
				aimFlag = false;
			}


			target.x = game.input.worldX;
			target.y = game.input.worldY;

			arrow.x = ship.x;
			arrow.y = ship.y;
			angle = game.physics.arcade.angleToPointer(ship);
			arrow.rotation = angle;


		} else if (powFlag) {
			power.x = px + 30;
			power.y = py;
			power.fixedToCamera = true;
			power.alpha = 0.6;
			power.height = -game.physics.arcade.distanceBetween({x:px,y:py}, game.input); //phaser hack for shit ui

			if (game.input.mousePointer.isUp) {
				powFlag = false;
			}

		} else {
			arrow.x = ship.x;
			arrow.y = ship.y;
		}

	}


	return {
		init: init,
		update: update,
		aimFlag: aimFlagCheck,
		powFlag: powFlagCheck,
		fireFlag: fireFlagCheck,
		setFireFalse: setFireFalse,
		getAngle: getAngle
	}
 


}
},{}],4:[function(require,module,exports){



var socket = io.connect('http://127.0.0.1:3000/');



var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

var input = require('./input.js')(game);
var camera = require('./camera.js')(game);
var bullet = require('./bullet.js')(game);
var planet = require('./planet.js')(game);



function preload() {

    game.stage.backgroundColor = '#000000';

    game.load.image('space', 'assets/starfield.jpg');
    game.load.image('ball', 'assets/shinyball.png');
    game.load.image('ship', 'assets/phaser-dude.png');
    game.load.image('arrow', 'assets/longarrow2.png');
    game.load.image('target', 'assets/target.png');
    game.load.image('bullet', 'assets/pixel.png');
    game.load.image('power', 'assets/fusia.png');
    game.load.spritesheet('buttonpow', 'assets/buttons/button-round-a.png',96,96);
    game.load.spritesheet('buttonaim', 'assets/buttons/button-round-b.png',96,96);
    game.load.spritesheet('buttonfire', 'assets/buttons/button-round-a.png',96,96);

}


var arrow;
var ship;
var ships;
var planets;
var bullets;


var debug;

function create() {

    //  Modify the world bounds
    game.world.setBounds(-2000, -2000, 4000, 4000);

    //dev helper. remove in production
    window.game = game;
    camera.init();

    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.setImpactEvents(true);

    var cGroups = {};
	cGroups.shipCollisionGroup = game.physics.p2.createCollisionGroup();
    cGroups.planetCollisionGroup = game.physics.p2.createCollisionGroup();
    cGroups.bulletCollisionGroup = game.physics.p2.createCollisionGroup();
    //  This part is vital if you want the objects with their own collision groups to still collide with the world bounds
    //  (which we do) - what this does is adjust the bounds to use its own collision group.
    game.physics.p2.updateBoundsCollisionGroup();

    game.physics.p2.restitution = 0.55;
    

    bullets = bullet.init(cGroups);
    planets = planet.init(cGroups);
    
    ships = game.add.group();
    ships.enableBody = true;
    ships.physicsBodyType = Phaser.Physics.P2JS;
    
    arrow = game.add.sprite(200, 450, 'arrow');
    ship = ships.create(0,10,'ship');
    ship.body.mass = 5;

    game.physics.p2.enable(ship, false);


   
	input.init(arrow, ship);

    

}



function update() {
	ships.forEachAlive(moveToPlanets,this);
	bullets.forEachAlive(moveToPlanets,this);
    planets.forEachAlive(dontMove, this);
	bullets.update();
	input.update();

	if (input.aimFlag()) {
		
	} else if (input.powFlag()) {

    } else if (input.fireFlag()) {
        bullet.fire(ship.x, ship.y , 300, input.getAngle());
        input.setFireFalse();
    } else {
		camera.update();		
	}
	

}

function render() {

    //game.debug.cameraInfo(game.camera, 32, 32);
    //game.debug.text(debug, 32, 32);

}

function dontMove(obj) {
    obj.body.setZeroVelocity();
}

function moveToPlanets(obj) {
	var fx = [],
		fy = [];

	planets.forEachAlive(function(planet) {
		var xs = obj.x - planet.x;
		xs = xs * xs;
		var ys = obj.y - planet.y;
		ys = ys * ys;
		var dist = (xs + ys)/400;
		var mass = obj.body.mass * planet.body.mass;
		var speed = mass / (dist*dist);

		var angle = Math.atan2(planet.y - obj.y, planet.x - obj.x);

		fx.push(Math.cos(angle) * speed);    
    	fy.push(Math.sin(angle) * speed);

		
	}, this);


	forceChange(obj,fx,fy);  
}

function forceChange(obj, fx, fy) {
	obj.body.force.x = arrSum(fx);
	obj.body.force.y = arrSum(fy);

	//debug += " y - " + obj.body.force.y + " | x - " + obj.body.force.x;
}

function arrSum(arr) {
	var t = 0
		alen = arr.length;

	for (var i=0;i<alen;i++) {
		t += arr[i];
	}

	return t;
}


},{"./bullet.js":1,"./camera.js":2,"./input.js":3,"./planet.js":5}],5:[function(require,module,exports){
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
},{}]},{},[1,2,3,4,5]);
