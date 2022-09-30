/*
 * File: SternBrocotSequences.js
 * -----------------------------
 * Exports a function that generates Stern-Brocot sequences for
 * arbitrary real numbers between 0 and 1.
 */

"use strict";

function TestSternBrocotSequences() {
   console.log("sbs(0.5) -> " + sbs(0.5));
   console.log("sbs(0.125) -> " + sbs(0.125));
   console.log("sbs(0.65) -> " + sbs(0.65));
   console.log("sbs(Math.E - 2) -> " + sbs(Math.E - 2));
   console.log("sbs(Math.PI - 3) -> " + sbs(Math.PI - 3));
   console.log("sbs(Math.PI - 3, 100) -> " + sbs(Math.PI - 3, 100));
   console.log("");
   console.log("Now use the console to test the function for arbitrary positive numbers.");
   evaluateExpressions();
}

/*
 * Function: sbs
 * -------------
 * Accepts the provided number and an optional max length and returns
 * the Stern-Brocot sequence best representing it.  We assume the supplied
 * number is between 0 and 1, and that max, if supplied, is a reasonably small
 * (in the hundreds).
 */

const DEFAULT_MAX_LENGTH = 500;
function sbs(num, max) {
   if (max === undefined) max = DEFAULT_MAX_LENGTH; // second argument is missing? use 500 as a default
   // replace the following line with your implementation, writing helper functions as necessary
   return "";
}
