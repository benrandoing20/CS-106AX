/*
 * File: Hailstone.js
 * ------------------
 * This program displays the Hailstone sequence for a number.
 * Modified by Benjamin Randoing on 09/30/2022 for CS 106AX Autumn 2022
 */
"use strict";

function TestHailstone() {
   console.log("Use this expression evaluator to ensure your hailstone implementation works.");
	evaluateExpressions();
	hailstone(17);
}

/*
 * Function: hailstone
 * -------------------
 * Accepts the supplied number and prints the sequence of numbers that lead the original
 * number down to 1 (along with information about how the intermediate numbers were computed).
 */
function hailstone(n) {
	let count = 0;
	while (n != 1) {
		if (n % 2 === 0) {
			let n_old = n
			n /= 2;
			console.log(n_old + " is even, so I take half: " + n);
			count += 1;
		}
		else {
			let n_old = n
			n = (3 * n) + 1;
			console.log(n_old + " is odd, so I make 3n+1: " + n);
			count += 1;
		}
	}
	console.log("The process took " + count + " steps to reach 1.")
}
