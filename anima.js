nDHS = 6 // number of DHSis
// positions of DHSis
posDHS = [[2, 1], [3, 2], [3, 3], [2, 4], [1, 3], [1, 2]];
stepX = 150; // step between positions
stepY = 100;
var ctx; // canvas

/* 
animateTraffic();
acquireDHXDVK();
acquireDHX();
animateTraffic();
removeDVK(); */

function drawDHSis() {
	for (let DHS of posDHS) {
  		ctx.strokeRect(DHS[0] * stepX, DHS[1] * stepY, 
  			50,50);
	}
}

function drawDVK() {
	ctx.strokeRect(2 * stepX, 2.5 * stepY, 50, 50);
}

function draw(){
	var canvas = document.getElementById('ala');
	if (canvas.getContext){
  		ctx = canvas.getContext('2d');
  		drawDHSis();
  		drawDVK();
	}
}
