function gameInit(abstract1_canvas, abstract2_canvas){

	gameEngine.init(abstract1_canvas,abstract2_canvas);
}

function getCurTime(){

   // var clock = new Date();
    //var timeUnit = Math.ceil( (clock.getTime()/1000) );

    //timeUnit will give the current time in seconds
    //For example
    //1366035345, 10 seconds later, it will be
    //1366035355

    return timeUnit;
}

function influence_btwn_NPCS(daveRep1, daveRep2){

        var daveRep1_temp = daveRep1;
        var daveRep2_temp = daveRep2;

        //Difference between the reputation
        var daveRep_diff;

        //Influence of the difference
        var daveRep_inf;

        //to return the two reputations as an array
        var daveRepArray = new Object;

        //ensure daveRep1 is the smaller than daveRep2
        if(daveRep1>daveRep2){
            daveRep2 = daveRep1;
            daveRep1 = daveRep2_temp;
        }

        daveRep_diff = daveRep2-daveRep1;

        //The difference ranges from 0 to 0.99
        //Convert it to 0 to 0.2 (maximum can influence reputation by 0.2 points)
        daveRep_inf = daveRep_diff/4.95;

        //If neutral
        if(daveRep1 > 0.4 && daveRep1 < 0.6){
            //daveRep1 Will be influenced
            //daveRep2 will not be influenced
            daveRep1 += daveRep_inf;

            
        }else if(daveRep2 > 0.4 && daveRep2 < 0.6){ 

            daveRep2 -= daveRep_inf;

            
        }
        else{
            daveRep1 += daveRep_inf;
            daveRep2 -= daveRep_inf;
        }

        //Make sure they don't exceed
        if(daveRep2 > 1){
            daveRep2 = 0.99;
        }

        if(daveRep1 < 0){
            daveRep1 = 0.1;
        }


        daveRepArray[0] = daveRep1;
        daveRepArray[1] = daveRep2;

        return daveRepArray;
    }

/* Global Variables */
var initialPopulation = 20;
var ABSTRACT_LEVEL = 1;
var facPopulation_thresh = initialPopulation - 4;
var populateCount = initialPopulation;
var toRenderList;
var debug = false;


var abstractTwoContainer;
var abstractThreeContainer;

var faculty_index;

var timeUnit = 0;
// var toRenderList = {NPCList: [		

//     new NPCObj(132, 132, 1, "engine", "male",0,0,0),
//     new NPCObj(164, 164, 2, "engine", "male",0,0,0),
//     // new NPCObj(196, 196, 3, "engine", "NUS", "female"),
//     // new NPCObj(228, 228, 4, "engine", "NUS", "female"),
//     // new NPCObj(260, 260, 5, "arts", "NUS", "male"),
//     // new NPCObj(292, 292, 6, "arts", "NUS", "male"),
//     // new NPCObj(324, 292, 7, "arts", "NUS", "female"),
//     // new NPCObj(356, 260, 8, "arts", "NUS", "female"),
//     // new NPCObj(388, 228, 9, "law", "NUS", "male"),
//     // new NPCObj(420, 196, 10, "law", "NUS", "male"),
//     // new NPCObj(452, 164, 11, "law", "NUS", "female"),
//     // new NPCObj(484, 132, 12, "law", "NUS", "female")

// 	]};

var tempRenderList;
var inFlightList = new Array();
var laidList = new Array();
var laidCount = 0;

var _inverseFPS = 1.0/30.0;
var context;
var canvas;
var drawOverlay = false;
var overlayTimer = 0;
var overlayImg = new Image();
var bgImg = new Image();
bgImg.src = "images/nus_engin.png";
var DOOR_LEFT_X = 284;
var DOOR_RIGHT_X = 500;
var TOP_DOOR_BOUND_Y = 44;
var BOT_DOOR_BOUND_Y = 500;

//To track global events
var globalTimer=0

var newEntryFlag = 0;



// moved the player to be global variable, so that other functions can assess ~ jensen
var player = null;
var playerActions;
var performingAction = false;


