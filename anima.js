center = {x: 225, y: 225}; // center point of the drawing

// DHS symbols
nSystems = 8; // number of DHSis
radius = 180; // radius of DHS symbols circular configuration
DHSradius = 30; // radius of DHS symbol circle
var coordinates = []; // center points of DHS symbols
var allDHS =[]; // pointers to DHS symbols

// message symbols
var mC = 0; // message counter
var maxM = 6; // max messages
const messIconWidth = 56;
const messIconHeight = 56; 

// texts
var tArray = ['a new protocol', 'faster',
	'distributed',
	'modern',
	'low cost',
	'secure',
	'simple'];
var tC = -1; // text counter	

// ---- Utility ----

// Shuffles array in place.
function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
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

// Enlarge system symbol
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

// Reset system symbol
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

// Display new text
function advanceText(tL) {

	// Fade out the old and fade in the new text. 0.6 s
	function showText(tL, txt) {
		// Tekst tuleb lisada tweeni onStart funktsiooniga, muidu
		// tekivad tekstid enneaegselt
		var t = $('#cText');
		// fade out previous text
		tL.to(t, 0.3, {opacity: 0});
		// insert and fade in new text
		tL.to(t, 0.3, {opacity: 1,
			onStart: function (txt) {
				$('#cText').text(txt);
			},
			onStartParams: [txt]});
		// show 2 s
	}

	tC = tC + 1;
	if (tC == tArray.length) {
		tC = 0
	}
	showText(tL, tArray[tC]);	
}

// Play the credits
function credits() {
	var tl = new TimelineLite();

	function drawingFadeOut() {
		tl.to($('#cText'), 0, {opacity: 0});
		tl.to($('#fT'), 0.3, {opacity: 1});
		tl.to($('#gridCircle'), 0.2, {opacity: 0, delay: 0.5});
		tl.to(allDHS, 3, {scale:0.2, opacity:0.3});
		tl.to($('#fT'), 0.6, {opacity: 0, delay: 1});
	}

	function addTextToCredits(text) {
		var t = $('<p>' + text + '</p>')
			.addClass('creditTxt')
			.appendTo($('#Credits'));
		tl.to(t, 0.2, {opacity: 1});
	}

	drawingFadeOut();
	addTextToCredits('icons: Material Design');
	addTextToCredits('font: Source Code Pro');
	addTextToCredits('animation library: GSAP');
	addTextToCredits('design & code:');
	addTextToCredits('Priit Parmakson');
}

/* ---- Main ---- */

// Draw systems and call backAndForth()
function drawSystems(nSystems, radius, center) {
  	var DHS, i, gridCircle, innerGridCircle;

  	// local timeline
  	var dTL = new TimelineLite({onComplete: 
  		function () { 
  			// alert('drawSystems complete');
  			backAndForth(2); // chaining
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

  	// draw grid circle (transparent)
  	gridCircle = $('<div></div>')
  		.attr('id', 'gridCircle')
  		.css('position', 'absolute')
  		.css('left', center.x - radius)
  		.css('top', center.y - radius)
  		.css('width', radius * 2)
  		.css('height', radius * 2)
  		.css('border-radius', radius)
  		.css('border', '1px solid White')
  		.css('opacity', 0)
  		.appendTo($('#Systems'));

  	// accompany with text
  	advanceText(dTL);

  	// fade in grid circle
  	dTL.to(gridCircle, 1, {
  		opacity: 1, 
  		delay: 0.5});
}

/* ---- Effects ---- */

// Back and forth movement. Repeat n times, for different systems,
// then chain to toAllOthers()
function backAndForth(n) {

	if (n == 0) {
		return
	}

	var mTL = new TimelineLite({onComplete:
		function (n) { 
			if (n == 0) {
				toAllOthers(2);
			}
			else {
				backAndForth(n);
			}
		},
		onCompleteParams: [n - 1]
	});

	// Animate a message from s to r
	function animateM(s, r) {
		var mess = formAMessage(s);
		// Fade the new message in
		mTL.to(mess, 0.2, {opacity: 1}, '-=0.2');
		// Move to rec position
		mTL.to(mess, 0.2, {left: coordinates[r].x - messIconWidth / 2, 
			top: coordinates[r].y - messIconHeight / 2,
			ease:Power4.easeOut, delay: 0.1});
		// Fade out and remove
		mTL.to(mess, 0.1, {opacity: 0.3,
			onComplete: function (mess) { mess.remove(); },
			onCompleteParams: [mess], delay: 0.1});
	}

	advanceText(mTL);

	// randomly select a sender and receiver
	var s = Math.floor(Math.random() * nSystems); // mess sender
	var r = s;
	while (r == s) {
		r = Math.floor(Math.random() * nSystems); // mess sender
	}
	// enlarge the systems
	enlargeSystemSymbol(s, mTL);
	enlargeSystemSymbol(r, mTL, '-=0.2');

	// send a message
	for (var i = 0; i < 1; i++) {
		// move the message
		animateM(s, r);
		animateM(r, s);
	}

	// reset systems
	resetSystemSymbol(s, mTL);
	resetSystemSymbol(r, mTL, '-=0.2');
}

// Circular movement of a message
function everybodyGotMail() {
	var tL = new TimelineLite({ onComplete: credits });
	var mess, pos, newPos;

	advanceText(tL);

	mess = formAMessage(0);
	enlargeSystemSymbol(0, tL);
	tL.to(mess, 0.2, { opacity: 1 }, '-=0.2');
	pos = 0;

	for (i = 0; i < 20; i++) {
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

	// cleanup
	// remove mess
	tL.to(mess, 0.1, { opacity: 0 });
}

// Send messages from randomly selected sender to all others.
// Repeat n times. Chain to everybodyGotMail
function toAllOthers(n) {
	if (n == 0) {
		return
	}

	var mTL = new TimelineLite({onComplete:
		function (n) {
			if (n == 0) {
				everybodyGotMail();
			}
			else {
				toAllOthers(n);
			}
		},
		onCompleteParams: [n - 1]
	});

	// Animate a message from s to r
	function animateM(s, r) {
		var mess = formAMessage(s);
		// Fade the new message in
		mTL.to(mess, 0.2, {opacity: 1},
			'-=1.7');
		// Move to rec position
		mTL.to(mess, 0.9, {left: coordinates[r].x - messIconWidth / 2, 
			top: coordinates[r].y - messIconHeight / 2,
			ease:Power4.easeOut, delay: 0.3},
			'-=1.5');
		// Fade out and remove
		mTL.to(mess, 0.1, {opacity: 0.3,
			onComplete: function (mess) { mess.remove(); },
			onCompleteParams: [mess], delay: 0.2},
			'-=0.3');
	}

	advanceText(mTL);

	// randomly select a sender
	var s = Math.floor(Math.random() * nSystems); // mess sender

	// enlarge the systems
	enlargeSystemSymbol(0, mTL);
	for (i = 1; i < nSystems; i++) {
		enlargeSystemSymbol(i, mTL, '-=0.2');
	}

	// send a message to all other systems
	// hack
	mTL.to('#DHS0', 1.7, {opacity: 0.9});
	for (var r = 0; r < nSystems; r++) {
		// move the message
		if (s != r) {
			animateM(s, r);
		}
	}

	// reset systems
	resetSystemSymbol(0, mTL);
	for (i = 1; i < nSystems; i++) {
		resetSystemSymbol(i, Material, '-=0.2');
	}
}

/* ---- Initiation ---- */

function animate(){
	computeCoordinates();
	drawSystems(nSystems, radius, center);
}
