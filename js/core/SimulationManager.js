/*
	For explanation see abstraction_explanation.js
*/

function SimulationManager(){

	var _NPCList = [];
	var _abstractPopulation = 20;
	var _decompressFlag = 1;
	var storedListIndex;

	var daveReputation_distribution;
	var probBadReputation;
	var probNeutralReputation;
	var probGoodReputation;

	var reputationRange_start = [0, 0.3, 0.7];
	var reputationRange_end = [0.3, 0.7, 1.0];

	var primaryTypeIndex_start = [0, 0.3, 0.7];
	var primaryTypeIndex_end = [0.3, 0.7, 1.0];

	var probCurrentFaculty  = 0.7;
	var probOtherFaculty1 = 0.16;
	var probOtherFaculty2 = 0.14;

	var preferenceTypeList = ["nerd", "hunk", "talent"];

	var categoryList = ["engine", "arts", "law"];

	//For auto compression purposes (see autoCompress()) - jensen
	//var withinFac = null;

	//Spreading at other faculties of his reputation - jensen
	var time_elapsed_in_fac;

	// Track Location ~ jensen
	var currentUni = "NUS"; // always start in NUS
	var currentFaculty = "engine";

	var destinationUni = "NUS";
	var destinationFaculty = "engine";

	//Will update all objects of an abstracted section according to
	//the prescribed rules/metrics e.g. distribution curves, probabilities etc.


	// will be triggered when location is changed ~ jensen
	this.changeLocation = function(){

		destinationFaculty = document.getElementById('location').options[document.getElementById('location').selectedIndex].value;

		destinationUni = document.getElementById('location').options[document.getElementById('location').selectedIndex].parentNode.label;
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
			if(!(currentFaculty == destinationFaculty)){
				this.abstractTwoMovement();
			}
			currentFaculty = destinationFaculty;
			
		} else {
			this.abstractThreeMovement();
			currentUni = destinationUni;
			currentFaculty = destinationFaculty;
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
		//withinFac = false;
		
		// Happens when time has passed 1 minute
		// Or Dave did an action
		// Or Dave change faculty
		this.compressLevelOne();

		//add here? - Jensen - clarification needed
		this.decompressAbstractTwo();


	}

	this.abstractThreeMovement = function(){
		alert('going out of uni');

		//Moving out of faculty
		withinFac = false;

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

	
	/*========================================
	***** Every 1 minute Refresh Stats *******
	========================================*/
	/*
	this.autoCompress = function(){

		//Will autoCompress every 100 seconds

		//Get the last two digits of the time (133122334)
		var the_number = getCurTime().toString();
		var temp_end_index = the_number.length;
		var temp_beginning_index = temp_end_index-2;

		var hundred_sec_cycle = the_number.substring( temp_beginning_index , temp_end_index );
		

		//Still within faculty
		withinFac = true;

		//if last two digits is 00, it means it has gone through 100 seconds (except first iteration)
		if(hundred_sec_cycle == 00){
			this.compressLevelOne(withinFac);
		}

	} */

	/*
	==========================================
	************ COMPRESSION *****************
	==========================================
	*/

	this.compressLevelOne = function(){

		var daveReputationArray = [];
		var old_mean;
		var old_var;

		//update current faculty's mean and variance
		for(var k = 0; k < abstractTwoContainer.faculties.length; ++k){

			if(abstractTwoContainer.faculties[k] == currentFaculty){
				faculty_index = k;

				// Go through all NPC in current faculty, push it into daveReputationArray
				for(var i = 0; i < toRenderList.NPCList.length; ++i){
					daveReputationArray.push(toRenderList.NPCList[i].daveReputation);
				}

				// Update current faculty's stats - Jensen
				var new_mean = mean(daveReputationArray);
				var new_var = variance(daveReputationArray);	

	
				//Dave moves out of this faculty, will take down his last seen time. (his reputation wil have some spreading effect among the NPCs when he's away)
				abstractTwoContainer.statsList[k].lastSeen = getCurTime();

				abstractTwoContainer.statsList[k].mean = new_mean;
				abstractTwoContainer.statsList[k].variance = new_var;

			}

			//update other faculties' mean and variance as a result of traffic flow
			else{				

				//Will check how long has Dave left that other faculty
				time_elapsed_in_fac = getCurTime() - abstractTwoContainer.statsList[k].lastSeen;

				//E.g. if inFlight NPC is at another faculty for 4 seconds, they will change the variance by 4/400 = 0.01
				abstractTwoContainer.statsList[k].variance -= time_elapsed_in_fac/400;
				//Reset the timer that keeps track of last time the faculty is being compressed
				abstractTwoContainer.statsList[k].lastSeen = getCurTime();

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

				// Randomize order of daveReputationArray - Jensen
				daveReputationArray = randomizeArray(daveReputationArray);

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
							//influence_btwn_NPCS() returns an array of = [lowerRep, higherRep]
							var afterInfluence = influence_btwn_NPCS(inFlight_daveRep, npc_daveRep);

							//Since afterInfluence[] holds [lowerRep, higherRep], we want to reassign it back
							if(inFlight_daveRep > npc_daveRep){

								npc_daveRep = afterInfluence[0];
								inFlight_daveRep = afterInfluence[1];

							}else {

								npc_daveRep = afterInfluence[1];
								inFlight_daveRep = afterInfluence[0];
							}

							//NPC being talked to has new daveRep
							daveReputationArray[array_index] = npc_daveRep;
							//inFlight modified daveRep pushed to array
							inFlightArray_daveRep.push(inFlight_daveRep);

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

		//Tag the time Dave leaves the university
		if(currentUni === "NUS"){
			abstractThreeContainer.universityStats[0].lastSeen = getCurTime();
		}else{
			abstractThreeContainer.universityStats[1].lastSeen = getCurTime();
		}

		//Take all stats of three faculties, compress into one
		var meanArray = [];
		var varianceArray = [];

		for(var i=0; i<abstractTwoContainer.faculties.length; ++i){
			meanArray.push(abstractTwoContainer.statsList[i].mean);
			varianceArray.push(abstractTwoContainer.statsList[i].variance)
		}

		abstractThreeContainer.update(meanArray, varianceArray, currentUni);
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
		var absList = new AbstractionOneList(currentUni, abstractTwoContainer.faculties[faculty_index]);

		var preferenceTypeStats = abstractTwoContainer.preferenceTypeStats;
		//For all NPC
		var currNPCDaveReputation;
		//Only Girl NPC
		var currNPCPreferenceType;
		//Only Guy NPC
		var currNPCPrimaryTypeIndex;

		//Distribution of reputation for current faculty
		daveReputation_distribution = new NormalDistribution(decompression_mean, decompression_var);

		this.assignReputationRangeWeightage();

		var type_index;
		var score;
		var currNPCcategory;

		//Create NPC Girl and Guy 50% chance
		for(var j = 0; j < _abstractPopulation; ++j){
			var gender_assign;
			if(ProbabilityChecker(0.5) == 1){
				gender_assign = "male";
			}
			else{
				gender_assign = "female";
			}	
		
			//Get which range of reputation to assign based on prob distribution
			var range_index = AssignDistributionRange(probBadReputation, probNeutralReputation, probGoodReputation);

			currNPCDaveReputation = GetWithinRange(reputationRange_start[range_index],reputationRange_end[range_index]);

			if(gender_assign == "female"){
				//set preferenceType for GIRLS
				var preferencetype_index = AssignDistributionRange(preferenceTypeStats["nerd"], preferenceTypeStats["hunk"], preferenceTypeStats["talent"]);
				currNPCPreferenceType = preferenceTypeList[preferencetype_index];
			}
			
			//set primaryType for GUYS
			if(destinationFaculty == "engine"){
				type_index = AssignDistributionRange(probCurrentFaculty, probOtherFaculty1, probOtherFaculty2);
			}
			else if(destinationFaculty == "arts"){
				type_index = AssignDistributionRange(probOtherFaculty1, probCurrentFaculty, probOtherFaculty2);
			}
			else{
				type_index = AssignDistributionRange(probOtherFaculty1, probOtherFaculty2, probCurrentFaculty);
			}

			if(gender_assign == "male"){

				currNPCPrimaryTypeIndex =  GetWithinRange(primaryTypeIndex_start[range_index], primaryTypeIndex_end[range_index]);

				score = ((currNPCPrimaryTypeIndex - primaryTypeIndex_start[type_index])/primaryTypeIndex_end[type_index])*10;

			}
			
			currNPCcategory = categoryList[type_index];

			var NPC = new NPCObj(i+5, i+5, i, currNPCcategory, gender_assign, currNPCDaveReputation, currNPCPreferenceType, currNPCPrimaryTypeIndex);

			if(gender_assign == "male"){
				NPC.primaryTypeScore = score;
				NPC.primaryType = preferenceTypeList[type_index];
			}

			console.log(range_index, currNPCDaveReputation,gender_assign, NPC.category, NPC.preferenceType, NPC.primaryType);

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
				else if (i > 0.3 && i <= 0.7){
					neutralRepCount += daveReputation_distribution.get_Fx(i);
				}
				else{
					goodRepCount += daveReputation_distribution.get_Fx(i);
				}
				totalCount = badRepCount + neutralRepCount + goodRepCount;
			}

			probBadReputation = badRepCount / totalCount;
			probNeutralReputation = neutralRepCount / totalCount;
			probGoodReputation = goodRepCount / totalCount;
	}

	

	this.decompressAbstractThree = function(){
		//Get stats of three faculties, apply rules and update individual faculty stats
		//Destination Uni
		var university_index = abstractThreeContainer.universities.indexOf(destinationUni);
		//Origin Uni
		var otherUni_index = abstractThreeContainer.universities.indexOf(currentUni);

		var current_time = getCurTime();
		var time_elapsed = currentTime - abstractThreeContainer.universityStats[university_index].lastSeen;

		var facultiesMeanStats = abstractThreeContainer.universityStats[university_index].facultyMeanStats;
		var facultiesVarStats = abstractThreeContainer.universityStats[university_index].facultyVarStats;

		//Note: CurrentUni is your destination
		var currUniAvgDaveRepMean =  abstractThreeContainer.universityStats[university_index].averageDaveReputationMean;
		var currUniAvgDaveRepVar =  abstractThreeContainer.universityStats[university_index].averageDaveReputationVariance;

		//Note: otherUni is your origin
		var otherUniAvgDaveRepMean = abstractThreeContainer.universityStats[otherUni_index].averageDaveReputationMean;
		var otherUniAvgDaveRepVar = abstractThreeContainer.universityStats[otherUni_index].averageDaveReputationVariance;

		/*****************************************
		==== Factors that Affect Decompression ==
		******************************************/

		//1. TIME FACTOR
		//==============
			//Get the last four digits of the time (133122334)
			var temp_end_index = time_elapsed.length;
			var temp_beginning_index = temp_end_index-4;

			//ranges from 0000 - 9999 seconds (almost 2 hours)
			var time_cycle = time_elapsed.substring( temp_beginning_index , temp_end_index );

			var time_factor; //different for variance and mean


		//2. TRAFFIC FLOW FACTOR
		//======================
		var traffic_flow_factor = 0.3;

		var rep_factor;

		//ranges from 0.5 to 1.5
		var rep_factor = (otherUniAvgDaveRepMean - 0.5) +1;


		// 1.Reputation spread within destination university for the time passed
		//=====================================================================

		//range of variance decrease is from 0 to 0.01
		time_factor = time_cycle/999900;
	
		//Assume after 9999, spreading effect within university will stabilize
		if(time_cycle<9999){

			//QUESTION: Where do you get abstractTwoContainer?
			for(var i=0; i<abstractTwoContainer.faculties.length; ++i){

				abstractTwoContainer.statsList[i].variance = facultiesVarStats[i] - time_factor;

				//abstractTwoContainer.statsList[i].mean = facultiesMeanStats[i] * rep_factor * time_factor;
				//abstractTwoContainer.statsList[i].variance = facultiesVarStats[i] * rep_factor * time_factor;
			}

		}

		// 2. Reputation spread from other university
		//=====================================================================

		/*
			//For now, ranges from 0.5 to 1.5
			//0.5 means it's bad influence, 1.5 is good
			1. rep_factor = ; 

			// Ranges from 0 to 1.0
			2. traffic_flow_factor = ; //

			// Ranges from 0.0 to 1.0
			3. time_factor
		*/

		//1.0 to 2.0
		time_factor = time_cycle/9999 + 1;

		//ranges 0.5 to 3.0
		//0.5 to 1.75 = -ve
		// 1.75 to 3 = +ve


		var overall_inf_factor = (time_factor * rep_factor * traffic_flow_factor) - 1.75;

		//ranges from 0 to 2
		var overall_inf_factor = ( (traffic_flow_factor + time_factor)/1.5 )*rep_factor;
		

		for(i=0; i<abstractTwoContainer.faculties.length; ++i){

			abstractTwoContainer.statsList[i].mean = facultiesMeanStats[i] * 1;

			//abstractTwoContainer.statsList[i].mean = facultiesMeanStats[i] * rep_factor * time_factor * traffic_flow_factor;
			//abstracTwoContainer.statsList[i].variance = facultiesVarStats[i] * rep_factor * time_factor * traffic_flow_factor;
		}


		//Also need to get information about PreferenceType distribution
		//Apply rules to the preference type distribution, taking into 
		//consideration exam week, vday events and time passed
		for(var i=0; i<abstractTwoContainer.preferenceTypeStats.length; ++i){
			abstractTwoContainer.preferenceTypeStats[i] *= abstractThreeContainer.preferenceTypeModifier[i] * time_factor;
		}
	}


	/******************************/
	/* General Functions  */

	function AssignDistributionRange(probability_range0, probability_range1, probability_range2){
		if(probability_range0 == probability_range1 || probability_range0 == probability_range2){
			probability_range0 += 0.0001;
			if(probability_range1 == probability_range2){
				probability_range1 -= 0.0001;
			}
		}

		var prob_array = [probability_range0, probability_range1, probability_range2];
		var temp_array = [];

		equal_flag = 0;

		var lowest_prob;
		var sec_lowest_prob;
		var high_prob;

		var chance = Math.random();

		lowest_prob = FindMinimum(prob_array);

		for(var i=0; i < prob_array.length; ++i){
			if(!(prob_array[i]==lowest_prob)){
				temp_array.push(prob_array[i]);
			}
			else if(equal_flag == 1){
				temp_array.push(prob_array[i]);
			}
			else{
				equal_flag = 1;
			}
		}

		prob_array = [];
		for(i =0; i< temp_array.length; ++i){
			prob_array[i] = temp_array[i];
		}

		temp_array = [];
		equal_flag = 0;
		sec_lowest_prob = FindMinimum(prob_array);

		for(var i=0; i < prob_array.length; ++i){
			if(!(prob_array[i]==sec_lowest_prob)){
				temp_array.push(prob_array[i]);
			}
			else if(equal_flag == 1){
				temp_array.push(prob_array[i]);
			}
			else{
				equal_flag = 1;
			}
		}

		prob_array = [];
		for(i =0; i< temp_array.length; ++i){
			prob_array[i] = temp_array[i];
		}

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

	function randomizeArray ( myArray ) {

		var i = myArray.length, j, tempi, tempj;

		if ( i === 0 ) return false;

		while ( --i ) {
			j = Math.floor( Math.random() * ( i + 1 ) );
			tempi = myArray[i];
			tempj = myArray[j];
			myArray[i] = tempj;
			myArray[j] = tempi;
		}

		return myArray;
	}

	function GetWithinRange (min, max) {

    	return Math.random() * (max - min) + min;
	}
}