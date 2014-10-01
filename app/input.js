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
		setAimFalse: setAimFalse,
		getAngle: getAngle
	}
 


}