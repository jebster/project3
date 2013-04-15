var AbstractThreeContainer = function(){

	this.universities = ["NUS", "NTU"];

	this.universityStats = ["",""];

	//???
	this.preferenceTypeModifier = [1.0, 1.0, 1.0]
	this.timeOutOfUniversity;

	this.globalTimer;

	this.updatePreference = function(){
		//Exam week
		if(this.globalTimer > 300 && this.globalTimer<600){
		 	this.preferenceTypeModifier = [1.5, 0.7, 0.7];

		}
		//Sports Week
		else if(this.globalTimer > 600 && this.globalTimer < 900){
			this.preferenceTypeModifier = [0.6, 1.5, 0.7];
		}
		//V day (Talent)
		else if(this.globalTimer > 900){
			this.preferenceTypeModifier = [0.6, 0.6, 1.5];
		}

		if(this.globalTimer > 1200){
			this.globalTimer = 0;
		}
	}
	this.update = function(statsMeanArray, statsVarArray, unversity ){

		//order of array is
		//faculty_MeanStats[engin, arts, law]
		var i = this.universities.indexOf(unversity);
		var faculty_MeanStats = statsMeanArray;
		var faculty_VarStats = statsVarArray;
		var avgMean;
		var avgVar;

		var totalMean = 0;
		var totalVar = 0;

		for(var j =0; j<faculty_MeanStats.length; ++i){
			totalMean += faculty_MeanStats[j];
			totalVar += faculty_VarStats[j];
		}

		avgMean = totalMean / faculty_MeanStats.length;
		avgVar = totalVar / faculty_VarStats.length;

		var parameters = new AbstractThreeParameters(university, statsMeanArray, statsVarArray, avgMean, avgVar);
		universityStats[i] = parameters;
	}
}

var AbstractThreeParameters = function(university, facultyMeanStats, facultyVarStats, averageDaveReputationMean, averageDaveReputationVariance){
	this.unversity = university;
	this.facultyMeanStats = facultyMeanStats;
	this.facultyVarStats = facultyVarStats;
	this.averageDaveReputationMean = averageDaveReputationMean;
	this.averageDaveReputationVariance = averageDaveReputationVariance;

}


