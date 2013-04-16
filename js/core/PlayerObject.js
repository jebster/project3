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

    this.category;
    
    this.intellect = 0.1;
    this.talent = 0.7;
    this.fitness = 0.8;
    
    
    this.girlsList = [];
    this.laidList = [];

    // he has 100 units of time ~ jensen
    this.time = 100;

    //other attributes to be added
    this.move = function(){
        if (_keys[K_LEFT].press) { // Player holding left
            this.pos_x -= this.playerSpeed;
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

    this.draw = function(){
		context.drawImage(	this.image, this.whichSprite, 0,
							32, 32, this.pos_x,
							this.pos_y, 32, 32);
    }
}
