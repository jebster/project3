function gameInit(abstract1_canvas, abstract2_canvas){
	gameEngine.init(abstract1_canvas,abstract2_canvas);
}

/* Global Variables */
var ABSTRACT_LEVEL = 1;
var _inverseFPS = 1.0/30.0;
var context;
var canvas;

function GameEngine(){
	var _abstract1_canvas = null;
	var _abstract2_canvas = null;

    var player = null;

	var _frameNumber = 0;

	this.init = function(abs1_canvas, abs2_canvas) {
        
        _abstract1_canvas = document.getElementById(abs1_canvas);
        _abstract2_canvas = document.getElementById(abs2_canvas);

        inputManager.init();

        //initialise player object
        player = new PlayerObj(20,20);

        gameEngine.run();

    }

    //Game Loop
    this.run = function(){
    	_frameNumber++;
        var clock = new Date();
        var frameStartTime = clock.getTime();

        if(ABSTRACT_LEVEL == 1){
            canvas = _abstract1_canvas;          
        }
        else{
            canvas = _abstract2_canvas; 
        }

        context = _abstract2_canvas.getContext('2d');
        gameEngine.update(_inverseFPS);

        // Calculate the time until next frame;
        clock = new Date() ;
        var frameEndTime = clock.getTime();
        var timeLeft = _inverseFPS - ((frameEndTime - frameStartTime)/1000.0);// Used time for frame execution

        var nextFrameTime =  (( timeLeft < 0 )? 0 :((timeLeft > _inverseFPS)? _inverseFPS :timeLeft));
        //console.log(nextFrameTime);
        setTimeout(gameEngine.run, nextFrameTime*1000 );
        return;
    }

    this.update = function(_inverseFPS){
    	//Loop through scene character objects and parameters for current abstraction
    	//update accordingly
        context.clearRect(0,0,canvas.width,canvas.height);
        context.fillStyle="white";
        context.fillRect(0,0,canvas.width,canvas.height);
        inputManager.processEntry(player);
        player.draw();
    }
}
var gameEngine = new GameEngine();
