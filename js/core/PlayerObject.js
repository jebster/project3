var PlayerObj = function(x, y){
    this.pos_x = x;
    this.pos_y = y;

    this.category;
    this.fitness = 0.3;
    this.studies = 0.6;
    this.talent = 0.4;
    this.girlsList = [];
    this.laidList = [];

    //other attributes to be added
    this.move = function(){
        if (_keys[K_LEFT].press) { // Player holding left
            this.pos_x -= 10;
        }
        if (_keys[K_UP].press) { // Player holding up
            this.pos_y -= 10;        
        }
        if (_keys[K_RIGHT].press) { // Player holding right
            this.pos_x += 10;
        }
        if (_keys[K_DOWN].press) { // Player holding down
            this.pos_y += 10;      
        }
    }

    this.draw = function(){
        context.beginPath();
        context.fillStyle = "black";
        context.arc(this.pos_x, this.pos_y,this.radius,0,Math.PI*2,true);
        context.closePath();
        context.fill();
        console.log(this.pos_x, this.pos_y);
    }
}
