var NPCObj = function(x,y,id, category, university, gender) {
    this.id = id;
    this.name = gender+"_"+id;
    this.pos_x = x;
    this.pos_y = y;
	this.image = new Image();
	this.whichSprite = 0;
	this.facingWhichDirection;
	this.isMoving = true;
	this.npcSpeed = 5;
	this.width = 32;
	this.target_x = x;
	this.target_y = y;
	this.wait_time = 0;
	this.interaction = false;
	this.interactionTarget;

    this.category = category;
    this.gender = gender;
    this.university = university;

    this.abstractionModifier;


    this.daveReputation = null;

    //to keep track of movement within university
    this.currUniversity;
    this.curFaculty;

    //distribution curve for preferenceType AND
    // primaryType

    // 0 - 0.3: Nerd
    // 0.3 - 0.7: Talent
    // 0.7-1.0: Hunk


    if(this.gender == "male"){

        if (this.category === "engine") {

            this.primaryTypeIndex = 0.3; //want a super nerd
            this.primaryType = 'nerd';
            this.primaryTypeScore = 10;
			//setting image source
			if(this.id%2 == 0){
				this.image.src = "images/engin_male1.png";
			}
			else{
				this.image.src = "images/engin_male2.png";
			}

        }
        if (this.category === "arts") {

            //this.primaryType
			//setting image source
			if(this.id%2 == 0){
				this.image.src = "images/arts_male1.png";
			}
			else{
				this.image.src = "images/arts_male2.png";
			}
          
          
        }
        if (this.category === "law") {
			//setting image source
			if(this.id%2 == 0){
				this.image.src = "images/law_male1.png";
			}
			else{
				this.image.src = "images/law_male2.png";
			}
        }
    }

    if(this.gender == "female"){

        this.primaryPreferenceIndex = 0.5;
        this.primaryPreference = 'talent';

        // each interaction, girl goes into guy this.primaryTypeScore, and updates primaryPreferenceScore
        this.primaryPreference_best = 0.2;

        this.laidWithDave = true;
		
		if (this.category === "engine") {
			//setting image source
			if(this.id%2 == 0){
				this.image.src = "images/engin_female1.png";
			}
			else{
				this.image.src = "images/engin_female2.png";
			}

        }
        if (this.category === "arts") {

            //this.primaryType
			//setting image source
			if(this.id%2 == 0){
				this.image.src = "images/arts_female1.png";
			}
			else{
				this.image.src = "images/arts_female2.png";
			}
          
          
        }
        if (this.category === "law") {
			//setting image source
			if(this.id%2 == 0){
				this.image.src = "images/law_female1.png";
			}
			else{
				this.image.src = "images/law_female2.png";
			}
        }
    }
	
	this.interactionCheck = function(){
		for (iter in npcCollidables){
			if(npcCollidables[iter].id != this.id){
				if(collisionChecker(this, npcCollidables[iter])){
					//collided
					console.log(this.id + " and " + npcCollidables[iter].id + " have collided");
				}
			}
		}
	}
	
	this.move = function(){
			if(this.isMoving == true){
				//using if else statements to ensure NPC move in one direction only
				//move right
				if (this.pos_x < this.target_x - grid_threshold){
					this.pos_x += this.npcSpeed;
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
				//move left
				else if (this.pos_x > this.target_x + grid_threshold){
					this.pos_x -= this.npcSpeed;
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
				//move down
				else if (this.pos_y < this.target_y - grid_threshold){
					this.pos_y += this.npcSpeed;
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
				//move up
				else if (this.pos_y > this.target_y + grid_threshold){
					this.pos_y -= this.npcSpeed;
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
				//change the target position since NPC has more or less reached its target
				else{
					this.wait_time--;
					if(this.wait_time <= 0){
						this.target_x = Math.floor(Math.random()*768);
						this.target_y = Math.floor(Math.random()*530);
						this.wait_time = 100;
					}
				}
			}
		}
	
    /*
    When Two NPCs meet:
    1. Update this.PrimaryPreferenceScore to the highest one
    2. Have an impact on daveReputation


    */

    

    this.draw = function() {
		context.drawImage(	this.image, this.whichSprite, 0,
							32, 32, this.pos_x,
							this.pos_y, 32, 32);
    }

}

collisionChecker = function(o1, o2){
	if( o2.pos_x > o1.width + o1.pos_x || o1.pos_x > o2.width + o2.pos_x)
		return false;
	if( o2.pos_y > o1.width + o1.pos_y || o1.pos_y > o2.width + o2.pos_y)
		return false;
	return true;
}