//========================
//Authors:
//Jensen Tan (U084010H)
//Chow Yuan Ing (U094667E)
//========================
var PlayerActions = function(){

	this.timeTaken = 0;
	
	this.talent = function(){
		performingAction = true;
		if(drawOverlay == false){
			drawOverlay = true;
			overlayImg.src = "images/improving_talent.png";
			player.talent += 0.1;
			if(player.talent>1){
				player.talent = 1;
			}
		}

		timeTravel(0.5);
		performingAction = false;
	}

	this.fitness = function(){
		performingAction = true;
		if(drawOverlay == false){
			drawOverlay = true;
			overlayImg.src = "images/improving_fitness.png";
			player.fitness += 0.1;
			if(player.fitness > 1){
				player.fitness = 1;
			}
		}

		timeTravel(0.5);
		performingAction = false;
	}

	this.intellect = function(){
		performingAction = true;
		if(drawOverlay == false){
			drawOverlay = true;
			overlayImg.src = "images/improving_intellect.png";
			player.intellect += 0.1;
			if(player.intellect > 1){
				player.intellect = 1;
			}
		}

		timeTravel(0.8);
		performingAction = false;
	}

	function timeTravel(timeTaken){

		// Convert it to seconds
		timeTaken *= 60;

		// Accelerate Time
		//=================

		timeUnit += timeTaken; //Game World Timer
		globalTimer += timeTaken; // Global Events Timer

		
		if(currentUni == "NUS"){
			destinationUni = "NTU";
		}else{
			destinationUni = "NUS";
		}

		//2. Default arrival of uni will be in engin
		destinationFaculty_trunc = "engine";

		//3. Store current faculty in a returnback
		var returnBack = currentFaculty;
		var returnUni = currentUni;


		//Compress current Uni, make changes for time spent
		simulation.compressLevelOne();
		simulation.compressLevelTwo();
		//Account for changes in other Uni during time spent
		simulation.decompressAbstractThree();

		//Assumption: During that time, people in inFlightList would have gone to spread reputation in other faculties

		//Compress the changes and add back to abstract3 container
		currentUni = destinationUni;
		//Compress destination uni
		simulation.compressLevelTwo();

		//Get back the stats of current Uni and repopulate

		var uni_index = abstractThreeContainer.universities.indexOf(returnUni);

		var meanStats = abstractThreeContainer.universityStats[uni_index].facultyMeanStats;
		var varStats = abstractThreeContainer.universityStats[uni_index].facultyVarStats;

		for(var i=0; i<abstractTwoContainer.faculties.length; ++i){

			abstractTwoContainer.statsList[i] = new AbstractTwoParameters(abstractTwoContainer.faculties[i], meanStats[i], varStats[i]);

		}

		populateCount = initialPopulation;
		inFlightList = [];

		destinationFaculty_trunc = returnBack;

		//Decompress origin university
		simulation.decompressAbstractTwo();

		currentUni = returnUni;
		currentFaculty = destinationFaculty_trunc;
		
	}
}