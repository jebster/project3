/*
	For explanation see abstraction_explanation.js
*/

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

	//For auto compression purposes (see autoCompress()) - jensen
	var withinFac = null;

	//Spreading at other faculties of his reputation - jensen
	var withinFac_interaction;

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

	/*
	==========================================
	************ Track Movement *****************
	==========================================
	*/

	this.abstractTwoMovement = function(){

		alert('moving within same uni');

		//Moving out of faculty
		withinFac = false;
		
		// Happens when time has passed 1 minute
		// Or Dave did an action
		// Or Dave change faculty
		this.compressLevelOne(withinFac);

		//add here? - Jensen - clarification needed
		this.decompressAbstractTwo();

		//We only need to decompress and repopulate if Dave moves to another faculty/Uni or does action
		//that takes a lot of time
		//If he's just standing doing nothing in the same faculty, continue in atomic state, no need to decompress.
		if(!(daveDoesNothing)){

			// Or Dave did an action
			// Or Dave change faculty			

			this.decompressAbstractTwo();
		}

		/*
			For explanation see abstraction_explanation.js
		*/

	}

	this.abstractThreeMovement = function(){
		alert('going out of uni');

		//Moving out of faculty
		withinFac = false;

		this.compressLevelOne(withinFac);
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

	
	/*========================================
	***** Every 1 minute Refresh Stats *******
	========================================*/

	this.autoCompress = function(){

		//Counter for every 1 minute

		//Still within faculty
		withinFac = true;

		this.compressLevelOne(withinFac);
	}

	/*
	==========================================
	************ COMPRESSION *****************
	==========================================
	*/

	this.compressLevelOne = function(withinFac){

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

				//Check if it is still within faculty or out of faculty
				if(withinFac){
					//do nothing
				}else{
					//if Dave moves out of this faculty, will take down his last seen time. (his reputation wil have some spreading effect among the NPCs when he's away)
					abstractTwoContainer.statsList[k].lastSeen = getCurTime();
				}			

				/*
				var new_mean = UpdateCurrentFacultyMean(daveReputationArray, old_mean);
				var new_var = UpdateCurrentFacultyVariance(daveReputationArray, old_var); */

				abstractTwoContainer.statsList[k].mean = new_mean;
				abstractTwoContainer.statsList[k].variance = new_var;

			}

			//update other faculties' mean and variance as a result of traffic flow
			//
			else{

				//Check if it is still within faculty or out of faculty
				if(withinFac){
					//for AutoCompress, every 1 minute, will decrease the variance
					abstractTwoContainer.statsList[k].variance -= 0.15;
					
				}else{
					
					//if leaves faculty to enter another faculty
					//Will check how long has Dave left that other faculty
					withinFac_interaction = getCurTime() - abstractTwoContainer.statsList[k].lastSeen;
				
					////TO-DO-JENSEN: Formula to have a range to spreading Effect
					if(withinFac_interaction < 10){
						abstractTwoContainer.statsList[k].variance -= 0.05;
					}else if(withinFac_interaction < 30){
						abstractTwoContainer.statsList[k].variance -= 0.1;
					}
					
					abstractTwoContainer.statsList[k].lastSeen = getCurTime();
				}

				

				//Get otherFaculty's stats
				old_mean =  abstractTwoContainer.statsList[k].mean;
				old_var = abstractTwoContainer.statsList[k].variance;

				var otherFac_daveReputation_dis = new NormalDistribution(old_mean,old_var);


				//populate daveReputation list
				var daveRep = 0.1;
				var npcCount = 0;
				daveReputationArray = [] //clear the array first

				//loop through each reputation, get no. of NPC with that reputation
				for(daveRep; daveRep<=1.0; daveRep += 0.1){

					npcCount=otherFac_daveReputation_dis.get_Fx(daveRep);

					//push daveReputation with corresnponding count to the array
					for(var i=0; i<npcCount; i++){
						daveReputationArray.push(daveRep);
					}
				}

				//TO-DO-JENSEN: 
				// randomize order of daveReputationArray;

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
						inFlight_timeLeavesFac = inFlightList[i].lastSeen;
						timeOutFac = currentTime-inFlight_timeLeavesFac;

						//Assume every five seconds away from faculty, NPC can talk to a person.
						talkTo = timeOutFac%5;

						//inFlight goes to talk to this amount of people
						for(var k=0; k<talkTo; k++){
							//the current NPC that inFlight is talking to
							var npc_daveRep = daveReputationArray[array_index];
							//after talking, they influence each other
							//TO-DO-JENSEN: make it more intelligent
							//Extremist people will influence the neutral people, but neutral will not be influenced
							var afterTalk_daveRep = (npc_daveRep+inFlight_daveRep)/2;
							//NPC being talked to has new daveRep
							daveReputationArray[array_index] = afterTalk_daveRep;
							//inFlight modified daveRep pushed to array
							inFlightArray_daveRep.push(afterTalk_daveRep);

							array_index++;
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

	this.compressLevelTwo = function(){
		//Take all stats of three faculties, compress into one


		abstractThreeContainer.update(newvalues);
	}

	/*
	==========================================
	************ DE-COMPRESSION *****************
	==========================================
	*/
	this.decompressAbstractTwo = function(){

		var decompression_mean = abstractTwoContainer.statsList[faculty_index].mean;
		var decompression_var = abstractTwoContainer.statsList[faculty_index].variance;

		//Info + NPC Objects in entered faculty
		var absList = new AbstractionOneList(university, faculty);

		var preferenceTypeStats = abstractTwoContainer.preferenceTypeStats;
		//For all NPC
		var currNPCDaveReputation;
		//Only Girl NPC
		var currNPCPreferenceType;
		//Only Guy NPC
		var currNPCPrimaryTypeIndex;

		//Jensen!
		daveReputation_distribution = new NormalDistribution(decompression_mean, decompression_var);

		this.assignReputationRangeWeightage();

		var index = this.assignReputationRange();

		//Create NPC Girl and Guy 50% chance
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
				//set preferenceType for GIRLS
				var preferencetype_index = AssignDistributionRange(preferenceTypeStats["nerd"], preferenceTypeStats["hunk"], preferenceTypeStats["talent"]);
				currNPCPreferenceType = preferenceTypeList[preferencetype_index];
			}
			else{
				//set primaryType for GUYS

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
					//TO-DO-VARUN: convert it to score
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

	

	this.decompressAbstractThree = function(){
		//Get stats of three faculties, apply rules and update individual faculty stats
		abstractTwoContainer.update(abstractThreeContainer.value);
		//Also need to get information about PreferenceType distribution
		//Apply rules to the preference type distribution, taking into 
		//consideration exam week, vday events and time passed
	}


	

	/******************************/
	/* General Functions  */

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

