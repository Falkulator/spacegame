

var socket = io.connect('http://127.0.0.1:3000/');



var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.stage.backgroundColor = '#000000';

    game.load.image('space', 'assets/starfield.jpg');
    game.load.image('ball', 'assets/shinyball.png');
    game.load.image('ship', 'assets/phaser-dude.png');
    game.load.image('arrow', 'assets/longarrow2.png');
    game.load.spritesheet('buttonfire', 'assets/buttons/button-round-a.png',96,96);
    game.load.spritesheet('buttonaim', 'assets/buttons/button-round-b.png',96,96);

}

var cursors;
var d;
var arrow;
var ship;
var ships;
var planets;
var aimFlag = false;

var debug;

function create() {

    //  Modify the world and camera bounds
    game.world.setBounds(-2000, -2000, 4000, 4000);

    game.physics.startSystem(Phaser.Physics.P2JS);
    bullets = game.add.group();
    ships = game.add.group();
    ships.enableBody = true;
    ships.physicsBodyType = Phaser.Physics.P2JS;
    planets = game.add.group();
    planets.enableBody = true;
    planets.physicsBodyType = Phaser.Physics.P2JS;

    ship = ships.create(0,10,'ship');
    ship.body.mass = 5;
    game.physics.p2.enable(ship, false);

    // Enable input.
    ship.inputEnabled = true;
    ship.input.start(0, true);
    ship.events.onInputDown.add(setAim);
    ship.events.onInputUp.add(launch);
    
    game.camera.follow(ship, Phaser.Camera.FOLLOW_TOPDOWN);

    arrow = game.add.sprite(200, 450, 'arrow');
    arrow.anchor.setTo(0.1, 0.5);
    arrow.alpha = 0;

    // create our virtual game controller buttons 
    buttonaim = game.add.button(600, 500, 'buttonaim', null, this, 0, 1, 0, 1);  //game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame
    buttonaim.fixedToCamera = true;  //our buttons should stay on the same place  
    buttonaim.events.onInputDown.add(setAim);
    //buttonaim.events.onInputUp.add();

    buttonfire = game.add.button(700, 500, 'buttonfire', null, this, 0, 1, 0, 1);
    buttonfire.fixedToCamera = true;
    //buttonfire.events.onInputDown.add(function(){});
    //buttonfire.events.onInputUp.add(function(){});  

    for (var i = 0; i < 20; i++)
    {

        var planet = planets.create(game.world.randomX, game.world.randomY, 'ball');
        planet.body.mass = 5;
        game.physics.p2.enable(planet);
    }

    var planet = planets.create(0, 100, 'ball');
        planet.body.mass = 5000;
        game.physics.p2.enable(planet);



    game.add.text(600, 800, "- phaser -", { font: "32px Arial", fill: "#330088", align: "center" });

    d = game.add.sprite(0, 0, 'phaser');
    d.anchor.setTo(0.5, 0.5);

    cursors = game.input.keyboard.createCursorKeys();

}

function setAim() {
	aimFlag = true;
	arrow.reset(ship.x, ship.y);
	game.camera.x = ship.x;
	game.camera.y = ship.y;
}

function launch() {
	aimFlag = false;
	arrow.alpha = 0;
}

function update() {
	ships.forEachAlive(moveToPlanets,this);
	arrow.rotation = game.physics.arcade.angleBetween(arrow, ship);
	if (aimFlag) {
		arrow.alpha = 0.8; 


	}
	
	cameraUpdate();

}

function render() {

    //game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.text(debug, 32, 32);

}

function moveToPlanets(ship) {
	var fx = [],
		fy = [];

	planets.forEachAlive(function(planet) {
		var xs = ship.x - planet.x;
		xs = xs * xs;
		var ys = ship.y - planet.y;
		ys = ys * ys;
		var dist = (xs + ys)/600000;
		var speed = 1 / dist;

		var angle = Math.atan2(planet.y - ship.y, planet.x - ship.x);

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

function accelerateToObject(obj1, obj2, speed) {
	if (typeof speed === 'undefined') { speed = 60; }
    var angle = Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);
    obj1.body.rotation = angle + game.math.degToRad(90);  // correct angle of angry bullets (depends on the sprite used)
    obj1.body.force.x = Math.cos(angle) * speed;    // accelerateToObject 
    obj1.body.force.y = Math.sin(angle) * speed;

    debug = "y - " + obj1.body.force.y + " | x - " + obj1.body.force.x;
}

var o_mcamera;
function cameraUpdate() {
	move_camera_by_pointer(game.input.mousePointer);
    move_camera_by_pointer(game.input.pointer1);
	 d.angle += 1;

    if (cursors.up.isDown)
    {
        if (cursors.up.shiftKey)
        {
            d.angle++;
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
            d.angle--;
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

function move_camera_by_pointer(o_pointer) {
    if (!o_pointer.timeDown) { return; }
    if (o_pointer.isDown && !o_pointer.targetObject) {
        if (o_mcamera) {
            game.camera.x += o_mcamera.x - o_pointer.position.x;
            game.camera.y += o_mcamera.y - o_pointer.position.y;
        }
        o_mcamera = o_pointer.position.clone();
    }
    if (o_pointer.isUp) { o_mcamera = null; }
}