function SimulationManager(){
	var _NPCList = [];
	var _abstractPopulation = 40;
	var _decompressFlag = 1;
	var storedListIndex;

	//Will update all objects of an abstracted section according to
	//the prescribed rules/metrics e.g. distribution curves, probabilities etc.
	this.updateAbstraction = function(){
		//updateNPCs();
	}

	this.distributionCurve = function(){

		//formulas and abstraction

	}

	this.varianceCalc = function(){

	}

	// will be triggered when location is changed ~ jensen
	this.changeLocation = function(){

		var destinationFaculty = document.getElementById('location').options[document.getElementById('location').selectedIndex].value;

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


	this.decompressAbstractTwo = function(){
			this.decompressAbstractThree();

			for(var j = 0; j < _abstractPopulation; ++j){
				
				var NPC = new NPCObject(x, y, faculty, university, gender);
				if(NPC.gender == "female"){
					//set attributes by decompressing normal dist
					NPC.preference = something;
				}
				else{
					//set attributes by decompresisn normal dist
				}

				var absList = new AbstractionOneList(id, university, faculty);
				absList.NPCList.push(NPC);
			}

			for(var i = 0; i < inFlightList.length; ++i){
				if(inFlightList[i].currFaculty == absList.faculty &&
					inFlightList[i].currUniversity == absList.university){
					absList.NPCList.push(inFlightList[i]);
				}
			}
		//render this newly created list
		toRenderList = absList;
	}


	this.decompressAbstractThree = function(){

	}


	function abstractTwoMovement(){
		alert('moving within same uni');
		

		//compressLevelOne();
		//populateLowestAbstraction();

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
		compressLevelOne();
		compressLevelTwo();
		populateLowestAbstraction();

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

	function compressLevelOne(){

	}



}

