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

let sbsChar = "";
const DEFAULT_MAX_LENGTH = 500;
function sbs(num, max) {
   if (max === undefined) max = DEFAULT_MAX_LENGTH; // second argument is missing? use 500 as a default

   let nL = 0;
   let dL = 1;
   let nR = 1;
   let dR = 1;
   let med = (nL + nR) / (dL + dR); // This value is 1/2
   console.log(med);

   let count = 1;
   while (num !== med && count <= max) {
      if (num > med) {
         nL = (nL + nR);
         dL = (dL + dR);
         med = (nL + nR) / (dL + dR);
         addToSbsChar("R");
      }
      else {
         nR = (nL + nR);
         dR = (dL + dR);
         med = (nL + nR) / (dL + dR);
         addToSbsChar("L");
      }
      count ++;
   }

   if (consecChar !== 1) {
      sbsChar += consecChar;
   }
   let out = sbsChar;
   sbsChar = "";
   consecChar = 1;
   lastChar = "";

   return out;
}

/*
 * Function: addToSbsChar
 * -------------
 * Modularizes the sbs function by isolating the algorithm for appending
 * to the sbs output string. We assume the supplied input is a single
 * letter string "L" or "R", and the returned string will adjust
 * depending on the most recent entry to sbs.
 */

let lastChar = "";
let consecChar = 1;

function addToSbsChar(char) {

   if (sbsChar === "") {
      sbsChar += char;
      lastChar = char;
      return;
   }

   if (char === "L") {
      if (char === lastChar) {
         consecChar += 1;
      }
      else {
         if (consecChar != 1) {
            sbsChar += consecChar + " " + char;
            lastChar = char;
         }
         else {
            sbsChar += " " + char;
            lastChar = char;
         }
         consecChar = 1;
      }
      return;
   }

   if (char === "R") {
      if (char === lastChar) {
         consecChar += 1;
      }
      else {
         if (consecChar != 1) {
            sbsChar += consecChar + " " + char;
            lastChar = char;
         }
         else {
            sbsChar += " " + char;
            lastChar = char;
         }
         consecChar = 1;
      }
      return;
   }
}
