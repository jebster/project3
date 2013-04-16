
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

	document.getElementById('global-timer').innerHTML = getCurTime();

}



