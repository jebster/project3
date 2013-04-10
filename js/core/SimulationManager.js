function SimulationManager(){
	var studentList = [];

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

		if(currentUni == destinationUni) {

			abstractTwoMovement();

			
		} else {
			
			currentUni = destinationUni;
			abstractThreeMovement();
		}


		function abstractTwoMovement(){
			alert('moving within same uni');
		}

		function abstractThreeMovement(){
			alert('going out of uni');
		}

		
	}

	this.useTime = function() {


		var improveTalent = document.querySelectorAll('input')[0].value;
		player.talent += improveTalent*0.1;

		var improveFitness = document.querySelectorAll('input')[1].value;
		player.fitness += improveFitness*0.1;

		var improveIntellect = document.querySelectorAll('input')[2].value;
		player.intellect += improveIntellect*0.1;

		player.time -= 20;

		alert(player.time)

		document.getElementById('time-left').getElementsByTagName('span').innerHTML = player.time;
	}


}

