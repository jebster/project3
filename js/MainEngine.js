function gameInit(abstract1_canvas, abstract2_canvas){
	gameEngine.init(abstract1_canvas,abstract2_canvas);
	gameEngine.load();	
}

/* Global Variables */
var ABSTRACT_LEVEL = 1;

function GameEngine(){
	var _abstract1_canvas = null;
	var _abstract2_canvas = null;

	var _framenumber = 0;

	this.init = function(abs1_canvas, abs2_canvas) {
        
        _abstract1_canvas = document.getElementById(abs1_canvas);
        _abstract2_canvas = document.getElementById(abs2_canvas);

        graphicEngine.init(abs1_canvas,abs2_canvas);
        inputManager.init();
    }

    this.run = function(){
    	_frameNumber++;
        var clock = new Date();
        var frameStartTime = clock.getTime();

        ////////////////////////////////////////
        // Game Loop Here
		//call SimulationManager on parallel thread to handle abstraction tasks
		webWorker();
        
        inputManager.processEntry() ;
        gameEngine.update(_inverseFPS);
        graphicEngine.render() ;
        ////////////////////////////////////////


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

    }

    function webWorker(){
		var w;
		if(typeof(Worker)!=="undefined"){
			if(typeof(w)=="undefined"){
				w=new Worker("SimulationManager.js");
			}
			w.onmessage = function (event) {
			var data = event.data;
			//do somethinh with event.data
			};
		}
	}

	function stopWorker(){ 
		w.terminate();
	}
}
var gameEngine = new GameEngine();
