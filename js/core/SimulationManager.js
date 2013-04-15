function SimulationManager(){
	var _NPCList = [];
	var _abstractPopulation = 40;
	var _decompressFlag = 1;
	var storedListIndex;
	var faculty_index;

	var daveReputation_distribution;
	var probBadReputation;
	var probNeutralReputation;
	var probGoodReputation;

	var reputationRange_start = [0, 0.3, 0.6];
	var reputationRange_end = [0.3, 0.6, 1.0];

	var primaryTypeIndex_start = [0, 0.3, 0.6];
	var primaryTypeIndex_end = [0.3, 0.6, 1.0];

	var probCurrentFaculty  = 0.7;
	var probOtherFaculty = 0.15;

	var preferenceTypeList = ["nerd", "hunk", "talent"];

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

		//update current faculty's mean and variance
		for(var k = 0; k < abstractTwoContainer.faculties.length; ++k){

			if(abstractTwoContainer.faculties[k] == currentFaculty){
				faculty_index = k;

				// Go through all NPC in current faculty, push it into daveReputationArray
				for(var i = 0; i < toRenderList.NPCList.length; ++i){
					daveReputationArray.push(toRenderList.NPCList[i].daveReputation);
				}

				//old_mean = abstractTwoContainer.statsList[k].mean;
				//old_var = abstractTwoContainer.statsList[k].variance;

				// Update current faculty's stats - Jensen
				var new_mean = mean(daveReputationArray);
				var new_var = variance(daveReputationArray);

				/*
				var new_mean = UpdateCurrentFacultyMean(daveReputationArray, old_mean);
				var new_var = UpdateCurrentFacultyVariance(daveReputationArray, old_var); */

				abstractTwoContainer.statsList[k].mean = new_mean;
				abstractTwoContainer.statsList[k].variance = new_var;

			}
			//update other faculties' mean and variance as a result of traffic flow
			else{

				//Get otherFaculty's stats
				old_mean =  abstractTwoContainer.statsList[k].mean;
				old_var = abstractTwoContainer.statsList[k].variance;

				//populate daveReputation list
				var daveRep = 0.1;
				var npcCount = 0;
				daveReputationArray = [] //clear the array first

				//loop through each reputation, get no. of NPC with that reputation
				for(daveRep=0.1; daveRep<=1.0; davRep += 0.1){
					npcCount=normalDis.get_Fx(daveRep);

					//push daveReputation with corresnponding count to the array
					for(var i=0; i<npcCount; i++){
						daveReputationArray.push(daveRep);
					}
				}

				//Array of daveReputation extracted from inFlight Objects in a faculty
				var inFlightArray_daveRep = [];
				//The values of extracted reputation
				var inFlight_daveRep;
				//The time inFlight NPCs left that faculty
				var inFlight_timeLeavesFac;
				//The time where compression happens
				var currentTime = getCurTime();
				//The time difference
				var timeOutFac;
				//Number of people inFlight has talked to
				var talkTo;
				//Keep track of the people inFlight has talked to
				var array_index=0;

				//Go through inFlight list
				for(var i = 0; i < inFlightList.length; ++i){

					if(inFlightList[i].currFaculty == abstractTwoContainer.faculties[k]){

						//Get daveReputation for inflight
						inFlight_daveRep = inFlightList[i].daveReputation;
						inFlight_timeLeavesFac = inFlightList[i].leftAtTime;
						timeOutFac = currentTime-inFlight_timeLeavesFac;

						//Assume every five seconds away from faculty, NPC can talk to a person.
						talkTo = timeOutFac%5;

						//inFlight goes to talk to this amount of people
						for(var k=0; k<talkTo; k++){
							//the current NPC that inFlight is talking to
							var npc_daveRep = daveReputationArray[array_index];
							//after talking, they influence each other
							var afterTalk_daveRep = (npc_daveRep+inFlight_daveRep)/2;
							//NPC being talked to has new daveRep
							daveReputationArray[array_index] = afterTalk_daveRep;
							//inFlight modified daveRep pushed to array
							inFlightArray_daveRep.push(afterTalk_daveRep);
						}
					}
				}

				//Update the mean and variance (jensen)
				var new_mean = mean(daveReputationArray);
				var new_variance = variance(daveReputationArray);
				//var new_mean = UpdateMeanUsingRules(inFlightArray, old_mean, time_difference);
				//var new_var = UpdateVarUsingRules(inFlightArray, old_var, time_difference);

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

		var preferenceTypeStats = abstractTwoContainer.preferenceTypeStats;

		var currNPCDaveReputation;
		var currNPCPreferenceType;
		var currNPCPrimaryTypeIndex;

		//Jensen!
		daveReputation_distribution = new NormalDistribution(currentFaculty_stats);

		this.assignReputationRangeWeightage();

		var index = this.assignReputationRange();
		for(var j = 0; j < _abstractPopulation; ++j){
			var gender_assign;
			if(ProbabilityChecker(0.5) == 1){
				gender_assign = "male";
			}
			else{
				gender_assign = "female";
			}	
		

			var range_index = AssignDistributionRange(probBadReputation, probNeutralReputation, probGoodReputation);

			currNPCDaveReputation = (Math.random()*(reputationRange_start[range_index])) + reputationRange_end[range_index];

			if(NPC.gender == "female"){
				//set preferenceType
				var preferencetype_index = AssignDistributionRange(preferenceTypeStats["nerd"], preferenceTypeStats["hunk"], preferenceTypeStats["talent"]);
				currNPCPreferenceType = preferenceTypeList[preferencetype_index];
			}
			else{
				var type_index;

				if(currentFaculty == "engine"){
					type_index = AssignDistributionRange(probCurrentFaculty, probOtherFaculty, probOtherFaculty);
				}
				else if(currentFaculty == "arts"){
					type_index = AssignDistributionRange(probOtherFaculty, probCurrentFaculty, probOtherFaculty);
				}
				else{
					type_index = AssignDistributionRange(probOtherFaculty, probOtherFaculty, probCurrentFaculty);
				}
				currNPCPrimaryTypeIndex = (Math.random()*(primaryTypeIndex_start[type_index])) + primaryTypeIndex_end[type_index];
			}

			//====>TO-DO: NEED TO CHANGE CONSTRUCTOR TO IDENTIFY CATEGORY SO THAT CORRESPONDING SPRITE IMAGE CAN BE LOADED
			var NPC = new NPCObject(x, y, id, destinationFaculty, destinationUni, gender_assign, currNPCDaveReputation, currNPCPreferenceType, currNPCPrimaryTypeIndex);
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

	this.assignReputationRangeWeightage = function(){
		var goodRepCount = 0;
		var neutralRepCount = 0;
		var badRepCount = 0;
		var totalCount = 0;

		for(var i= 0; i <= 1.0; i= i + 0.1){
			if(i <= 0.3){
				badRepCount += daveReputation_distribution.get_Fx(i);
			}
			else if (i > 0.3 && i <= 0.6){
				neutralRepCount += daveReputation_distribution.get_Fx(i);
			}
			else{
				goodRepCount += daveReputation_distribution.get_Fx(i);
			}
			totalCount = badRepCount + neutralRepCount + goodRepCount;
			probBadReputation = badRepCount / totalCount;
			probNeutralReputation = neutralRepCount / totalCount;
			probGoodReputation = goodRepCount / totalCount;
		}
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

		function AssignDistributionRange(probability_range0, probability_range1, probability_range2){
		var prob_array = [probability_range0, probability_range1, probability_range2];
		var temp_array = [];

		var lowest_prob;
		var sec_lowest_prob;
		var high_prob;

		var chance = Math.random();

		lowest_prob = FindMinimum(prob_array);

		for(var i=0; i < prob_array.length; ++i){
			if(!(prob_array[i]==lowest_prob)){
				temp_array.push(prob_array[i]);
			}
		}
		prob_array = temp_array;

		sec_lowest_prob = FindMinimum(prob_array);

		for( i=0; i < prob_array.length; ++i){
			if(!(prob_array[i]==sec_lowest_prob)){
				temp_array.push(prob_array[i]);
			}
		}

		prob_array = temp_array;

		high_prob = FindMinimum(prob_array);

		if(chance >=0 && chance <= 0+lowest_prob){
			if(lowest_prob == probability_range0){
				return 0;
			}
			else if(lowest_prob == probability_range1){
				return 1;
			}
			else if(lowest_prob == probability_range2){
				return 2;
			}
		}

		else if(chance > lowest_prob && chance <= lowest_prob + sec_lowest_prob){
			if(sec_lowest_prob == probability_range0){
				return 0;
			}
			else if(sec_lowest_prob == probability_range1){
				return 1;
			}
			else if(sec_lowest_prob == probability_range2){
				return 2;
			}
		}

		else{
			if(high_prob == probability_range0){
				return 0;
			}
			else if(high_prob == probability_range1){
				return 1;
			}
			else if(high_prob == probability_range2){
				return 2;
			}

		}
	}

	function FindMinimum( array ){
		var min = 10;
		for(var i = 0; i < array.length; ++i){
			if(array[i] < min){
				min  = array[i];
			}
		}
		return min;
	}

	function ProbabilityChecker(probability){
		var chance = Math.random();
		if(chance <= probability){
			return 1;
		}
		return 0;
	}

}

