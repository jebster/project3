var PlayerActions = function(){

	this.timeTaken = 0;
	
	this.talent = function(){
		performingAction = true;
		if(drawOverlay == false){
			drawOverlay = true;
			overlayImg.src = "images/improving_talent.png";
			if(player.talent<1){
				player.talent += 0.1;
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
			if(player.fitness<1){
				player.fitness += 0.1;
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
			if(player.intellect < 1){
				player.intellect += 0.1;
			}
		}

		timeTravel(0.8);
		performingAction = false;
	}

	function timeTravel(timeTaken){

		/*

		LOGIC
		******

		When player performs an action, time passes.
		When time passes, there is:

		In NUS
		=======
		1. daveReputation spreading within current Faculty.
		2. daveReputation spread within other faculties
		3. daveReputation spread due to traffic flow
		No 2, No 3 is done when we simulate Dave leaving a faculty
		No 1 is done when Dave returns to original faculty 

		In NTU
		=======
		1. daveReputation spreading within NTU
		2. daveReputation influence in NTU due to traffic from NUS
		No 1, No 2 is achieved when we simulate Dave leaving NUS

		CONCLUSION: So, by simulating Dave leaving NUSEngin to NTUEngin and coming back again, we can achieve all the above goals

		IMPLEMENTATION
		*******************

		Accelerate Time
		================
		1. Accelerate Time for inFlightList NPC.leftAtTime (by decreasing the number)
		2. Accelerate Time in abstractTwoContainer.statsList[k].lastSeen 
		3. Accelerate Time in abstractThreeContainer.universityStats[0 and 1].lastSeen

		Simulate Exit CurrentUni and coming Back
		=================================
			Exit CurrentUni
			========
		1. Change destinationUni to the other Uni
		2. Change destinationFaculty to Engin (set Engin as default)
		3. Store currentFaculty to var returnBack
		4. simulation.abstractThreeMovement();

			Re-Enter CurrentUni
			=========
		1. Change destinationUni to currentUni
		2. Change destinationFaculty to returnBack (back to original faculty)
		3. simulation.abstractThreeMovement();

		*/

		// Convert it to seconds
		timeTaken *= 60;

		// Accelerate Time
		//=================

		timeUnit += timeTaken; //Game World Timer
		globalTimer += timeTaken; // Global Events Timer

		/*
		//1. For inFlightList
		for(var i = 0; i < inFlightList.length; ++i){
			inFlightList[i].lastSeen -= timeTaken;
		}
		//2. For other faculties
		for(var i=0; i<abstractTwoContainer.faculties.length; ++i){
			abstractTwoContainer.statsList[i].lastSeen -= timeTaken;
		}
		//3. For university
		abstractThreeContainer.universityStats[0].lastSeen -= timeTaken;
		abstractThreeContainer.universityStats[1].lastSeen -= timeTaken;
		*/

		// Exit Current Uni
		//=================
		//1. Change destinationUni to the other uni


		
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
		//Compress the changes and add back to abstract3 container
		currentUni = destinationUni;
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

		simulation.decompressAbstractTwo();

		currentUni = returnUni;
		currentFaculty = destinationFaculty_trunc;
		
	}
}