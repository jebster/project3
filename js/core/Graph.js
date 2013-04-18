function Graph(config) {


    // user defined properties
    this.canvas = document.getElementById('Debug');
    this.minX = config.minX;
    this.minY = config.minY;
    this.maxX = config.maxX;
    this.maxY = config.maxY;
    this.unitsPerTick = config.unitsPerTick;

    // constants
    this.axisColor = '#aaa';
    this.font = '8pt Calibri';
    this.tickSize = 20;

    // relationships
   // alert('here');
	this.context = this.canvas.getContext('2d');
   // alert('here2');

    //console.log(this.context);

    this.rangeX = this.maxX - this.minX;
    this.rangeY = this.maxY - this.minY;
   // this.unitX = this.canvas.width / this.rangeX;
    this.unitY = this.canvas.height / this.rangeY;
   // this.centerY = Math.round(Math.abs(this.minY / this.rangeY) * this.canvas.height);
  //  this.centerX = Math.round(Math.abs(this.minX / this.rangeX) * this.canvas.width);
    this.iteration = (this.maxX - this.minX) / 1000;
    this.scaleX = this.canvas.width / this.rangeX;
    this.scaleY = this.canvas.height / this.rangeY;

    // draw x and y axis
	this.context.clearRect(0,0,400,400);
    this.drawXAxis();
    this.drawYAxis();
}

Graph.prototype.drawXAxis = function() {
    var context = this.context;
    context.save();
    context.beginPath();
    context.moveTo(0, this.canvas.height);
    context.lineTo(this.canvas.width, this.canvas.height);
    context.strokeStyle = this.axisColor;
    context.lineWidth = 2;
    context.stroke();

    // draw tick marks


  //  var xPosIncrement = 2 * this.unitX;
  //  var xPos, unit;
    context.font = this.font;
    context.textAlign = 'top';
    context.textBaseline = 'bottom';

    /*
    // draw left tick marks
    xPos = this.centerX - xPosIncrement;
    unit = -1 * this.unitsPerTick;
    while(xPos > 0) {
		context.moveTo(xPos, this.centerY - this.tickSize / 2);
		context.lineTo(xPos, this.centerY + this.tickSize / 2);
		context.stroke();
		context.fillText(unit, xPos, this.centerY + this.tickSize / 2 + 3);
		unit -= this.unitsPerTick;
		xPos = Math.round(xPos - xPosIncrement);
    }    */


	// draw right tick marks

		//context.moveTo(this.canvas.width-15, this.canvas.height-15);
		//context.lineTo(this.canvas.width, this.canvas.height);
		//context.stroke();
		context.fillText("1", this.canvas.width -15, this.canvas.height -15);
		//unit += this.unitsPerTick;
		//xPos = Math.round(xPos + xPosIncrement);
		//}
	context.restore();
};

Graph.prototype.drawYAxis = function() {
    var context = this.context;
    context.save();
    context.beginPath();
    context.moveTo(0,this.canvas.height);
    context.lineTo(0,0);
    context.strokeStyle = this.axisColor;
    context.lineWidth = 2;
    context.stroke();

    // draw tick marks
    var yPosIncrement = this.unitsPerTick * this.unitY;
    var yPos, unit;
    context.font = this.font;
    context.textAlign = 'right';
    context.textBaseline = 'bottom';

    // draw top tick marks
    yPos = this.canvas.height - yPosIncrement;
    unit = this.unitsPerTick;
    while(yPos > 0) {
		context.moveTo(0, yPos);
		context.lineTo(0+ this.tickSize / 2, yPos);
		context.stroke();
		context.fillText(unit, 0 +  this.tickSize / 2 + 3, yPos);
		unit += this.unitsPerTick;
		yPos = Math.round(yPos - yPosIncrement);
    }
}  ;
    /*
	// draw bottom tick marks
	yPos = this.centerY + yPosIncrement;
	unit = -1 * this.unitsPerTick;
	while(yPos < this.canvas.height) {
		context.moveTo(this.centerX - this.tickSize / 2, yPos);
		context.lineTo(this.centerX + this.tickSize / 2, yPos);
		context.stroke();
		context.fillText(unit, this.centerX - this.tickSize / 2 - 3, yPos);
		unit -= this.unitsPerTick;
		yPos = Math.round(yPos + yPosIncrement);
	}
	context.restore();
};
      */
Graph.prototype.drawEquation = function(equation, color, thickness) {
	var context = this.context;
	context.save();
	context.save();
	this.transformContext();

	context.beginPath();
	context.moveTo(this.minX, equation(this.minX));

	for(var x = this.minX + this.iteration; x <= this.maxX; x += this.iteration) {
		context.lineTo(x, equation(x));
	}

    context.restore();
    context.lineJoin = 'round';
    context.lineWidth = thickness;
    context.strokeStyle = color;
    context.stroke();
    context.restore();
};

Graph.prototype.drawBarEquation = function(color, thickness) {
	var context = this.context;
	context.save();
	this.transformContext();
	context.beginPath();
	context.moveTo(0,daveReputation_distribution.get_Fx(0));
	context.lineTo(0.02, daveReputation_distribution.get_Fx(0.02));
	context.restore();
	context.lineWidth = thickness;
	context.strokeStyle = color;
	context.stroke();
	context.restore();



	for(x=0.02;x<1;x+=0.02){
        context.save();
        this.transformContext();
		context.beginPath();
		context.moveTo(x-0.02,daveReputation_distribution.get_Fx(x-0.02));
        console.log(daveReputation_distribution.get_Fx(x-0.02))
		//console.log(" checkValu is  ", daveReputation_distribution.get_Fx(x-0.05));
		context.lineTo(x-0.02, 0);
		context.moveTo(x,daveReputation_distribution.get_Fx(x));
		context.lineTo(x-0.02, daveReputation_distribution.get_Fx(x));
		context.lineTo(x-0.02, daveReputation_distribution.get_Fx(x-0.02));
		context.moveTo(x,daveReputation_distribution.get_Fx(x));
		context.lineTo(x, 0);
		context.restore();
		context.lineWidth = thickness;
		context.strokeStyle = color;
		context.stroke();
		context.restore();
	}
};

Graph.prototype.transformContext = function() {
	var context = this.context;

	// move context to center of canvas
	this.context.translate(0, this.canvas.height);

	/*
	 * stretch grid to fit the canvas window, and
	 * invert the y scale so that that increments
	 * as you move upwards
	 */
	context.scale(this.scaleX, -this.scaleY);
	};
   /* var myGraph = new Graph({
        canvasId: 'Debug',
        minX: 0,
        minY: 0,
        maxX: 5,
        maxY: 5,
        unitsPerTick: 1
        });*/

function equationCalc(mean, variance,theX){

	//assuming standard normal distribution, the calculation of z value would be

	var stdDev = Math.sqrt(variance);

	return (1/Math.sqrt(2*Math.PI)* Math.exp(-0.5 * theX * theX));

};

function routeData(x){
	var valueAtPt=  daveReputation_distribution.get_Fx(x);
	if (x!=0){
		var preValueAtPt = daveReputation_distribution.get_Fx(x-0.05);
	}
	else
	 {
		 var preValueAtPt = 0;
	 }

	return (valueAtPt - preValueAtPt);


}


    /*  myGraph.drawEquation(function(x) {
        // console.log(equationCalc(50,10,x));
        return  (equationCalc(50,10,x));
        }, 'green', 1);*/


//myGraph.drawBarEquation('green', 1);