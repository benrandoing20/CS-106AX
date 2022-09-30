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
function drawQuilt(gw) {
   for (let row = 0; row < NUM_ROWS; row++) {
      for (let col = 0; col < NUM_COLUMNS; col++) {
         let patch = createPlaceholderPatch();
         gw.add(patch, col * PATCH_DIMENSION, row * PATCH_DIMENSION);
      }
   }
}

/**
 * Function: createPlaceholderPatch
 * --------------------------------
 * This function is only here to draw a simple rectangle of the correct
 * size to occupy the space where a more elaborate patch belongs.  You will
 * want to remove it after you've implemented everything.
 */
function createPlaceholderPatch() {
   return GRect(PATCH_DIMENSION, PATCH_DIMENSION);
}
