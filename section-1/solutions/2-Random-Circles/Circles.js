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
		let d = randomInteger(MIN_DIAMETER, MAX_DIAMETER);
		let circle = makeRandomColoredCircle(d);
		let x = randomInteger(0, gw.getWidth() - d);
		let y = randomInteger(0, gw.getHeight() - d);
		gw.add(circle, x, y);
	}

    handleInteractiveDrawing(gw);
}

/* Returns the distance between two given points. */
function getEuclidianDistance(x0, x1, y0, y1) {
    return Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
}

/* Installs mousedown and drag event handlers in order to
 * create a circle on mousedown, and increase the size on
 * drag. */
function handleInteractiveDrawing(gw) {
    let circle = null;
    let centerX = null;
    let centerY = null;
    
    let mouseDownHandler = function(e) {
        circle = makeRandomColoredCircle(0);
        centerX = e.getX();
        centerY = e.getY();
        gw.add(circle, centerX, centerY);
    };
    gw.addEventListener("mousedown", mouseDownHandler);

    let dragHandler = function(e) {
        let radius = getEuclidianDistance(centerX, e.getX(), centerY, e.getY());
        circle.setLocation(centerX - radius, centerY - radius);
        circle.setSize(radius * 2, radius * 2);
    };
    gw.addEventListener("drag", dragHandler);
}

/* Returns a GOval with a random color and the provided
 * diameter. */
function makeRandomColoredCircle(diameter) {
    let circle = new GOval(diameter, diameter);
    circle.setFilled(true);
    circle.setColor(randomColor());
    return circle;
}
