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