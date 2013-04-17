
function displayAbstractOne(){
	document.getElementById('abstractOne').style.zIndex = 5;
	document.getElementById('abstractTwo').style.zIndex = 4;
	ABSTRACT_LEVEL = 1;
}

function displayAbstractTwo(){
	document.getElementById('abstractOne').style.zIndex = 4;
	document.getElementById('abstractTwo').style.zIndex = 5;
	ABSTRACT_LEVEL = 2;
}

function viewCalendar(){
	document.getElementById('calendar-modal').style.left = "-5px";
	document.getElementById('date-list-modal').style.left = "-1000px";
	document.getElementById('competitor-list-modal').style.left = "-1000px";
}

function viewCompetitors(){
	document.getElementById('calendar-modal').style.left = "-1000px";
	document.getElementById('date-list-modal').style.left = "-1000px";
	document.getElementById('competitor-list-modal').style.left = "-5px";	
}

function viewDateList(){
	document.getElementById('calendar-modal').style.left = "-1000px";
	document.getElementById('date-list-modal').style.left = "-5px";
	document.getElementById('competitor-list-modal').style.left = "-1000px";
}

function closeModal(){
	document.getElementById('calendar-modal').style.left = "-1000px";
	document.getElementById('date-list-modal').style.left = "-1000px";
	document.getElementById('competitor-list-modal').style.left = "-1000px";
}

function globalTimer(){

	document.getElementById('global-timer').innerHTML = Math.round(getCurTime());

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
			context.fillText(currNPC.preferenceType, currNPC.pos_x, currNPC.pos_y-16);
			context.fillStyle = "rgb(0,0,0)";
			context.fillText(currNPC.daveReputation.toFixed(2), currNPC.pos_x, currNPC.pos_y);
		}
		else{
			//context.fillStyle = "rgb(1,0,0)";
			context.fillText(currNPC.primaryType, currNPC.pos_x, currNPC.pos_y - 32);
			context.fillText(currNPC.primaryTypeScore.toFixed(2), currNPC.pos_x, currNPC.pos_y-16);
			context.fillText(currNPC.daveReputation.toFixed(2), currNPC.pos_x, currNPC.pos_y);
		}
	}
}