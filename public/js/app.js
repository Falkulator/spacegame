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
		buttonfire,
		aimFlag = false;

	function init(arrw, buttonfire, buttonaim, shp) {
		arrow = arrw;
		ship = shp;
		buttonfire = buttonfire;
		buttonaim = buttonaim;
		
	    arrow.anchor.setTo(0.1, 0.5);
	    arrow.alpha = 0;

	    // create our virtual game controller buttons 
	    buttonaim.fixedToCamera = true;  //our buttons should stay on the same place  
	    buttonaim.events.onInputDown.add(setAimTrue);
	    //buttonaim.events.onInputUp.add();

	    
	    buttonfire.fixedToCamera = true;
	    buttonfire.events.onInputDown.add(setAimFalse);
	    //buttonfire.events.onInputUp.add(function(){}); 

	    
	}

	function setAimTrue() {
		aimFlag = true;

	}

	function setAimFalse() {
		aimFlag = false;

	}

	function aimFlagCheck() {
		return aimFlag;
	}

	function aimByPointer(pointer) {
		angle = game.physics.arcade.angleToPointer(ship);
	}

	function getAngle() {
		return angle;
	}

	function update() {
		if (aimFlag) {
			
			arrow.alpha = 0.8;
			arrow.x = ship.x;
			arrow.y = ship.y;
			aimByPointer(game.input.mousePointer);
	    	aimByPointer(game.input.pointer1);
			arrow.rotation = angle;


		} else {
			arrow.alpha = 0;
		}

	}


	return {
		init: init,
		update: update,
		aimFlag: aimFlagCheck,
		getAngle: getAngle
	}
 


}
},{}],4:[function(require,module,exports){



var socket = io.connect('http://127.0.0.1:3000/');



var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

var input = require('./input.js')(game);
var camera = require('./camera.js')(game);
var bullet = require('./bullet.js')(game);



function preload() {

    game.stage.backgroundColor = '#000000';

    game.load.image('space', 'assets/starfield.jpg');
    game.load.image('ball', 'assets/shinyball.png');
    game.load.image('ship', 'assets/phaser-dude.png');
    game.load.image('arrow', 'assets/longarrow2.png');
    game.load.image('bullet', 'assets/pixel.png');
    game.load.spritesheet('buttonfire', 'assets/buttons/button-round-a.png',96,96);
    game.load.spritesheet('buttonaim', 'assets/buttons/button-round-b.png',96,96);

}


var arrow;
var ship;
var ships;
var planets;
var bullets;
var aimFlag = false;

var debug;

function create() {

    //  Modify the world bounds
    game.world.setBounds(-2000, -2000, 4000, 4000);
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

    game.physics.p2.restitution = 0.5;
    arrow = game.add.sprite(200, 450, 'arrow');

    bullets = bullet.init(cGroups);

    
    ships = game.add.group();
    ships.enableBody = true;
    ships.physicsBodyType = Phaser.Physics.P2JS;
    planets = game.add.group();
    planets.enableBody = true;
    planets.physicsBodyType = Phaser.Physics.P2JS;

    ship = ships.create(0,10,'ship');
    ship.body.mass = 5;
    game.physics.p2.enable(ship, false);

    // // Enable input.
    // ship.inputEnabled = true;
    // ship.input.start(0, true);
    // ship.events.onInputDown.add(setAim);
    // ship.events.onInputUp.add(launch);
    
	buttonaim = game.add.button(600, 500, 'buttonaim', null, this, 0, 1, 0, 1);  //game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame
	buttonfire = game.add.button(700, 500, 'buttonfire', null, this, 0, 1, 0, 1);
	input.init(arrow, buttonfire, buttonaim, ship);

    // game.camera.follow(ship, Phaser.Camera.FOLLOW_PLATFORMER);

    
     

    for (var i = 0; i < 20; i++)
    {

        var planet = planets.create(game.world.randomX, game.world.randomY, 'ball');
        planet.body.mass = 50000;
        game.physics.p2.enable(planet);
    }

    var planet = planets.create(0, 100, 'ball');
        planet.body.mass = 50000;
        game.physics.p2.enable(planet);




   

}



function update() {
	ships.forEachAlive(moveToPlanets,this);
	bullets.forEachAlive(moveToPlanets,this);

	
	input.update();
	if (input.aimFlag()) {
		if (game.input.mousePointer.isDown) {
			var bul = bullets.create(ship.x, ship.y, 'bullet');
			bullet.fire(bul,10, input.getAngle());
		}
	} else {
		camera.update();		
	}
	

}

function render() {

    //game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.text(debug, 32, 32);

}

function moveToPlanets(obj) {
	var fx = [],
		fy = [];

	planets.forEachAlive(function(planet) {
		var xs = obj.x - planet.x;
		xs = xs * xs;
		var ys = obj.y - planet.y;
		ys = ys * ys;
		var dist = (xs + ys)/600000;
		var speed = 1 / dist;

		var angle = Math.atan2(planet.y - obj.y, planet.x - obj.x);

		fx.push(Math.cos(angle) * speed);    
    	fy.push(Math.sin(angle) * speed);

		
	}, this);


	forceChange(ship,fx,fy);  //start accelerateToObject on every ship
}

function forceChange(obj, fx, fy) {
	obj.body.force.x += arrSum(fx);
	obj.body.force.y += arrSum(fy);

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


},{"./bullet.js":1,"./camera.js":2,"./input.js":3}]},{},[1,2,3,4]);
