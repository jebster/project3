var AbstractThreeContainer = function(){

	this.universities = ["NUS", "NTU"];

	this.universityStats = ["",""];

	//???
	this.preferenceTypeModifier;
	this.timeOutOfUniversity;


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


