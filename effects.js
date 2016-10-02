center = {x: 225, y: 225}; // center point of the drawing

// DHS symbols
nSystems = 8; // number of DHSis
radius = 180; // radius of DHS symbols circular configuration
DHSradius = 30; // radius of DHS symbol circle
var coordinates = []; // center points of DHS symbols
var allDHS = []; // pointers to DHS symbols

// message symbols
var mC = 0; // message counter
var maxM = 6; // max messages
const messIconWidth = 56;
const messIconHeight = 56; 

/* ---- Utils & preparation */

//
function RandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Compute positions of systems on circle
function computeCoordinates() {
  	var slice, point, i;
  	slice = 2 * Math.PI / nSystems;	
  	for (i = 0; i < nSystems; i++) {
    	angle = slice * i;
    	newX = Math.floor(center.x + radius * Math.cos(angle));
    	newY = Math.floor(center.y + radius * Math.sin(angle));
    	point = {x: newX, y: newY}
    	coordinates.push(point);
	} 
}

// Enlarge system symbol (0.2s)
function enlargeSystemSymbol(s, tL, offset) {
	if (offset !== undefined) {
		tL.to('#DHS' + s.toString(), 0.2, {
			width: 80, height: 80,
			borderRadius: 40,
		  	top: coordinates[s].y - DHSradius - 10,
		  	left: coordinates[s].x - DHSradius - 10},
		  	offset);			
	}
	else {
		tL.to('#DHS' + s.toString(), 0.2, {
			width: 80, height: 80,
			borderRadius: 40,
		  	top: coordinates[s].y - DHSradius - 10,
		  	left: coordinates[s].x - DHSradius - 10});			
	}
}

// Reset system symbol (0.2s)
function resetSystemSymbol(s, tL, offset) {
	if (offset !== undefined) {
		tL.to('#DHS' + s.toString(), 0.2, {
			width: 60, height: 60,
			borderRadius: 30,
		  	top: coordinates[s].y - DHSradius,
		  	left: coordinates[s].x - DHSradius},
		  	offset);	
	}
	else {
		tL.to('#DHS' + s.toString(), 0.2, {
			width: 60, height: 60,
			borderRadius: 30,
		  	top: coordinates[s].y - DHSradius,
		  	left: coordinates[s].x - DHSradius});	
	}
}

// Form a message DOM element, initial position at system sys
// (0-based). Return message jQuery object.
// Initial opacity: 0.
function formAMessage(sys) {
	mC = mC + 1;
	var messId = 'mess' + mC.toString();
	var sym = $('<i class="material-icons">&#xE0BE;</i>')
		.addClass('doku');
	var mess = $('<div></div>')
		.attr('id', messId)
		.addClass('mess')
		.css('left', coordinates[sys].x - messIconWidth / 2)
		.css('top', coordinates[sys].y - messIconHeight / 2)
		.append(sym);
	$('#Messages').append(mess);
	return mess;	
}

// Draw systems and call first effect
function drawSystems(nSystems, radius, center) {
  	var DHS, i, gridCircle;
  	// local timeline
  	var dTL = new TimelineLite({onComplete: 
  		function () { 
  			everybodyGotMail(); // chaining
  		}
  	});	
  	// draw DHS symbols	
  	for (i = 0; i < nSystems; i++) {
		DHS = $('<div></div>')
			.attr('id', 'DHS' + i.toString())
			.addClass('DHS')
			.css('display', 'none')
			.css('left', coordinates[i].x - DHSradius)
			.css('top', coordinates[i].y - DHSradius);
		$('#Systems').append(DHS);
		// Not necessary; remove
		allDHS.push(DHS);
		// growing symbols
		dTL.to(DHS, 0.2, {display: 'block',
			width: DHSradius * 2,
			height: DHSradius * 2,
			borderRadius: DHSradius, delay: 0.1});
	}
}

/* ---- Effects ---- */

function everybodyGotMail() {
	var tL = new TimelineLite();
	var mess, pos, newPos;

	mess = formAMessage(0);
	enlargeSystemSymbol(0, tL);
	tL.to(mess, 0.2, { opacity: 1 }, '-=0.2');
	pos = 0;

	for (i = 0; i < 40; i++) {
		newPos = pos + 1;
		if (newPos == nSystems) {
			newPos = 0;
		}
		enlargeSystemSymbol(newPos, tL);
		// Move to pos
		tL.to(mess, 0.2, {
			left: coordinates[pos].x - messIconWidth / 2, 
			top: coordinates[pos].y - messIconHeight / 2,
			ease:Power4.easeOut}, '-=0.2');					
		resetSystemSymbol(pos, tL, '-=0.2');
		pos = newPos;
	}

}

function animate(){
	computeCoordinates();
	drawSystems(nSystems, radius, center);
}
