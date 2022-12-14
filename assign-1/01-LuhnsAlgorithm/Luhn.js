/**
 * File: Luhn.js
 * -------------
 * This program exports the isValid predicate method, which returns true
 * if and only if the number supplied as an argument could be a valid credit
 * card number according to Luhn's algorithm.
 *
 * Modified by Ben Randoing 09/29/2022
 *
 * A small code segment was modified to resemble that provided by my Intro
 * Feedback in the function isValid. My original code without TA help was
 * submitted in assignment 0.
 */

"use strict";
const NUMBERS = [ 4460246643298726, 4460246643298627, 4460246643298727, 596825 ];

/* Main program */
function TestLuhnAlgorithm() {
	for (let i = 0; i < NUMBERS.length; i++) {
		console.log("Account number " + NUMBERS[i] + " -> " + (isValid(NUMBERS[i]) ? "valid" : "invalid"));
	}
}

/**
 * Function: isValid
 * -----------------
 * Returns true if and only if the supplied number
 * meets the requirements imposed by Luhn's algorithm.
 */
function isValid(number) {
    // replace the following line with the code that properly computes whether
    // the supplied number is a valid credit card number according to
	// Luhn's algorithm.

	let luhnSum = 0;
	let odd = true;

	while (number > 0) {
		let currentDigit = number % 10;
		if (!odd) {
			currentDigit *= 2;
		}
		if (currentDigit > 9) {
			currentDigit -= 9;
		}
		luhnSum += currentDigit;
		odd = !odd;
		number = Math.floor(number/10);
	}
	return luhnSum % 10 === 0;

}