/*
 * File: Narcissistic.js
 * ------------------
 * This program checks whether a number is narcissistic (i.e. it is an n-digit
 * number and its digits raised to the nth power sum to the number itself).
 */
"use strict";

function TestNarcissisticNumbers() {
    console.log("Type a function call into the console and press enter. "
        + "(e.g. try running \"Narcissistic(153);\")");
    evaluateExpressions();
}

/**
 * Function: Narcissistic
 * ----------------------
 * Returns true if and only if the supplied number is
 * narcissistic, as outlined in the statement of Problem 1.
 */
function Narcissistic(number) {
	let len = countDigits(number);
	let original = number;
	let sum = 0;
	while (number > 0) {
		let digit = number % 10;
		sum += Math.pow(digit, len);
		number = Math.floor(number/10);
	}
	return sum === original;
}

/**
 * Function: countDigits
 * ---------------------
 * Returns the number of digits in the supplied number.
 */
function countDigits(number) {
	let count = 0;
	while (number > 0) {
		count++;
		number = Math.floor(number/10);
	}
	return count;
}
