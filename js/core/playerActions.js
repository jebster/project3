var PlayerActions = function(){

	this.timeTaken = 0;
	
	this.talent = function(){
		performingAction = true;
		if(drawOverlay == false){
			drawOverlay = true;
			overlayImg.src = "images/improving_talent.png";
			player.talent += 0.01;
		}
		timeTravel(2);
		performingAction = false;
	}

	this.fitness = function(){
		performingAction = true;
		if(drawOverlay == false){
			drawOverlay = true;
			overlayImg.src = "images/improving_fitness.png";
			player.fitness += 0.01;
		}

		timeTravel(2);
		performingAction = false;
	}

	this.intellect = function(){
		performingAction = true;
		if(drawOverlay == false){
			drawOverlay = true;
			overlayImg.src = "images/improving_intellect.png";
			player.intellect += 0.01;
		}

		timeTravel(3);
		performingAction = false;
	}

	function timeTravel(timeTaken){

		/*

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


		// Exit Current Uni
		//=================
		//1. Change destinationUni to the other uni
		if(currentUni == "NUS"){
			destinationUni = "NTU";
		}else{
			destinationUni = "NUS";
		}

		//2. Default arrival of uni will be in engin
		destinationFaculty = "engine";

		//3. Store current faculty in a returnback
		var returnBack = currentFaculty;

		//4. Simulate Going Out of Uni
		simulation.abstractThreeMovement();

		// Re-enter Current Uni
		//=====================
		//1. Change destinationUni to current uni
		destinationUni = currentUni;

		//2. Change destinationFaculty to returnBack (back to original faculty)
		destinationFaculty = returnBack;

		//3. Simulate abstractThreeMovement
		simulation.abstractThreeMovement();












	}
}