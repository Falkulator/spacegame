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