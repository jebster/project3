var PlayerObj = function(x, y){
    this.pos_x = x;
    this.pos_y = y;
	this.width = 32;
    this.radius = 10;
    this.playerSpeed = 5;
	this.image = new Image();
	this.image.src = "images/main_char.png";
	this.whichSprite = 32;
	this.facingWhichDirection;
	this.keepMoving = false;
	this.animSpeed;
	this.lastRender;

    this.category;
    
    this.talent = 0.4;
    this.fitness = 0.3;
    this.intellect = 0.6;
    
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
    }

    this.draw = function(){
        // context.beginPath();
        // context.fillStyle = "black";
        // context.arc(this.pos_x, this.pos_y,this.radius,0,Math.PI*2,true);
        // context.closePath();
        // context.fill();
		context.drawImage(	this.image, this.whichSprite, 0,
							32, 32, this.pos_x,
							this.pos_y, 32, 32);
    }
}
