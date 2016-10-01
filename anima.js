center = {x: 200, y: 200}; // center point of the drawing

// DHS symbols
nSystems = 8; // number of DHSis
radius = 180; // radius of DHS symbols circular configuration
DHSradius = 30; // radius of DHS symbol circle
var coordinates = []; // center points of DHS symbols
var allDHS =[]; // pointers to DHS symbols

// message symbols
var innerRadius = 100;
var innerCoordinates = []; // center points of mess symbols
var mC = 0; // message counter
var maxM = 6; // max messages
const messIconWidth = 56;
const messIconHeight = 56; 

// texts
var tArray = ['faster',
	'distributed',
	'modern',
	'low cost',
	'secure',
	'simple'];

// timelines
var tl; // animation
var textTL; // text timeline

function computeCoordinates() {
  	var slice, point, i;
  	slice = 2 * Math.PI / nSystems;	
  	for (i = 0; i < nSystems; i++) {
    	angle = slice * i;
    	newX = Math.floor(center.x + radius * Math.cos(angle));
    	newY = Math.floor(center.y + radius * Math.sin(angle));
    	point = {x: newX, y: newY}
    	coordinates.push(point);
    	newX = Math.floor(center.x + innerRadius * Math.cos(angle));
    	newY = Math.floor(center.y + innerRadius * Math.sin(angle));
    	point = {x: newX, y: newY}
    	innerCoordinates.push(point);    	
	} 
}

function drawSystems(nSystems, radius, center) {
  	var DHS, i, gridCircle, innerGridCircle;	
  	// draw DHS symbols	
  	for (i = 0; i < nSystems; i++) {
		DHS = $('<div></div>')
			.attr('id', 'DHS' + i.toString())
			.addClass('DHS')
			.css('left', coordinates[i].x - DHSradius)
			.css('top', coordinates[i].y - DHSradius);
		$('#Systems').append(DHS);
		allDHS.push(DHS);
		tl.to(DHS, 0.3, {width: DHSradius * 2, height: DHSradius * 2,
			borderRadius: DHSradius, delay: 0.2});
	}
  	// draw grid circle (transparent)
  	gridCircle = $('<div></div>')
  		.attr('id', 'gridCircle')
  		.css('position', 'absolute')
  		.css('left', center.x - radius)
  		.css('top', center.y - radius)
  		.css('width', radius * 2)
  		.css('height', radius * 2)
  		.css('border-radius', radius)
  		.css('border', '1px solid Coral')
  		.css('opacity', 0)
  		.appendTo($('#Systems'));
  	// accompany with text
  	showText('a new protocol');
  	// fade in grid circle
  	tl.to(gridCircle, 1, {opacity: 1, delay: 0.5});

}

function removeMessage(mess) {
	mess.remove();
}

function animateMessage() {
	var sender, rec, messId, sym, mess, recDHS;
	// sender and rec are in range 0..(nSystems-1) 
	sender = Math.floor(Math.random() * nSystems);
	rec = Math.floor(Math.random() * nSystems);
	if (sender == rec) return;
	mC = mC + 1;
	// show new text, if present
	if (tArray[mC - 1] != '') {
		showText(tArray[mC - 1]);
	}
	// sender and rec enlarge
	senderDHS = '#DHS' + sender.toString();
	recDHS = '#DHS' + rec.toString();
	tl.to(senderDHS, 0.1, {width: 80, height: 80, borderRadius: 40,
	  top: "-=10", left: "-=10"});
	tl.to(recDHS, 0.1, {width: 80, height: 80, borderRadius: 40,
	  top: "-=10", left: "-=10"});
	// tl.to(senderDHS, 0.1, {backgroundColor: "rgba(255, 127, 80, 0.8)"});
	// tl.to(recDHS, 0.1, {backgroundColor: "rgba(255, 127, 80, 0.8)"});
	// Form message
	messId = 'mess' + mC.toString();
	sym = $('<i class="material-icons">&#xE0BE;</i>')
		.addClass('doku');
	mess = $('<div></div>')
		.attr('id', messId)
		.addClass('mess')
		.css('left', coordinates[sender].x - messIconWidth / 2)
		.css('top', coordinates[sender].y - messIconHeight / 2)
		.append(sym);
	$('#Messages').append(mess);
	// Fade the new message in
	tl.to(mess, 0.2, {opacity: 1});
	// Move to rec position
	tl.to(mess, 0.9, {left: coordinates[rec].x - messIconWidth / 2, 
		top: coordinates[rec].y - messIconHeight / 2,
		ease:Power4.easeOut, delay: 0.3});
	// Fade out and remove
	tl.to(mess, 0.1, {opacity: 0.3,
		onComplete: removeMessage,
		onCompleteParams: [mess], delay: 0.2});
	// sender & rec reset
	tl.to(senderDHS, 0, {width: 60, height: 60, borderRadius: 30,
	  top: "+=10", left: "+=10"});
	tl.to(recDHS, 0.1, {width: 60, height: 60, borderRadius: 30,
	  top: "+=10", left: "+=10"});
}

function addTextToCredits(text) {
	var t = $('<p>' + text + '</p>')
		.addClass('creditTxt')
		.appendTo($('#Credits'));
	tl.to(t, 0.2, {opacity: 1});
}

function credits() {
	addTextToCredits('icons: Material Design');
	addTextToCredits('font: Source Code Pro');
	addTextToCredits('animation library: GSAP');
	addTextToCredits('design & code: Priit Parmakson');
}

function drawingFadeOut() {
	tl.to($('#cText'), 0, {opacity: 0});
	tl.to($('#fT'), 0.3, {opacity: 1});
	tl.to($('#gridCircle'), 0.2, {opacity: 0, delay: 0.5});
	tl.to(allDHS, 3, {scale:0.2, opacity:0.3});
	tl.to($('#fT'), 0.6, {opacity: 0, delay: 1});
	credits();
}

function randomMessages() {
	var rand;
    if (mC < maxM) {
    rand = Math.round(Math.random() * (500 - 100)) + 100;
    setTimeout(
    	function() {
            animateMessage();
	        randomMessages();  
        },
        rand);
    }
    else { // Fade out all systems and text
    	drawingFadeOut();
    }
}

function insertT(txt) {
	$('#cText').text(txt);
}

function showText(txt) {
	// Tekst tuleb lisada tweeni onStart funktsiooniga, muidu
	// tekivad tekstid enneaegselt
	var t = $('#cText');
	// fade out previous text
	tl.to(t, 0.3, {opacity: 0});
	// insert and fade in new text
	tl.to(t, 0.3, {opacity: 1, onStart: insertT,
		onStartParams: [txt]});
}

function animate(){
	computeCoordinates();
	tl = new TimelineLite();
	textTL = new TimelineLite();
	drawSystems(nSystems, radius, center);
	setTimeout(function () { randomMessages(); }, 5000);
}
