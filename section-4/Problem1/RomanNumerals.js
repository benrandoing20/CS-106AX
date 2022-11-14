/**
 * File: RomanNumerals.js
 */

"use strict";

const CONVERSIONS = {
  I: 1,
  V: 5,
  X: 10,
  L: 50,
  C: 100,
  D: 500,
  M: 1000,
};

/**
 * Accepts a string of roman numerals and returns its decimal
 * value as a number.
 */
function romanToDecimal(romanNumeralString) {}




/****************************************
 *                Testing               *
 ****************************************/


/** Main Function */
function TestRomanNumerals() {
  for (const { input, output } of TESTS) {
    const studentOutput = romanToDecimal(input);
    if (studentOutput === output) {
      console.log(`✅ romanToDecimal("${input}") = ${output}`);
    } else {
      console.log(`❌ romanToDecimal("${input}") ≠ ${studentOutput} (should be ${output})`);
    }
  }
}

const TESTS = [
  { input: "I", output: 1 },
  { input: "II", output: 2 },
  { input: "XI", output: 11 },
  { input: "IX", output: 9 },
  { input: "MDCLXIVI", output: 1000 + 500 + 100 + 50 + 10 + 4 + 1 },
];