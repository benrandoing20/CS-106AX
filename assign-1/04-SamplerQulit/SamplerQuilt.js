/*
 * File: SamplerQuilt.js
 * ---------------------
 * This program uses the object-oriented graphics model to draw
 * a Sampler Quilt to the screen. :)
 */

"use strict";

/* Constants */
const PATCH_DIMENSION = 75;
const NUM_ROWS = 7;
const NUM_COLUMNS = 7;
const BORDER_COLOR = "Black";
const BULLSEYE_BOLD_COLOR = "Red";
const BULLSEYE_MILD_COLOR = "White";
const LOG_COLOR = "Tan";
const LOVE_FRAME_COLOR = "Pink";
const LOVE_MAT_COLOR = "White";

/* Derived Constants */
const WINDOW_WIDTH = NUM_COLUMNS * PATCH_DIMENSION;
const WINDOW_HEIGHT = NUM_ROWS * PATCH_DIMENSION;

/*
 * Function: DrawSamplerQuilt
 * --------------------------
 * Draws a sampler quilt as outlined in the assignment handout.
 */

function DrawSamplerQuilt() {
   let gw = GWindow(WINDOW_WIDTH, WINDOW_HEIGHT);
   drawQuilt(gw);
}

/*
 * Function: drawQuilt
 * --------------------------
 * Inserts all of the sampler quilt into the supplied graphics window.
 */
let count = 1;
function drawQuilt(gw) {
   let patch;
   for (let row = 0; row < NUM_ROWS; row++) {
      for (let col = 0; col < NUM_COLUMNS; col++) {
         switch (count) {
            case 1:
               patch = concentricCircles();
               count += 1;
               break;
            case 2:
               patch = logCabin();
               count += 1;
               break;
            case 3:
               patch = randomFlowerCirc();
               count += 1;
               break;
            case 4:
               patch = sectLeader();
               count = 1;
               break;
         }
         let x = col * PATCH_DIMENSION;
         let y = row * PATCH_DIMENSION;
         gw.add(patch, x, y);
      }
   }
}

/*
 * Function: concentricCircles
 * --------------------------------
 * This function creates a rectangle for the concentric circles
 * component of the quilt with alternating red and white circles with a
 * black border.
 */
function concentricCircles() {
   let concBox = GCompound();
   let outDiameter = 70;
   concBox.add(GRect(PATCH_DIMENSION, PATCH_DIMENSION));
   for (let i = 0; i < 7; i++) {
      let diameter = outDiameter - (i*10);
      let corner = (PATCH_DIMENSION - diameter) / 2;
      let circle = GOval(corner, corner,  diameter, diameter);
      circle.setFilled(true);
      if (i % 2 === 0) {
         circle.setFillColor(BULLSEYE_BOLD_COLOR);
      }
      else {
         circle.setFillColor(BULLSEYE_MILD_COLOR);
      }
      concBox.add(circle);
   }
   return concBox;
}

/*
 * Function: randomFlowerCirc
 * --------------------------------
 * This function creates a rectangle for the 5 randomly colored circle that
 * make a flower pastch pattern.
 */
function randomFlowerCirc() {
   let flowerBox = GCompound();
   let diameter = PATCH_DIMENSION * 2 / 5;
   let startCorner = ((PATCH_DIMENSION / 2) - diameter) / 2
   let centerCorner = (PATCH_DIMENSION - diameter) / 2
   flowerBox.add(GRect(PATCH_DIMENSION, PATCH_DIMENSION));
   for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
         let x = startCorner + (PATCH_DIMENSION /2 * i);
         let y = startCorner + (PATCH_DIMENSION /2 * j);
         let circle = GOval(x, y, diameter, diameter);
         circle.setFilled(true);
         circle.setFillColor(randomColor())
         flowerBox.add(circle)
      }
   }
   let centerCircle = GOval(centerCorner, centerCorner, diameter, diameter);
   centerCircle.setFilled(true);
   centerCircle.setFillColor(randomColor())
   flowerBox.add(centerCircle)

   return flowerBox
}

