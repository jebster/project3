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
	this.success;
	this.currInteractionStage = 0;

	//a NPC object that he interacts with
	this.targetNPC = 0;
	
    this.category;
    
    this.intellect = 0.9;
    this.talent = 0.7;
    this.fitness = 0.3;

    //will store the player's primary type
    /*
    this.primaryType;
    this.primaryTypeScore;
    this.primaryTypeIndex;
	
	this.skillArray = [this.intellect, this.talent, this.fitness];*/
   
    //other attributes to be added
    this.move = function(){
	    if(_keys[K_SPACE].press){
			if(!performingAction){
				for(iter in toRenderList.NPCList){
					if(collisionChecker(player, toRenderList.NPCList[iter]) && !toRenderList.NPCList[iter].interaction && toRenderList.NPCList[iter].gender == "female"){
						this.targetNPC = toRenderList.NPCList[iter];
					}
				}
			}
		}
		if(this.targetNPC != 0){
			this.interactionWithNPC(this.targetNPC);
		}
		if(performingAction){
			if(this.currInteractionStage == 1){
				if(_keys[K_A].press){
					this.befriend(this.targetNPC);
					_keys[K_A].press = false;
				}
				if(_keys[K_D].press){
					this.date(this.targetNPC);
					_keys[K_D].press = false;
				}
			}
			if(this.currInteractionStage == 2){
				if(_keys[K_A].press){
					this.hangout(this.targetNPC);
					_keys[K_A].press = false;
				}
				if(_keys[K_D].press){
					this.laid(this.targetNPC);
					_keys[K_D].press = false;
				}
			}	
			if(_keys[K_R].press){
				this.resume();
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
			//var cur_location = document.getElementById('location').options[document.getElementById('location').selectedIndex].value;
			switch(cur_location){
				case "artsNUS":
					var indexDes = findIndexDes("lawNUS");
					document.getElementById('location').options[document.getElementById('location').selectedIndex].value = "lawNUS";
					document.getElementById('location').options[document.getElementById('location').selectedIndex].innerHTML = "Law";
					changeHtmlDOM(indexDes,'artsNUS');

					break;
				case "engineNUS":
					var indexDes = findIndexDes("artsNUS");
					document.getElementById('location').options[document.getElementById('location').selectedIndex].value = "artsNUS";
					document.getElementById('location').options[document.getElementById('location').selectedIndex].innerHTML = "Arts";
					changeHtmlDOM(indexDes,'engineNUS');
					break;
				case "lawNUS":
					var indexDes = findIndexDes("engineNUS");
					document.getElementById('location').options[document.getElementById('location').selectedIndex].value = "engineNUS";
					document.getElementById('location').options[document.getElementById('location').selectedIndex].innerHTML = "Engine";
					changeHtmlDOM(indexDes,'lawNUS');
					break;
				case "artsNTU":
					var indexDes = findIndexDes("lawNTU");
					document.getElementById('location').options[document.getElementById('location').selectedIndex].value = "lawNTU";
					document.getElementById('location').options[document.getElementById('location').selectedIndex].innerHTML = "Law";
					changeHtmlDOM(indexDes,'artsNTU');
					break;
				case "engineNTU":
					var indexDes = findIndexDes("artsNTU");
					document.getElementById('location').options[document.getElementById('location').selectedIndex].value = "artsNTU";
					document.getElementById('location').options[document.getElementById('location').selectedIndex].innerHTML = "Arts";
					changeHtmlDOM(indexDes,'engineNTU');
					break;
				case "lawNTU":
					var indexDes = findIndexDes("engineNTU");
					document.getElementById('location').options[document.getElementById('location').selectedIndex].value = "engineNTU";
					document.getElementById('location').options[document.getElementById('location').selectedIndex].innerHTML = "Engine";
					changeHtmlDOM(indexDes,'lawNTU');
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

					var indexDes = findIndexDes("engineNUS");

					document.getElementById('location').options[document.getElementById('location').selectedIndex].value = "engineNUS";
					document.getElementById('location').options[document.getElementById('location').selectedIndex].innerHTML = "Engine";

					changeHtmlDOM(indexDes,'artsNUS');

					break;
				case "engineNUS":

				//Store index of Law
				//I change current active selection to Law
				//Use index of Law, to change it to Engine

					var indexDes = findIndexDes("lawNUS");

					document.getElementById('location').options[document.getElementById('location').selectedIndex].value = "lawNUS";
					document.getElementById('location').options[document.getElementById('location').selectedIndex].innerHTML = "Law";

					//Change destination fac DOM to current fac DOM
					changeHtmlDOM(indexDes, "engineNUS");
					

					break;
				case "lawNUS":

					var indexDes = findIndexDes("artsNUS");

					document.getElementById('location').options[document.getElementById('location').selectedIndex].value = "artsNUS";
					document.getElementById('location').options[document.getElementById('location').selectedIndex].innerHTML = "Arts";

					changeHtmlDOM(indexDes, 'lawNUS');

					break;
				case "artsNTU":

					var indexDes = findIndexDes("engineNTU");

					document.getElementById('location').options[document.getElementById('location').selectedIndex].value = "engineNTU";
					document.getElementById('location').options[document.getElementById('location').selectedIndex].innerHTML = "Engine";

					changeHtmlDOM(indexDes, 'artsNTU');


					break;
				case "engineNTU":

					var indexDes = findIndexDes("lawNTU");

					document.getElementById('location').options[document.getElementById('location').selectedIndex].value = "lawNTU";
					document.getElementById('location').options[document.getElementById('location').selectedIndex].innerHTML = "Law";

					changeHtmlDOM(indexDes, 'engineNTU');

					break;
				case "lawNTU":

					var indexDes = findIndexDes("artsNTU");

					document.getElementById('location').options[document.getElementById('location').selectedIndex].value = "artsNTU";
					document.getElementById('location').options[document.getElementById('location').selectedIndex].innerHTML = "Arts";

					changeHtmlDOM(indexDes, 'lawNTU');

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
		//this.moveNPC(npc);
		//if(npc.pos_x == npc.target_x && npc.pos_y == npc.target_y){
			performingAction = true;
			if(this.currInteractionStage == 0){
				this.currInteractionStage = 1;
			//}
		}
	}
	
	this.moveNPC = function(npc){
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
		if(npc.pos_x <= npc.target_x+4 && npc.pos_x >= npc.target-4	&& 
			npc.pos_y <= npc.target_y+4 && npc.pos_y >= npc.target_y+4){
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
    	if(this.intellect > 0.1){
			this.intellect -= 0.0001;
		}
		
		if(this.talent > 0.1){
			this.talent -= 0.0001;
		}
		
		if(this.fitness > 0.1){
			this.fitness -= 0.0001;
		}
		

	    //Updates player's primaryType parameters
	    //this.primaryTypeScore = Array.max(this.skillArray);
	    /*
	    this.primaryTypeIndex = this.skillArray.indexOf(this.primaryTypeScore);

	    if(this.primaryTypeIndex == 0){
	    	this.primaryType = 'nerd';
	    }else if(this.primaryTypeIndex == 1) {
	    	this.primaryType = 'talent';
	    }else{
	    	this.primaryType = 'fitness';
	    }*/
    }
	
	this.resume = function(){
		this.targetNPC.isMoving = true;
		this.targetNPC.target_x = Math.floor(Math.random()*24) * 32 + 32;
		this.targetNPC.target_y = Math.floor(Math.random()*17) * 32 + 32;
		this.targetNPC = 0;
		performingAction = false;
		this.currInteractionStage = 0;
	}
	
	this.befriend = function(npc){
		alert("You have befriended " + npc.gender + " " + npc.id);
		this.resume();

		if(npc.daveReputation < 0.9)
			npc.daveReputation += 0.1;
	}
	
	this.date = function(npc){
		this.success = npc.dateDaveDecision();
		if(this.success){

			alert(npc.gender + " " + npc.id + " has decided to go on a date with you!");
			
			this.currInteractionStage = 2;
		}
		if(!this.success){
			alert("You have been rejected");
			viewInteractionEva();
			this.resume();
		}
	}
	
	this.hangout = function(npc){
		alert("You have just hanged out with " + npc.name);
		this.resume();
		if(npc.daveReputation < 0.8)
			npc.daveReputation += 0.2;
	}
	
	this.laid = function(npc){
		//alert("You just banged " + npc.name);
		this.successfulLaid();

		this.resume();
		
	}
	
	this.successfulLaid = function(){
		viewInteractionEva();
    	//change the target NPC as status laid
    	this.targetNPC.laidWithDave = true;

    	//push it to the laidList array
    	laidList.push(this.targetNPC);
		laidCount++;
		document.getElementById('laid-count-dis').innerHTML = laidCount;

		//decrease reputation
		if(this.targetNPC.daveReputation > 0.3)
			this.targetNPC.daveReputation -= 0.3;
    }

    function findIndexDes(des) {
    	//Go through the dropdown
    	for(var i=0; i<6; i++){

    		if(document.getElementById('location').options[i].value == des)
    			return i;
    	}

    }

    function changeHtmlDOM(index, location) {

    	var value;
    	var innerHTML;

    	switch(location){
    		case "engineNUS":
				value = "engineNUS";
				innerHTML = "Engine";
				break;
			case "artsNUS":
				value = "artsNUS";
				innerHTML = "Arts";
				break;
			case "lawNUS":
				value = "lawNUS";
				innerHTML = "Law";
				break;
			case "engineNTU":
				value = "engineNTU";
				innerHTML = "Engine";
				break;
			case "artsNTU":
				value = "artsNTU";
				innerHTML = "Arts";
				break;
			case "lawNTU":
				value = "lawNTU";
				innerHTML = "Law";
				break;
    	}

		document.getElementById('location').options[index].value = value;
		document.getElementById('location').options[index].innerHTML = innerHTML;

    }
}