function GameEngine(){
	var _abstract1_canvas = null;
	var _abstract2_canvas = null;

	var _frameNumber = 0;

	this.init = function(abs1_canvas, abs2_canvas) {

        //console.log(influence_btwn_NPCS(0.2, 0.9));
        
        _abstract1_canvas = document.getElementById(abs1_canvas);
        _abstract2_canvas = document.getElementById(abs2_canvas);

        //initialize player object
        player = new PlayerObj(0,0);

        //initialize abstractThree parameters
        var statsMeanArray = [0.5,0.5,0.5];
        var statsVarArray = [0.05,0.05,0.05];

        //initialize simulation manager ~ jensen
        simulation = new SimulationManager();

        abstractTwoContainer = new AbstractTwoContainer();
        abstractThreeContainer = new AbstractThreeContainer();

        //Initialize abstractThreeValues
        abstractThreeContainer.update(statsMeanArray,statsVarArray,"NUS");
        abstractThreeContainer.update(statsMeanArray,statsVarArray,"NTU");

        //Initialize abstractTwoValues
        abstractTwoContainer.init(statsMeanArray, statsVarArray);


        // initialize input manager
        inputManager.init(_inverseFPS);

        //initialize player actions
        playerActions = new PlayerActions();

        //Decompress for first time and populate faculty
        faculty_index = 0;
        simulation.decompressAbstractTwo();
			
        gameEngine.run();
        
        

    }

    this.run = function(){

    	_frameNumber++;

        var clock = new Date();
        var frameStartTime = clock.getTime();

        /*Game Loop Functions*/
        gameEngine.renderCanvas();
        gameEngine.update(_inverseFPS);

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
        player.move();
		player.draw();
        player.skillRender();

        globalTimerWorld();
        liveUpdate_curFacStats();
		

        timeUnit += _inverseFPS;

        //For global events
        globalTimer += _inverseFPS;
        if(globalTimer > 995){
            globalTimer = 0;
        }

        //Check if too many people have left the faculty, introduce new ones
        if(toRenderList.NPCList.length < facPopulation_thresh){
            populateCount = Math.floor((Math.random()*3) + 1);
            newEntryFlag = 1;
            simulation.decompressAbstractTwo();
        }
		displayGlobalEvents();
		tempRenderList = toRenderList;
		for(var i = 0; i < toRenderList.NPCList.length; ++i){
			removeNPCFlag = 0;
			var currNPC =  toRenderList.NPCList[i];
			
			//make them move
			if(!performingAction)
			currNPC.move();
			
			var movement = this.checkFacultyMovement(currNPC);
			var inFlightListFlag = 1;

			//Check if NPC is moving to another faculty
			switch(movement){
				case "engine":
				case "arts":
				case "law":
					if(!currNPC.interaction){
						currNPC.currFaculty = movement;
						inFlightList.push(currNPC);
						removeNPCFlag = 1;
					}
					break;
				case "nothing":
				default:
					break;
			}

			//Remove NPC from current faculty rendering if he/she has left the faculty
			if(removeNPCFlag == 1){
				currNPC.leavingTime = getCurTime();
				toRenderList.NPCList.splice(i,1);
			}
			else{
				//if not removed, draw the character

				currNPC.draw();
				currNPC.interactionCheck();
			}
			
			

		}


        toRenderList = tempRenderList;
		if(debug)
		displayStats();
		if(drawOverlay == true){
			context.drawImage(overlayImg, 0, 0);
			overlayTimer++;
			if(overlayTimer > 50){
				drawOverlay = false;
				performingAction = false;
				overlayTimer = 0;
			}
		}
		if(player.currInteractionStage != 0){
			displayDecisionBox();
		}
		updateAttributes();
		if(debug){
			var myGraph = new Graph({
					  canvasId: 'Debug',
					  minX: 0,
					  minY:0,
					  maxX: 1,
					  maxY:5,
					  unitsPerTick: 1
				  });
			myGraph.drawBarEquation('green', 1);
		}
			
		
    }

    //for NPC only
    this.checkFacultyMovement = function(object){
        if(object.currFaculty == "engine"){
            if(	object.pos_y <= TOP_DOOR_BOUND_Y && 
				object.pos_x >= DOOR_LEFT_X && 
				object.pos_x <= DOOR_RIGHT_X){
                object.destFaculty = "arts";
				return "arts";
            }
            else if(object.pos_y >= BOT_DOOR_BOUND_Y && 
					object.pos_x >= DOOR_LEFT_X && 
					object.pos_x <= DOOR_RIGHT_X){
                object.destFaculty = "law";
				return "law";
            }
        }
        if(object.currFaculty == "arts"){
            if(	object.pos_y <= TOP_DOOR_BOUND_Y && 
				object.pos_x >= DOOR_LEFT_X && 
				object.pos_x <= DOOR_RIGHT_X){
				object.destFaculty = "law";
                return "law";
            }
            else if(object.pos_y >= BOT_DOOR_BOUND_Y && 
					object.pos_x >= DOOR_LEFT_X && 
					object.pos_x <= DOOR_RIGHT_X){
                object.destFaculty = "engine";
				return "engine";
            }
        }
        if(object.currFaculty == "law"){
            if(	object.pos_y <= TOP_DOOR_BOUND_Y && 
				object.pos_x >= DOOR_LEFT_X && 
				object.pos_x <= DOOR_RIGHT_X){
                object.destFaculty = "engine";
				return "engine";
            }
            else if(object.pos_y >= BOT_DOOR_BOUND_Y && 
					object.pos_x >= DOOR_LEFT_X && 
					object.pos_x <= DOOR_RIGHT_X){
                object.destFaculty = "arts";
				return "arts";
            }
        }
        else{
            return "nothing";
        }

    }
}
var gameEngine = new GameEngine();