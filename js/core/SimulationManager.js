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

			abstractTwoMovement();

			
		} else {
			
			currentUni = destinationUni;
			abstractThreeMovement();
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


	function abstractTwoMovement(){
		alert('moving within same uni');
		
		this.compressLevelOne();

		//We only need to decompress and repopulate if Dave moves to another faculty/Uni or does action
		//that takes a lot of time
		//If he's just standing doing nothing in the same faculty, continue in atomic state, no need to decompress.
		if(!(daveDoesNothing)){
			this.decompressAbstractTwo();
		}

		/*
		Assume Dave starts in NUSEngin

		NPC_CurrentFaculty = [ guyObject, girlObject ];
			
		otherFaculty_1_stats = [ mean, variance ];

		otherFaculty_2_stats = [ mean, variance ];

		
		Perform an action, or goes to NTU, or more than 30 seconds
		=========================================
		// Within Faculty - Compression
		1. Go through all NPCs in NUSEngin, get daveReputation, update NUSEngin Stats.

		// Other Faculties - Decompression
		2. Get NUSArts stats, populate daveReputationList_NUSArts[ ].
		3. Go through inflighttoNUSArts object, extract daveReputation
		4. Add daveReputation to daveReputationList_NUSArts[    ]
		4. Recompute NUSArts stats 
		5. function RULE1(stats) 
		- Add in SpreadingEffect[ taking into account time]
		- Action: 10 units
		- NTU: 20 units
		- Timer: variable
		6. Get new NUSArts stats
		7. From Stats to Individual daveReputation

		8. Do the same for NUSLaw. 



		*/

		// if(case1) {

		// }else if(case2){


			
		// }

	}

	function abstractThreeMovement(){
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

