/*
 * File: Enigma.js
 * ---------------
 * This program implements a graphical simulation of the Enigma machine.
 * Modified by Ben Randoing on October 22, 2022
 */

"use strict";


/* Main program */
function Enigma() {
	let enigmaImage = GImage("EnigmaTopView.png");
	enigmaImage.addEventListener("load", function() {
		let gw = GWindow(enigmaImage.getWidth(), enigmaImage.getHeight());
		gw.add(enigmaImage);
		runEnigmaSimulation(gw);
   });
}

/**
 * runEnigmaSimulation
 * -------------------
 *
 *
 * @param gw The GWindow object that contains the engima machine
 */
function runEnigmaSimulation(gw) {
	let enigma = {keys: [], lamps: [], rotors: [], offsets: [0, 0, 0], pushNext: [false, false]};

	/**
	 * mouseDownAction
	 * ---------------
	 * mouseDownAction is called by an event listener when the mouse is
	 * down. If the user clicks on a GCompound for the keys on the enigma
	 * machine, the keys mouseDownAction is called.
	 *
	 * @param e The parameter containing information regarding the key click.
	 */
	let mouseDownAction = function(e) {
		let letter = gw.getElementAt(e.getX(), e.getY());
		if (letter !== null && letter !== undefined && typeof letter.mouseDownAction === "function") {
			letter.mouseDownAction(enigma);
		}
	};

	/**
	 * Accepts a KeyboardEvent and finds the letter GObject key
	 * that corresponds to the key released.
	 *
	 * The letter identified will be Uppercase
	 */
	function getUpKeystrokeLetter(e) {
		const key = e.key.toUpperCase();
		let letterIndex = key.charCodeAt(0) - "A".charCodeAt(0);
		let letterObj = enigma.keys[letterIndex];
		letterObj.mouseUpAction(enigma);
	}

	/**
	 * Accepts a KeyboardEvent and finds the letter GObject key
	 * that corresponds to the key pressed.
	 *
	 * The letter identified will be Uppercase
	 */
	function getKeystrokeLetter(e) {
		const key = e.key.toUpperCase();
		let letterIndex = key.charCodeAt(0) - "A".charCodeAt(0);
		let letterObj = enigma.keys[letterIndex];
		letterObj.mouseDownAction(enigma);
	}

	/**
	 * mouseUpAction
	 * ---------------
	 * mouseUpAction is called by the event listener for a mouse up event.
	 * If the GCompound with the mouse up event is a key, the keys
	 * mouseUpAction function is called.
	 *
	 * @param e The parameter containing information regarding the key click.
	 */
	let mouseUpAction = function(e) {
		let letter = gw.getElementAt(e.getX(), e.getY());
		if (letter !== null && letter !== undefined && typeof letter.mouseUpAction === "function") {
			letter.mouseUpAction(enigma);
		}
	};

	/**
	 * makeKeys
	 * --------
	 * makeKeys is a function that creates twenty-six GCompunds for each
	 * letter in the alphabet. The keys are placed in the appropriate
	 * location over the keys in the enigma machine image.
	 */
	let makeKeys = function() {
		let keyDiameter = 2 * KEY_RADIUS;
		let innerRadius = KEY_RADIUS - KEY_BORDER;
		let innerDiameter = innerRadius * 2;

		/*
		The following loop iterates 26 times. Each time, a GCompund with an
		outer circle, inner circle, and letter is created and placed in the
		gw over the key in the enigma machine image.
		 */
		for (let i = 0; i < 26; i++) {
			let char = String.fromCharCode("A".charCodeAt(0) + i);

			let xKey = KEY_LOCATIONS[i].x;
			let yKey = KEY_LOCATIONS[i].y;
			let key = GCompound();

			let outCircle = GOval(-KEY_RADIUS, -KEY_RADIUS, keyDiameter, keyDiameter);
			outCircle.setFilled(true);
			outCircle.setFillColor(KEY_BORDER_COLOR);
			key.add(outCircle);

			let innerCircle = GOval(-innerRadius, -innerRadius, innerDiameter, innerDiameter);
			innerCircle.setFilled(true);
			innerCircle.setFillColor(KEY_BGCOLOR);
			key.add(innerCircle);

			let letter = GLabel(char, 0, 0);
			letter.setBaseline("middle");
			letter.setTextAlign("center");
			letter.setFont(KEY_FONT);
			letter.setColor(KEY_UP_COLOR);
			key.add(letter);
			enigma.keys.push(key);


			let permIndex;

			/**
			 * mouseDownAction
			 * ---------------
			 * mouseDownAction is a function that belongs to the key
			 * Object. The function will first progress the fast rotor and
			 * potentially the middle and slow rotors if appropriate. Next,
			 * the function changes the key letter color to indicate
			 * visually the key was pressed. Third, the ke letter is passed
			 * through the enigma machine logic to illuminate the lamp
			 * after being encrypted.
			 */
			key.mouseDownAction = function() {
				// Progressing rotors
				enigma.rotors[2].progress();
				if (enigma.pushNext[0] === true) {
					enigma.rotors[0].progress();
				}
				if (enigma.pushNext[1] === true) {
					enigma.rotors[1].progress();
				}

				// Set key color to indicate key is pressed
				letter.setColor(KEY_DOWN_COLOR);

				// Feed through 3 rotors forward
				let letIndex = enigma.keys.indexOf(key);
				for (let i = 2; i >= 0; i--) {
					permIndex = applyPermutation(letIndex, ROTOR_PERMUTATIONS[i], enigma.offsets[i]);
					letIndex = permIndex;
				}

				// Feed through the reflector
				permIndex = applyPermutation(letIndex, REFLECTOR_PERMUTATION, 0);
				letIndex = permIndex;

				// Feed through the 3 rotors in revers and inverted
				for (let i = 0; i < 3; i++) {
					permIndex = applyPermutation(letIndex, invertKey(ROTOR_PERMUTATIONS[i]), enigma.offsets[i]);
					letIndex = permIndex;
				}

				enigma.lamps[permIndex].letter.setColor(LAMP_ON_COLOR);
			};

			/**
			 * mouseUpAction
			 * -------------
			 * mouseUpAction sets the key color that was pressed back to
			 * the off color to indicate the key is no longer being
			 * pressed and a new key may now be selected.
			 */
			key.mouseUpAction = function() {
				letter.setColor(KEY_UP_COLOR);
				enigma.lamps[permIndex].letter.setColor(LAMP_OFF_COLOR);
			};

			gw.add(key, xKey, yKey);
		}
	};

	/**
	 * makeLamps
	 * ---------
	 * makeLamps creates GCompounds to cover the lamps in the enigma image
	 * in order to show the proper lamp in an illuminated state after
	 * pressing a key.
	 */
	let makeLamps = function() {
		let lampDiameter = 2 * LAMP_RADIUS;

		for (let i = 0; i < 26; i++) {
			let char = String.fromCharCode("A".charCodeAt(0) + i);

			let xKey = LAMP_LOCATIONS[i].x;
			let yKey = LAMP_LOCATIONS[i].y;
			let lamp = GCompound();

			let circle = GOval(-LAMP_RADIUS, -LAMP_RADIUS, lampDiameter, lampDiameter);
			circle.setColor(LAMP_BORDER_COLOR);
			circle.setFilled(true);
			circle.setFillColor(LAMP_BGCOLOR);
			lamp.add(circle);

			let letter = GLabel(char, 0, 0);
			letter.setBaseline("middle");
			letter.setTextAlign("center");
			letter.setFont(LAMP_FONT);
			letter.setColor(LAMP_OFF_COLOR);
			lamp.add(letter);
			lamp.letter = letter;

			gw.add(lamp, xKey, yKey);
			enigma.lamps.push(lamp);
		}
	};

	/**
	 * makeRotors
	 * ----------
	 * makeRotors makes GCompound objects that will allow the rotors to
	 * change letters indicating the specific positioning out of w6
	 * possible orientations. Each rotor also has an offset property that
	 * is crucial to the algorithmic calculation of the encrypted letter
	 * output from a key press.
	 */
	let makeRotors = function() {
		for (let i = 0; i < 3; i++) {
			let xKey = ROTOR_LOCATIONS[i].x;
			let yKey = ROTOR_LOCATIONS[i].y;
			let rotor = GCompound();

			let rect = GRect(-ROTOR_WIDTH/2, -ROTOR_HEIGHT/2, ROTOR_WIDTH, ROTOR_HEIGHT);
			rect.setFilled(true);
			rect.setColor(ROTOR_BGCOLOR);
			rotor.add(rect);

			let start = 0;
			let offset = start % 26;
			rotor.offset = offset;
			let char = String.fromCharCode(65 + (offset));
			rotor.char = char;

			let letter = GLabel(char, 0, 0);
			letter.setBaseline("middle");
			letter.setTextAlign("center");
			letter.setFont(ROTOR_FONT);
			letter.setColor(ROTOR_COLOR);
			rotor.add(letter);
			rotor.perm = ROTOR_PERMUTATIONS[i];

			/**
			 * progress
			 * --------
			 * progress is a function of a rotor object that rotates the
			 * rotor one orientation forward.
			 */
			rotor.progress = function() {
				enigma.pushNext = [false, false];
				offset += 1;
				// The following lines identify the proper letter to show
				char = (String.fromCharCode(65 + (offset % 26)));
				rotor.remove(letter);
				letter = GLabel(char, 0, 0);
				letter.setBaseline("middle");
				letter.setTextAlign("center");
				letter.setFont(ROTOR_FONT);
				letter.setColor(ROTOR_COLOR);
				rotor.add(letter);
				enigma.offsets[i] = offset;
				if (offset % 26 === 0 && enigma.rotors.indexOf(rotor) !== 0) {
					enigma.pushNext[enigma.rotors.indexOf(rotor) - 1] = true;
				}
				// console.log(enigma.pushNext);
			};

			gw.add(rotor, xKey, yKey);
			enigma.rotors.push(rotor);
		}
	};

	/**
	 * progressRotor
	 * ------------
	 * progressRotor is called by the click event listener to progress the
	 * rotor. If the fast orr mid rotors are going fom Z to A, the
	 * following rotor also adjusts by one position.
	 *
	 * @param e
	 */
	let progressRotor = function(e) {
		let rotor = gw.getElementAt(e.getX(), e.getY());
		if (rotor !== null && rotor !== undefined && typeof rotor.progress === "function") {
			rotor.progress();
			if (enigma.pushNext[0] === true) {
				enigma.rotors[0].progress();
			}
			if (enigma.pushNext[1] === true) {
				enigma.rotors[1].progress();
			}
		}
	};

	/**
	 * applyPermutation
	 * ----------------
	 * applyPermutation
	 *
	 * @param index The index of the current letter from a key or previous
	 * permutation
	 * @param permutation The permutation string constant for a given rotor
	 * @param offset The offset indicating the position of rotor currently
	 * @returns {number} The index position indicating the encrypted letter
	 * output
	 */
	let applyPermutation = function(index, permutation, offset) {
		let indexIn = (index + offset) % 26;
		let permLetter = permutation.charAt(indexIn);
		let indexOut = ((permLetter.charCodeAt(0) - "A".charCodeAt(0)) - offset) % 26;
		if (indexOut < 0) {
			indexOut = 26 + indexOut;
		}
		return indexOut;
	};

	/**
	 * invertKey
	 * ---------
	 * invertKey is implemented to flip a permutation string for a
	 * specific rotor to allow correct implementation of encrypting a
	 * letter in revers through the three rotors.
	 * 
	 * @param string The permutation string for a given rotor
	 * @returns {string} The result output after inverting the permutation
	 */
	let invertKey = function(string) {
		let result = "";
		let letToFind;
		for (let i = 0; i < string.length; i++) {
			letToFind = String.fromCharCode(65 + i);
			let index = string.indexOf(letToFind);
			result += String.fromCharCode(65 + index);
		};
		return result;
	};

	/**
	 * The following establishes keys, lamps, rotors, and event listeners
	 * that enable to functionality oof the created keys, lamps, and rotors.
	 */
	makeKeys();
	makeLamps();
	makeRotors();
	gw.addEventListener("mousedown", mouseDownAction);
	gw.addEventListener("mouseup", mouseUpAction);
	gw.addEventListener("click", progressRotor);
	gw.addEventListener("keydown", getKeystrokeLetter);
	gw.addEventListener("keyup", getUpKeystrokeLetter);
}