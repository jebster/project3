function viewInteractionEva(){

	document.getElementById('evaluation-modal').style.left = "-5px";
}

function closeModal(){

	document.getElementById('evaluation-modal').style.left = "-1000px";
}

function globalTimerWorld(){

	document.getElementById('gameWorld-timer').innerHTML = Math.round(getCurTime());

}

function updateAttributes(){
	document.getElementById('talent-bar').style.cssText = "width: " + player.talent * 100 + "%";
	document.getElementById('fitness-bar').style.cssText = "width: " + player.fitness * 100 + "%";
	document.getElementById('intellect-bar').style.cssText = "width: " + player.intellect * 100 + "%";	
}

function displayDecisionBox(){
	var decisionBoxImage = new Image();
	if(player.currInteractionStage == 1){
		decisionBoxImage.src = "images/first_interaction.png";
	}
	if(player.currInteractionStage == 2){
		decisionBoxImage.src = "images/second_interaction.png";
	}
	context.drawImage(decisionBoxImage, 200,100);
}

function displayStats(){
	for(iter in toRenderList.NPCList){
		var currNPC = toRenderList.NPCList[iter];
		context.font = "16px Helvetica";
		
		if (currNPC.gender == "female"){
			context.fillStyle = "#B0171F";
			context.fillText(currNPC.preferenceType, currNPC.pos_x, currNPC.pos_y-32);
			context.fillText(currNPC.primaryPreference_best.toFixed(2), currNPC.pos_x, currNPC.pos_y-16);
			context.fillStyle = "#000000";
			context.fillText(currNPC.daveReputation.toFixed(2), currNPC.pos_x, currNPC.pos_y);
		}
		else{
			context.fillStyle = "#0000A0";
			context.fillText(currNPC.primaryType, currNPC.pos_x, currNPC.pos_y - 32);
			context.fillText(currNPC.primaryTypeScore.toFixed(2), currNPC.pos_x, currNPC.pos_y-16);
			context.fillStyle = "#000000";
			context.fillText(currNPC.daveReputation.toFixed(2), currNPC.pos_x, currNPC.pos_y);
		}
		context.fillStyle = "#000000";
		if(currNPC.gender == "male")
		context.fillText(currNPC.gender + currNPC.id, currNPC.pos_x-5, currNPC.pos_y-48);
		if(currNPC.gender == "female")
		context.fillText(currNPC.gender + currNPC.id, currNPC.pos_x-13, currNPC.pos_y-48);
	}
}

function displayGlobalEvents(){
	
	if(getCurTime()%1000 > 200 && getCurTime()%1000 < 500){
		context.fillStyle = "#FFFFFF";
		context.fillRect(366,50,104,30);
		context.fillStyle = "#000000";
		context.fillText("EXAM WEEK", 368, 70);
	}
	if(getCurTime()%1000 > 500 && getCurTime()%1000 < 700){
		context.fillStyle = "#FFFFFF";
		context.fillRect(358,50,120,30);
		context.fillStyle = "#000000";
		context.fillText("SPORTS WEEK", 360, 70);
	}
	if(getCurTime()%1000 > 700 && getCurTime()%1000 < 995){
		context.fillStyle = "#FFFFFF";
		context.fillRect(385,50,55,30);
		context.fillStyle = "#000000";
		context.fillText("V DAY", 388, 70);
	}
	
}

function displayCurFacStats(){

	document.getElementById('curFac-modal').style.left = "-5px";
}

	function closeModalStats(){
		document.getElementById('curFac-modal').style.left = "-1000px";
	}

	function liveUpdate_curFacStats(){

		//Girl's Primary Preference(% of Population)
		//*******************************************
		document.getElementById('stats-girl-nerd').innerHTML = Math.ceil(abstractTwoContainer.preferenceTypeStats[0] * 1000) / 1000;
		document.getElementById('stats-girl-hunk').innerHTML = Math.ceil(abstractTwoContainer.preferenceTypeStats[1] * 1000) / 1000;
		document.getElementById('stats-girl-talent').innerHTML = Math.ceil(abstractTwoContainer.preferenceTypeStats[2] * 1000) / 1000;

		//Update Guy's Percentage in a Faculty
		//*******************************************
		var nerdCount=0;
		var talentCount=0;
		var hunkCount=0;
		var totalGuys=0;

		var daveRep = [];

		for(var i=0; i<toRenderList.NPCList.length; i++){
			//only check guys
			if(toRenderList.NPCList[i].gender == 'male'){

				totalGuys++;

				switch(toRenderList.NPCList[i].primaryType){
					case 'nerd':
						nerdCount++;
						break;
					case 'talent':
						talentCount++;
						break;
					case 'hunk':
						hunkCount++;
						break;
				}


			//to collect Dave's Reputation
			daveRep.push(toRenderList.NPCList[i].daveReputation);

			}
			
		}

		//Guy's Primary Type(% of Population)
		document.getElementById('stats-guy-total').innerHTML = totalGuys;
		document.getElementById('stats-guy-nerd').innerHTML = nerdCount;
		document.getElementById('stats-guy-talent').innerHTML = talentCount;
		document.getElementById('stats-guy-hunk').innerHTML = hunkCount;
		

		//Update Dave's Reputation in Faculty
		//*******************************************

		document.getElementById('daveRep-mean').innerHTML = Math.ceil(mean(daveRep) * 1000) / 1000;
		document.getElementById('daveRep-var').innerHTML = Math.ceil(variance(daveRep) * 100000) / 100000;
		
		



	}

	function spawnLaidGirl(){

		var NPC = new NPCObj('fake', 'engine', 'engine', 'female', 0.3, 'hunk', 0.2);
		NPC.laidWithDave = true;
		toRenderList.NPCList.push(NPC);
		laidList.push(NPC);

		laidCount++;
		document.getElementById('laid-count-dis').innerHTML = laidCount;
	}
	
	function toggleDebug(){
		if (debug){
			debug = false;
			//var tmpCanvas = document.getElementById('Debug');
			//var tmpContext = tmpCanvas.getContext('2d');
			//tmpContext.clearRect(0,0,1000,1000);
		}
		else{
			debug = true;
		}
	}


