function gameInit(abstract1_canvas, abstract2_canvas){

	gameEngine.init(abstract1_canvas,abstract2_canvas);
}

function getCurTime(){
    var clock = new Date();
    var timeUnit = Math.ceil( (clock.getTime()/1000) );

    //timeUnit will give the current time in seconds
    //For example
    //1366035345, 10 seconds later, it will be
    //1366035355

    return timeUnit;
}

/* Global Variables */
var ABSTRACT_LEVEL = 1;
var toRenderList = {NPCList: [		new NPCObj(132, 132, 1, "engine", "NUS", "male"),
									new NPCObj(164, 164, 2, "engine", "NUS", "male"),
									new NPCObj(196, 196, 3, "engine", "NUS", "female"),
									new NPCObj(228, 228, 4, "engine", "NUS", "female"),
									new NPCObj(260, 260, 5, "arts", "NUS", "male"),
									new NPCObj(292, 292, 6, "arts", "NUS", "male"),
									new NPCObj(324, 292, 7, "arts", "NUS", "female"),
									new NPCObj(356, 260, 8, "arts", "NUS", "female"),
									new NPCObj(388, 228, 9, "law", "NUS", "male"),
									new NPCObj(420, 196, 10, "law", "NUS", "male"),
									new NPCObj(452, 164, 11, "law", "NUS", "female"),
									new NPCObj(484, 132, 12, "law", "NUS", "female")	]};
var tempRenderList;
var inFlightList = new Array();
var _inverseFPS = 1.0/30.0;
var context;
var canvas;
var bgImg = new Image();
bgImg.src = "images/nus_engin.png";
var DOOR_LEFT_X = 284;
var DOOR_RIGHT_X = 500;
var TOP_DOOR_BOUND_Y = 44;
var BOT_DOOR_BOUND_Y = 506;
var grid_threshold = 16;	//threshold for NPC movement to random spots
var npcCollidables = toRenderList.NPCList;

// moved the player to be global variable, so that other functions can assess ~ jensen
var player = null;



function GameEngine(){
	var _abstract1_canvas = null;
	var _abstract2_canvas = null;

    

	var _frameNumber = 0;

	this.init = function(abs1_canvas, abs2_canvas) {
        
        _abstract1_canvas = document.getElementById(abs1_canvas);
        _abstract2_canvas = document.getElementById(abs2_canvas);

        //initialise player object
        player = new PlayerObj(0,0);


        //initialize simulation manager ~ jensen
        simulation = new SimulationManager();

        abstractTwoContainer = new AbstractTwoContainer();
        abstractThreeContainer = new AbstractThreeContainer();

        // initialize input manager
        inputManager.init(_inverseFPS);

/*
        var time1 = getCurTime();
        alert('pause');
        var time2 = getCurTime();
        alert(time2-time1);
        
*/



							
        gameEngine.run();

    }

    this.run = function(){
    	_frameNumber++;


        var clock = new Date();
        var frameStartTime = clock.getTime();

        /*Game Loop Functions*/
        gameEngine.renderCanvas();
        gameEngine.update(_inverseFPS);
        simulation.autoCompress();

        
        abstractThreeContainer.updatePreference();






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
        var removeNPCFlag = 0;
        inputManager.processEntry(player);
        player.draw();

        //Update NPC movements (Max's function)
        //updateNPCPositions(); 

        //Check interactions between NPCs an NPC and player (Max's function)
        //Here is where we exchange reputations, ask for dates, etc.
        //checkNPCInteractions();
		
		tempRenderList = toRenderList;
		
        for(var i = 0; i < toRenderList.NPCList.length; ++i){
            removeNPCFlag = 0;
            var currNPC =  toRenderList.NPCList[i];
			
			//make them move
			currNPC.move();
			
            //var movement = checkFacultyMovement(currNPC);
            var inFlightListFlag = 1;

            //Check if NPC is moving to another faculty
            /*switch(movement){
                case "engine":
                case "arts":
                case "law":
                    currNPC.currFaculty = movement;
                    inFlightList.push(currNPC);
                    removeNPCFlag = 1;
                    break;
                case "nothing":
                default:
                    break;
            }*/

            //Remove NPC from current faculty rendering if he/she has left the faculty
            if(removeNPCFlag == 1){
                tempRenderList.NPCList = [];
                for(var j = 0; j < toRenderList.NPCList.length; ++j){
                    var otherNPC = toRenderList.NPCList[i];
                    if(!(currNPC.id == otherNPC.id)){
                        tempRenderList.NPCList.push(otherNPC);
                    }
                }
            }
			else{
				//if not removed, draw the character
				currNPC.draw();
				currNPC.interactionCheck();
			}

        }

        toRenderList = tempRenderList;

    }

    this.checkFacultyMovement = function(object){
        if(object.currFaculty == "engine"){
            if(object.pos_x == ENGINE_ARTS_DOOR_X && object.pos_y == ENGINE_ARTS_DOOR_Y){
                return "arts";
            }
            else if(object.pos_x == ENGINE_LAW_DOOR_X && object.pos_y == ENGINE_LAW_DOOR_Y){
                return "law";
            }
        }
        if(object.currFaculty == "arts"){
            if(object.pos_x == ARTS_ENGINE_DOOR_X && object.pos_y == ARTS_ENGINE_DOOR_Y){
                return "engine";
            }
            else if(object.pos_x == ARTS_LAW_DOOR_X && object.pos_y == ARTS_LAW_DOOR_Y){
                return "law";
            }
        }
        if(object.currFaculty == "law"){
            if(object.pos_x == LAW_ARTS_DOOR_X && object.pos_y == LAW_ARTS_DOOR_Y){
                return "arts";
            }
            else if(object.pos_x == LAW_ENGINE_DOOR_X && object.pos_y == LAW_ENGINE_DOOR_Y){
                return "engine";
            }
        }
        else{
            return "nothing";
        }

    }
}
var gameEngine = new GameEngine();

