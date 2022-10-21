/*
 * File: StringSplit.js
 * ------------------------
 * This program allows you to test your split function,
 * which separates a string on multiple separators
 */
"use strict";

/* Main function */
function main() {
  evaluateExpressions();

}

function split(str, separators) {
  let result = [];
  let match = false;
  let tempString = "";

  for (let i = 0; i < str.length; i++) {
    if (separators.indexOf(str.charAt(i)) !== -1) {
      result.push(tempString);
      tempString = "";
      }
    else {
      tempString += str.charAt(i);
    }
  }
  result.push(tempString);
  console.log(result);
}
