var PlayerObj = function(x, y){
    this.pos_x = x;
    this.pos_y = y;
	this.width = 32;
    this.radius = 10;
    this.playerSpeed = 4;
	this.image = new Image();
	this.image.src = "images/main_char.png";
	this.whichSprite = 0;
	this.facingWhichDirection;
	this.keepMoving = false;
	this.animSpeed;
	this.lastRender;
	this.targetNPC = 0;

    this.category;
    
    this.intellect = 0.1;
    this.talent = 0.7;
    this.fitness = 0.5;

    //will store the player's primary type
    this.primaryType;
    this.primaryTypeScore;
    this.primaryTypeIndex;

    this.skillArray = [this.intellect, this.talent, this.fitness];
    
    
    this.girlsList = [];
    this.laidList = [];



    //other attributes to be added
    this.move = function(){
	    if(_keys[K_SPACE].press){
			if(!performingAction){
				for(iter in toRenderList.NPCList){
					if(collisionChecker(player, toRenderList.NPCList[iter]) && !toRenderList.NPCList[iter].interaction){
						this.targetNPC = toRenderList.NPCList[iter];
					}
				}
			}
		}
		if(this.targetNPC != 0){
			this.interactionWithNPC(this.targetNPC);
		}
		if(_keys[K_R].press){
			if(performingAction){
				this.targetNPC.isMoving = true;
				this.targetNPC = 0;
				performingAction = false;
			}
		}
		if(!performingAction){
			if (_keys[K_LEFT].press) { // Player holding left
				this.pos_x -= this.playerSpeed;
				this.facingWhichDirection = "left";
				if (this.whichSprite == this.width * 4){
					this.whichSprite = this.width * 5;
				}	else if (this.whichSprite == this.width * 5) {
						this.whichSprite = this.width * 6;
				} else if (this.whichSprite == this.width * 6) {
						this.whichSprite = this.width * 7;
				} else {
						this.whichSprite = this.width * 4;
				}			 
			}
			if (_keys[K_UP].press) { // Player holding up
				this.pos_y -= this.playerSpeed;
				this.facingWhichDirection = "up";
				if (this.whichSprite == this.width * 12){
					this.whichSprite = this.width * 13;
				}	else if (this.whichSprite == this.width * 13) {
						this.whichSprite = this.width * 14;
				} else if (this.whichSprite == this.width * 14) {
						this.whichSprite = this.width * 15;
				} else {
						this.whichSprite = this.width * 12;
				}			
			}
			if (_keys[K_RIGHT].press) { // Player holding right
				this.pos_x += this.playerSpeed;
				this.facingWhichDirection = "right";
				if (this.whichSprite == this.width * 8){
					this.whichSprite = this.width * 9;
				}	else if (this.whichSprite == this.width * 9) {
						this.whichSprite = this.width * 10;
				} else if (this.whichSprite == this.width * 10) {
						this.whichSprite = this.width * 11;
				} else {
						this.whichSprite = this.width * 8;
				}
			}
			if (_keys[K_DOWN].press) { // Player holding down
				this.pos_y += this.playerSpeed;
				this.facingWhichDirection = "down";				
				if (this.whichSprite == this.width * 0){
					this.whichSprite = this.width * 1;
				}	else if (this.whichSprite == this.width * 1) {
						this.whichSprite = this.width * 2;
				} else if (this.whichSprite == this.width * 2) {
						this.whichSprite = this.width * 3;
				} else {
						this.whichSprite = this.width * 0;
				}
			}
		}
		//at top door
		if (this.pos_y <= TOP_DOOR_BOUND_Y && 
			this.pos_x >= DOOR_LEFT_X && 
			this.pos_x <= DOOR_RIGHT_X){
			var cur_location = document.getElementById('location').options[document.getElementById('location').selectedIndex].value;
			var cur_location = document.getElementById('location').options[document.getElementById('location').selectedIndex].value;
			switch(cur_location){
				case "artsNUS":
					document.getElementById('location').options[document.getElementById('location').selectedIndex].value = "lawNUS";
					break;
				case "engineNUS":
					document.getElementById('location').options[document.getElementById('location').selectedIndex].value = "artsNUS";
					break;
				case "lawNUS":
					document.getElementById('location').options[document.getElementById('location').selectedIndex].value = "engineNUS";
					break;
				case "artsNTU":
					document.getElementById('location').options[document.getElementById('location').selectedIndex].value = "lawNTU";
					break;
				case "engineNTU":
					document.getElementById('location').options[document.getElementById('location').selectedIndex].value = "artsNTU";
					break;
				case "lawNTU":
					document.getElementById('location').options[document.getElementById('location').selectedIndex].value = "engineNTU";
					break;
			}			
			simulation.changeLocation();
			_keys[K_UP].press = false;
			_keys[K_DOWN].press = false;
			_keys[K_LEFT].press = false;
			_keys[K_RIGHT].press = false;
			this.pos_x = 400;
			this.pos_y = 480;
		}
		//at bot door
		if (this.pos_y >= BOT_DOOR_BOUND_Y && 
			this.pos_x >= DOOR_LEFT_X && 
			this.pos_x <= DOOR_RIGHT_X){
			var cur_location = document.getElementById('location').options[document.getElementById('location').selectedIndex].value;
			switch(cur_location){
				case "artsNUS":
					document.getElementById('location').options[document.getElementById('location').selectedIndex].value = "engineNUS";
					break;
				case "engineNUS":
					document.getElementById('location').options[document.getElementById('location').selectedIndex].value = "lawNUS";
					break;
				case "lawNUS":
					document.getElementById('location').options[document.getElementById('location').selectedIndex].value = "artsNUS";
					break;
				case "artsNTU":
					document.getElementById('location').options[document.getElementById('location').selectedIndex].value = "engineNTU";
					break;
				case "engineNTU":
					document.getElementById('location').options[document.getElementById('location').selectedIndex].value = "lawNTU";
					break;
				case "lawNTU":
					document.getElementById('location').options[document.getElementById('location').selectedIndex].value = "artsNTU";
					break;
			}			
			simulation.changeLocation();
			_keys[K_UP].press = false;
			_keys[K_DOWN].press = false;
			_keys[K_LEFT].press = false;
			_keys[K_RIGHT].press = false;
			this.pos_x = 400;
			this.pos_x = 400;
			this.pos_y = 50;
		}
    }
	
	this.interactionWithNPC = function(npc){
		console.log("You are talking with " + npc.gender + npc.id);
		
		var finalFacing;
		switch(this.facingWhichDirection){
			case "up":
				npc.target_x = this.pos_x;
				npc.target_y = this.pos_y - 32;
				finalFacing = "down";
				break;
			case "down":
				npc.target_x = this.pos_x;
				npc.target_y = this.pos_y + 32;
				finalFacing = "up";
				break;
			case "left":
				npc.target_x = this.pos_x - 32;
				npc.target_y = this.pos_y;
				finalFacing = "right";
				break;
			case "right":
				npc.target_x = this.pos_x + 32;
				npc.target_y = this.pos_y;
				finalFacing = "left";
				break;				
		}
		this.moveNPC(npc);
		if(npc.pos_x == npc.target_x && npc.pos_y == npc.target_y){
			performingAction = true;
		}
	}
	
	this.moveNPC = function(npc){
		console.log("function called");
		var finalFacing;
		switch(this.facingWhichDirection){
			case "up":
				npc.target_x = this.pos_x;
				npc.target_y = this.pos_y - 32;
				finalFacing = "down";
				break;
			case "down":
				npc.target_x = this.pos_x;
				npc.target_y = this.pos_y + 32;
				finalFacing = "up";
				break;
			case "left":
				npc.target_x = this.pos_x - 32;
				npc.target_y = this.pos_y;
				finalFacing = "right";
				break;
			case "right":
				npc.target_x = this.pos_x + 32;
				npc.target_y = this.pos_y;
				finalFacing = "left";
				break;				
		}
		npc.move();
		if(npc.pos_x == npc.target_x && npc.pos_y == npc.target_y){
			npc.facingWhichDirection = finalFacing;
			npc.isMoving = false;
		}
	}
	
    this.draw = function(){
		context.drawImage(	this.image, this.whichSprite, 0,
							32, 32, this.pos_x,
							this.pos_y, 32, 32);
    }

    this.skillRender = function(){

    	//Player skill decay over time
    	this.intellect -= 0.0001;
	    this.talent -= 0.0001;
	    this.fitness -= 0.0001;

	    //Updates player's primaryType parameters
	    this.primaryTypeScore = Array.max(this.skillArray);
	    this.primaryTypeIndex = this.skillArray.indexOf(this.primaryTypeScore);

	    if(this.primaryTypeIndex == 0){
	    	this.primaryType = 'nerd';
	    }else if(this.primaryTypeIndex == 1) {
	    	this.primaryType = 'talent';
	    }else{
	    	this.primaryType = 'fitness';
	    }

    }
}