/*
 * Function: logCabin
 * --------------------------------
 * This function creates a rectangle for the 5 randomly colored circle that
 * make a flower pastch pattern.
 */
function logCabin() {
   let cabin = GCompound();
   let segmentNumber = 9; // Must be 3 or greater
   let shortLen = PATCH_DIMENSION / segmentNumber;
   cabin.add(GRect(PATCH_DIMENSION, PATCH_DIMENSION));

   for (let i = 0; i < ((segmentNumber / 2) - 1); i++) {
      let startCorner = i * shortLen;
      let longLen = (segmentNumber - 1 - (2*i)) * (shortLen);
      let secondCornerX = PATCH_DIMENSION - (shortLen * (i+1));
      let secondCornerY = shortLen * i;
      let thirdCornerX = shortLen * (i+1);
      let thirdCornerY = PATCH_DIMENSION - (shortLen * (i+1));
      let fourthCornerX = shortLen * (i);
      let fourthCornerY = shortLen * (i+1);

      let rect = GRect(startCorner, startCorner, longLen, shortLen);
      rect.setFilled(true);
      rect.setFillColor(LOG_COLOR);
      cabin.add(rect);
      let rect2 = GRect(secondCornerX, secondCornerY, shortLen, longLen);
      rect2.setFilled(true);
      rect2.setFillColor(LOG_COLOR);
      cabin.add(rect2);
      let rect3 = GRect(thirdCornerX, thirdCornerY, longLen, shortLen);
      rect3.setFilled(true);
      rect3.setFillColor(LOG_COLOR);
      cabin.add(rect3);
      let rect4 = GRect(fourthCornerX, fourthCornerY, shortLen, longLen);
      rect4.setFilled(true);
      rect4.setFillColor(LOG_COLOR);
      cabin.add(rect4);
   }
   return cabin
}


/*
 * Function: sectLeader()
 * --------------------------------
 * This function creates a rectangle for the randomly selected image of a
 *  section leader with two frames of border with the same spacing as the
 *  log cabin.
 */
function sectLeader() {
   let leader = GCompound();
   let segmentNumber = 9; // Must be 3 or greater
   let shortLen = PATCH_DIMENSION / segmentNumber;
   leader.add(GRect(PATCH_DIMENSION, PATCH_DIMENSION));
   leader.add(GImage("http://web.stanford.edu/class/cs106ax/img/jonathan.png"));

   for (let i = 0; i < 2; i++) {
      let startCorner = i * shortLen;
      let longLen = (segmentNumber - 1 - (2*i)) * (shortLen);
      let secondCornerX = PATCH_DIMENSION - (shortLen * (i+1));
      let secondCornerY = shortLen * i;
      let thirdCornerX = shortLen * (i+1);
      let thirdCornerY = PATCH_DIMENSION - (shortLen * (i+1));
      let fourthCornerX = shortLen * (i);
      let fourthCornerY = shortLen * (i+1);

      let color = ""
      if (i % 2 === 0) {
         color = LOVE_FRAME_COLOR;
      }
      else {
         color = LOVE_MAT_COLOR;
      }

      let rect = GRect(startCorner, startCorner, longLen, shortLen);
      rect.setFilled(true);
      rect.setFillColor(color);
      leader.add(rect);
      let rect2 = GRect(secondCornerX, secondCornerY, shortLen, longLen);
      rect2.setFilled(true);
      rect2.setFillColor(color);
      leader.add(rect2);
      let rect3 = GRect(thirdCornerX, thirdCornerY, longLen, shortLen);
      rect3.setFilled(true);
      rect3.setFillColor(color);
      leader.add(rect3);
      let rect4 = GRect(fourthCornerX, fourthCornerY, shortLen, longLen);
      rect4.setFilled(true);
      rect4.setFillColor(color);
      leader.add(rect4);
   }

   return leader
}