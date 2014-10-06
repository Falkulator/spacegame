


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

