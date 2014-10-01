


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

