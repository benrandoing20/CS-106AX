/*
 * File: RandomCircles.js
 * ------------------------
 * This program draws a set of 10 circles with different sizes,
 * positions, and colors.  Each circle has a randomly chosen
 * color, a randomly chosen radius between 5 and 50 pixels,
 * and a randomly chosen position on the canvas, subject to
 * the condition that the entire circle must fit inside the
 * canvas without extending past the edge.
 */
"use strict";

/* Constants */ 

const NCIRCLES = 10; 
const MIN_DIAMETER = 10;
const MAX_DIAMETER = 100; 
const GWINDOW_WIDTH = 500;
const GWINDOW_HEIGHT = 300;

/* Main function */
function main() {
	let gw = GWindow(GWINDOW_WIDTH, GWINDOW_HEIGHT);
	for (let i = 0; i < NCIRCLES; i++) {
		let diameter = randomInteger(MIN_DIAMETER, MAX_DIAMETER);
		let x = randomInteger(0, GWINDOW_WIDTH-(diameter));
		let y = randomInteger(0, GWINDOW_HEIGHT-(diameter));
		let circle = GOval(x, y, diameter, diameter);
		circle.setFilled(true);
		circle.setColor(randomColor());
		gw.add(circle);
	}
}
