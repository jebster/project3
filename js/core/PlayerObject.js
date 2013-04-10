var PlayerObj = function(x, y){
    this.pos_x = x;
    this.pos_y = y;
    this.radius = 10;
    this.playerSpeed = 5;

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
        }
        if (_keys[K_UP].press) { // Player holding up
            this.pos_y -= this.playerSpeed;        
        }
        if (_keys[K_RIGHT].press) { // Player holding right
            this.pos_x += this.playerSpeed;
        }
        if (_keys[K_DOWN].press) { // Player holding down
            this.pos_y += this.playerSpeed;      
        }
    }

    this.draw = function(){
        context.beginPath();
        context.fillStyle = "black";
        context.arc(this.pos_x, this.pos_y,this.radius,0,Math.PI*2,true);
        context.closePath();
        context.fill();
    }
}
