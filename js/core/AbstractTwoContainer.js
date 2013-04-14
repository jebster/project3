var AbstractTwoContainer = function(){

	this.abstractThreeValue;

	//this.bins = new Array(AbstractTwoBin())
	this.university = null;

	//Array of faculties in both NUS and NTU
	this.faculties = ["engine", "arts", "law"]

	this.statsList = [];

	this.preferenceTypeStats;

	this.update = function(abstractThreeValue){
		for(var i = 0; i < this.faculties.length; ++i){
			var faculty_mean = getMeanFromAbstractThree();
			var faculty_variance = getVarFromAbstractThree();
			var faculty_stats = new AbstractTwoParameters(this.faculties[i],faculty_mean,faculty_variance);
			statsList.push(faculty_stats);
		}
	}
}

function getMeanFromAbstractThree(){

}

function getVarFromAbstractThree(){
	
}

var AbstractTwoParameters = function(faculty, mean, variance){
	this.faculty = faculty;
	this.mean = mean;
	this.variance = variance;
}



// 


