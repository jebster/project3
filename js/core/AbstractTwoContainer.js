var AbstractTwoContainer = function(){

	this.abstractThreeValue;

	//this.bins = new Array(AbstractTwoBin())
	this.university = null;

	//Array of faculties in both NUS and NTU
	this.faculties = ["engine", "arts", "law"];

	this.statsList = [];

	this.preferenceTypeStats = {
		nerd : 0.2,
		hunk : 0.5,
		talent : 0.3
	}


	this.update = function(){
		
		for(var i = 0; i < this.faculties.length; ++i){
			var faculty_mean = getMeanFromAbstractThree();
			var faculty_variance = getVarFromAbstractThree();
			var faculty_stats = new AbstractTwoParameters(this.faculties[i],faculty_mean,faculty_variance);
			this.statsList.push(faculty_stats);
		}
	}
}

function getMeanFromAbstractThree(){

	//dummy data for now
	return 0.5;

}

function getVarFromAbstractThree(){

	//dummy data for now
	return 0.2;
}

var AbstractTwoParameters = function(faculty, mean, variance){
	this.faculty = faculty;
	this.mean = mean;
	this.variance = variance;

	//Keep track of the last time Dave is in this faculty
	this.lastSeen = 0;
}



// 


