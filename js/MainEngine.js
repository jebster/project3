function gameInit(abstract1_canvas, abstract2_canvas){

	gameEngine.init(abstract1_canvas,abstract2_canvas);
}

/* Global Variables */
var ABSTRACT_LEVEL = 1;
var _inverseFPS = 1.0/30.0;
var context;
var canvas;
var bgImg = new Image();
bgImg.src = "images/nus_engin.png";

// moved the player to be global variable, so that other functions can assess ~ jensen
var player = null;

// Track Location ~ jensen
var currentUni = 'NUS'; // always start in NUS

function GameEngine(){
	var _abstract1_canvas = null;
	var _abstract2_canvas = null;

    

	var _frameNumber = 0;

	this.init = function(abs1_canvas, abs2_canvas) {
        
        _abstract1_canvas = document.getElementById(abs1_canvas);
        _abstract2_canvas = document.getElementById(abs2_canvas);

        //initialise player object
        player = new PlayerObj(20,20);


        //initialize simulation manager ~ jensen
        simulation = new SimulationManager();

        // initialize input manager
        inputManager.init();


        gameEngine.run();

    }

    this.run = function(){
    	_frameNumber++;
        var clock = new Date();
        var frameStartTime = clock.getTime();

        /*Game Loop Functions*/
        gameEngine.renderCanvas();
        gameEngine.update(_inverseFPS);

        // Calculate the time until next frame;
        clock = new Date() ;
        var frameEndTime = clock.getTime();
        var timeLeft = _inverseFPS - ((frameEndTime - frameStartTime)/1000.0);// Used time for frame execution

        var nextFrameTime =  (( timeLeft < 0 )? 0 :((timeLeft > _inverseFPS)? _inverseFPS :timeLeft));
        setTimeout(gameEngine.run, nextFrameTime*1000 );
        return;
    }

    this.renderCanvas = function(){       
        if(ABSTRACT_LEVEL == 1){
            canvas = _abstract1_canvas;
            context = canvas.getContext('2d'); 
            context.clearRect(0,0,canvas.width,canvas.height);
            // context.fillStyle = "rgb(238, 234, 203)";
            // context.fillRect(0,0,canvas.width,canvas.height);
            // context.fill();
			context.drawImage(bgImg, 0, 0);
        }
        else{
            canvas = _abstract2_canvas;
            context = canvas.getContext('2d'); 
            context.clearRect(0,0,canvas.width,canvas.height);
            context.fillStyle = "rgb(138, 234, 203)";
            context.fillRect(0,0,canvas.width,canvas.height);
            context.fill();         
        }
    }

    this.update = function(_inverseFPS){
    	//Loop through scene character objects and parameters for current abstraction
    	//update accordingly
        inputManager.processEntry(player);
        player.draw();
    }
}
var gameEngine = new GameEngine();

