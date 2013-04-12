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

	this.populateLowestAbstraction = function(){
		for(var i = 0; i<allAbstractionLists.length; ++i){
			if(_decompressFlag == 1){
				if(allAbstractionLists[i].university == currentUni && allAbstractionLists.faculty  == currentFaculty){
					if(allAbstractionLists[i].timer > 0){
						_decompressFlag = 0;
						storedListIndex = i;
					}
				}
			}
		}

		if(_decompressFlag == 1){
			this.decompressAbstractThree();
			this.decompressAbstractTwo();

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
				absList.push(NPC);
			}
		//push the newly created list to the remembered lists
		allAbstractionLists.push(absList)
		//render this newly created list
		toRenderList = allAbstractionLists[allAbstractionLists.length - 1];
		}
		
		else if(_decompressFlag == 0){
			//if there is no need for decompressing, just render the remembered list
			toRenderList = allAbstractionLists[storedListIndex];
		}
	}

	this.decompressAbstractTwo = function(){

	}

	this.decompressAbstractThree = function(){

	}


	function abstractTwoMovement(){
		alert('moving within same uni');
	}

	function abstractThreeMovement(){
		alert('going out of uni');
	}



}

