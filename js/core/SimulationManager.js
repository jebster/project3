function SimulationManager(){
	var _NPCList = [];
	var _abstractPopulation = 40;
	var _decompressFlag = 1;
	var storedListIndex;
	var faculty_index;

	//Will update all objects of an abstracted section according to
	//the prescribed rules/metrics e.g. distribution curves, probabilities etc.


	// will be triggered when location is changed ~ jensen
	this.changeLocation = function(){

		var destinationFaculty = document.getElementById('location').options[document.getElementById('location').selectedIndex].value;
		currentFaculty = destinationFaculty;

		var destinationUni = document.getElementById('location').options[document.getElementById('location').selectedIndex].parentNode.label;
		document.getElementById('display-uni').innerHTML = destinationUni;
		
		switch(destinationFaculty){
			case "engineNUS":
				bgImg.src = "images/nus_engin.png";
				break;
			case "artsNUS":
				bgImg.src = "images/nus_arts.png";
				break;
			case "lawNUS":
				bgImg.src = "images/nus_law.png";
				break;
			case "engineNTU":
				bgImg.src = "images/ntu_engin.png";
				break;
			case "artsNTU":
				bgImg.src = "images/ntu_arts.png";
				break;
			case "lawNTU":
				bgImg.src = "images/ntu_law.png";
				break;
		}
		// if(ABSTRACT_LEVEL == 1){
            // context.clearRect(0,0,canvas.width,canvas.height);
            // context.drawImage(bgImg, 0, 0);
        // }
		
		if(currentUni == destinationUni) {

			this.abstractTwoMovement();

			
		} else {
			
			currentUni = destinationUni;
			this.abstractThreeMovement();
		}
	}

	this.useTime = function() {

		var improveTalent = document.querySelectorAll('input')[0].value;
		player.talent += improveTalent*0.1;

		var improveFitness = document.querySelectorAll('input')[1].value;
		player.fitness += improveFitness*0.1;

		var improveIntellect = document.querySelectorAll('input')[2].value;
		player.intellect += improveIntellect*0.1;

		player.time -= improveIntellect + improveFitness + improveTalent;

		//Update display of value on screen
			//amount of time left
			//progress bar of different attributes
		alert(player.time)

		document.getElementById('time-left').getElementsByTagName('span').innerHTML = player.time;
	}

	this.compressLevelOne = function(){
		var daveReputationArray = [];
		var old_mean;
		var old_var;

		abstractTwoContainer.update();

		//update current facultie's mean and variance
		for(var k = 0; k < abstractTwoContainer.faculties.length; ++k){

			if(abstractTwoContainer.faculties[k] == currentFaculty){
				faculty_index = k;

				for(var i = 0; i < toRenderList.NPCList.length; ++i){
					daveReputationArray.push(toRenderList.NPCList[i].daveReputation);
				}

				

				old_mean = abstractTwoContainer.statsList[k].mean;
				old_var = abstractTwoContainer.statsList[k].variance;

				

				//jensen
				var new_mean = UpdateCurrentFacultyMean(daveReputationArray, old_mean);
				var new_var = UpdateCurrentFacultyVariance(daveReputationArray, old_var);

				abstractTwoContainer.statsList[k].mean = new_mean;
				abstractTwoContainer.statsList[k].variance = new_var;

			}
			//update otherfaculties' mean and variance as a result of traffic flow
			else{
				old_mean =  abstractTwoContainer.statsList[k].mean;
				old_var = abstractTwoContainer.statsList[k].variance;
				var inFlightArray = [];
				for(var i = 0; i < inFlightList.length; ++i){
					if(inFlightList[i].currFaculty == abstractTwoContainer.faculties[k]){
						inFlightArray.push(inFlightList[i].daveReputation);
					}
				}

				//Update the mean and variance using rules (jensen)
				var new_mean = UpdateMeanUsingRules(inFlightArray, old_mean, time_difference);
				var new_var = UpdateVarUsingRules(inFlightArray, old_var, time_difference);

				abstractTwoContainer.statsList[k].mean = new_mean;
				abstractTwoContainer.statsList[k].variance = new_var;
			}
		}
	}

		this.UpdateCurrentFacultyMean = function(daveReputationArray, old_mean) {

			

			return mean(daveReputationArray);


		}

		this.UpdateCurrentFacultyVariance = function(daveReputationArray, old_var) {

			var new_var;

			return new_var;

		}




	this.decompressAbstractTwo = function(){

		var decompression_mean = abstractTwoContainer.statsList[faculty_index].mean;
		var decompression_var = abstractTwoContainer.statsList[faculty_index].variance;
		var absList = new AbstractionOneList(university, faculty);

		for(var j = 0; j < _abstractPopulation; ++j){
			var gender_assign;
			if(ProbabilityChecker(0.5) == 1){
				gender_assign = "male";
			}
			else{
				gender_assign = "female";
			}	
		
			var NPC = new NPCObject(x, y, destinationFaculty, destinationUni, gender_assign);

			if(NPC.gender == "female"){
				//set preferencetype by decompressing normal dist
				NPC.primaryPreferenceIndex = getPreferenceFromNormalDistribution();
			}
			else{
				//set attributes by decompressing normal dist
				NPC.primaryTypeIndex = getTypeFromNormalDistribution(decompression_mean,decompression_var);
			}
			NPC.daveReputation = getRepFromNormalDistribution(decompression_mean,decompression_var);
			absList.NPCList.push(NPC);
		}

		//add in the inflight persons
		for(var i = 0; i < inFlightList.length; ++i){
			if(inFlightList[i].currFaculty == absList.faculty &&
				inFlightList[i].currUniversity == absList.university){
				absList.NPCList.push(inFlightList[i]);
			}
		}
		
		//render this newly created list
		toRenderList = absList;	
	}

	this.compressLevelTwo = function(){
		//Take all stats of three faculties, compress into one
		abstractThreeContainer.update(newvalues);
	}

	this.decompressAbstractThree = function(){
		//Get stats of three faculties, apply rules and update individual faculty stats
		abstractTwoContainer.update(abstractThreeContainer.value);
		//Also need to get information about PreferenceType distribution
		//Apply rules to the preference type distribution, taking into 
		//consideration exam week, vday events and time passed
	}


	this.abstractTwoMovement = function(){

		alert('moving within same uni');
		
		// Happens when time has passed 1 minute
		// Or Dave did an action
		// Or Dave change faculty
		this.compressLevelOne();

		//We only need to decompress and repopulate if Dave moves to another faculty/Uni or does action
		//that takes a lot of time
		//If he's just standing doing nothing in the same faculty, continue in atomic state, no need to decompress.
		if(!(daveDoesNothing)){

			// Or Dave did an action
		// Or Dave change faculty			this.decompressAbstractTwo();
		}

		/*
		Assume Dave starts in NUSEngin

		// At any point of time, we are holding this (global)
		NPC_CurrentFaculty = [ guyObject, girlObject ];

		inFlightList[ guyObject, girlObject];
			
		otherFaculty_1_stats = [ mean, variance ];

		otherFaculty_2_stats = [ mean, variance ];

		currentFaculty_stats = [ mean, variance ];

		// Abstract 3 List (extra info)
		otherUniversity = [ mean, variance ];

		
		X: Perform an action, or goes to NTU, or more than 1 minute - Compression Abstract 1
		========================================================
		// Within Faculty - Compression
		1. Go through all NPCs in NUSEngin, get daveReputation, update currentFaculty_stats.

		
		// Other Faculties  - Compression
		2. Get NUSArts stats, create and populate daveReputationList_NUSArts[ ].
		3. Go through inflighttoNUSArts object, extract daveReputation, and timeNPCLeaves
		4. function spreadingEffect(daveReputation_inflight, timeNPCLeaves) {
	
			// assume 5 units of time has passed since NPC left
			// average out with 5 daveReputation values (based on some intelligence)

		}
		4. Recompute NUSArts stats (otherFaculty_1_stats)
		5. do the same for NUSLaw (otherFaculty_2_stats)




		Y: Goes to NUSEngin from NUSArts (change faculty)  
		=========================================
			1:Compress NUSEngin
			================
			Step X

			2: Decompress NUSArts
			==================
			1. Use NUSArts stats(mean, variance), other info, create NPCs

			// Populate NPC Girls
			2. Use preferenceType percentage (0.2 nerd, 0.5 talent, 0.3 hunk) at AbstractThree to assign the number of NPC girls who has a specific preferenceType

			note: preferenceType works with percentage of population.
			for example:
			- 0.2 of population is nerd
			- 0.5 is talent
			- 0.3 is hunk
			note: when exam time happens, we change accordingly
			- 0.3 nerd
			- 0.5 talent
			- 0.2 hunk

			// Populate NPC Guys
			3. Use probability to assign primaryTypeIndex to guys(0.1 is a lousy nerd, while 0.3 is a good nerd).



		Z: Goes to NTUEngin 
		==========================================
			Compress AbstractTwo Stats (NUS)
			=================================
			1. Perform all steps in X (compress every faculty in NUS and take individual faculty stats), store it as it is
			2. Take average daveReputation of three faculties

			Decompress AbstractThree Stats (NTU)
			===================================
			1. function changeUni(NTU_stats){
				
				//NTU_stats is [NTUEngin_stats, NTUArts_stats, NTULaw_stats]

				function spreadingEffectLevel3(NTU_stats) {
					
					1. Time for daveReputation to spread within NTU
					2. SpreadingEffect from NUS
					- take average daveReputation from all 3 faculties from NUS
					- use it as weightage on how it affects NTU_stats
				}

				function eventsEffectLevel3() {
					//change preferenceType (see Y.2)
				}
			}

			2. Decompress NTUEngin stats (Y.2:)




		*/

		// if(case1) {

		// }else if(case2){


			
		// }

	}

	this.abstractThreeMovement = function(){
		alert('going out of uni');
		this.compressLevelOne();
		this.compressLevelTwo();
		this.decompressAbstractThree();
		this.decompressAbstractTwo();

		/*

		// Dave is in NUS, Dave goes to NTU - Compression
		1. Get all stats from Engin, Arts, Law
		2. Make it into NUS_stats [mean, variance]

		//Entry to NTU - Decompression
		3. Get NTU_stats
		4. Apply RULES2(NTU_stats)
			- time - evolution rule
			- spilloverFactor
			- trafficFlow
		5. Get stats for Engin, Arts, Law in NTU

		*/
	}

	function ProbabilityChecker(probability){
		var chance = Math.random();
		if(chance <= probability){
			return 1;
		}
		return 0;
	}

}

