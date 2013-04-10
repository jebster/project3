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


}

