var PlayerActions = function(){
	
	this.talent = function(){
		drawOverlay = true;
		overlayImg.src = "images/improving_talent.png";
		player.talent += 0.01;
	}

	this.fitness = function(){
		drawOverlay = true;
		overlayImg.src = "images/improving_fitness.png";
		player.fitness += 0.01;
	}

	this.intellect = function(){
		drawOverlay = true;
		overlayImg.src = "images/improving_intellect.png";
		player.intellect += 0.01;
	}
}