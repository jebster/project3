//========================
//Authors:
//Varun Ganesh (U095159L)
//Jensen Tan (U084010H)
//========================

var AbstractThreeContainer = function(){

	this.universities = ["NUS", "NTU"];

	this.universityStats = ["",""];

	//???
	this.preferenceTypeModifier = [1.0, 1.0, 1.0]
	this.timeOutOfUniversity;


	this.updatePreference = function(){

		//Exam week
		if(globalTimer > 200 && globalTimer<500){
		 	this.preferenceTypeModifier = [1.4, 0.9, 0.9];
		}
		//Sports Week
		else if(globalTimer > 500 && globalTimer < 700){
			this.preferenceTypeModifier = [0.9, 1.4, 0.9];
		}
		//V day (Talent)
		else if(globalTimer > 700){
			this.preferenceTypeModifier = [0.9, 0.9, 1.4];
		}

		
	}
	this.update = function(statsMeanArray, statsVarArray, university ){

		//order of array is
		//faculty_MeanStats[engin, arts, law]
		var i = this.universities.indexOf(university);
		var faculty_MeanStats = statsMeanArray;
		var faculty_VarStats = statsVarArray;
		var avgMean;
		var avgVar;

		var totalMean = 0;
		var totalVar = 0;


		for(var j =0; j<faculty_MeanStats.length; ++j){
			totalMean += faculty_MeanStats[j];
			totalVar += faculty_VarStats[j];
		}


		avgMean = totalMean / faculty_MeanStats.length;
		avgVar = totalVar / faculty_VarStats.length;

		var parameters = new AbstractThreeParameters(university, statsMeanArray, statsVarArray, avgMean, avgVar);
		this.universityStats[i] = parameters;
	}
}

var AbstractThreeParameters = function(university, facultyMeanStats, facultyVarStats, averageDaveReputationMean, averageDaveReputationVariance){
	this.university = university;
	//arrays of means [engine, arts, law]
	this.facultyMeanStats = facultyMeanStats;
	this.facultyVarStats = facultyVarStats;
	this.averageDaveReputationMean = averageDaveReputationMean;
	this.averageDaveReputationVariance = averageDaveReputationVariance;

	//the last time Dave is seen in the university
	this.lastSeen = getCurTime();

}


