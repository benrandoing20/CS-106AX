/**
 * File: LongestPalindrome.js
 * --------------------------
 * Defines the longestPalindrome function, which accepts two strings
 * and returns the longest palindrome formable from some nonempty substring
 * of the first concatenated to some nonempty substring of the second.
 */

"use strict";

const TEST_CASES = [
   {first: "jdfh", second: "fds"},
   {first: "abc", second: "def"},
   {first: "bac", second: "bac"}
];

/* Main program, which is a test harness. */
function TestLongestPalindrome() {
   for (let i = 0; i < TEST_CASES.length; i++) {
      let str1 = TEST_CASES[i].first, str2 = TEST_CASES[i].second;
      console.log("longestPalindrome(\"" + str1 + "\", \"" + str2 + "\") -> \"" +
                  longestPalindrome(str1, str2) + "\"");
   }
}

/*
 * Function: longestPalindrome
 * ---------------------------
 * Computes the longest palindrome that can be formed by
 * concatenating some nonempty substring of str1 to some
 * nonempty substring of str2.  The function avoids using
 * arrays, and that necessitates the use of a quadruple for loop.
 */
function longestPalindrome(str1, str2) {
   let longest = "";
   for (let lh1 = 0; lh1 < str1.length; lh1++) {
      for (let rh1 = lh1 + 1; rh1 <= str1.length; rh1++) {
         let substr1 = str1.substring(lh1, rh1);
         for (let lh2 = 0; lh2 < str2.length; lh2++) {
            for (let rh2 = lh2 + 1; rh2 <= str2.length; rh2++) {
               let substr2 = str2.substring(lh2, rh2);
               let candidate = substr1 + substr2;
               if (isPalindrome(candidate) && candidate.length > longest.length) {
                  longest = candidate
               }
            }
         }
      }
   }
   return longest;
}

/*
 * Function: isPalindrome
 * ----------------------
 * Returns true if and only if the supplied string of lowercase letters
 * is a palindrome.
 */
function isPalindrome(str) {
   for (let i = 0; i < str.length/2; i++) {
      if (str.charAt(i) != str.charAt(str.length - i - 1)) {
         return false;
      }
   }
   return true;
}
