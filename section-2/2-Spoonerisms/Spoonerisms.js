/*
 * File: Spoonerisms.js
 * ------------------------
 * This program allows you to test your spoonerisms function,
 * which creates funny-sounding consonant swaps.
 */
"use strict";

/* Main function */
function main() {
  evaluateExpressions();
}

function spoonerize(phrase) {
  let phraseSplit = phrase.split(" ");
  let firstWord = phrase[0];
  let lastWord = phrase[(phrase.length - 1)];

  let vowelPos1 = findFirstVowel(firstWord);
  let vowelPos2 = findFirstVowel(lastWord);

  let newFirst = lastWord.substring(0, vowelPos2) + lastWord.substring(vowelPos1);
  let newLast = firstWord.substring(0, vowelPos1) + lastWord.substring(vowelPos2);

  phraseSplit[0] = newFirst;
  phraseSplit[phraseSplit.length - 1] = newLast;

  let newPhrase = "";
  for (let i = 0; i < phraseSplit.length; i++) {
    newPhrase += phraseSplit[i];
  }
  return newPhrase;

  /*
   * Returns the index of the first vowel in the word, or -1 if none.
   */
  function findFirstVowel(word) {
     for (let i = 0; i < word.length; i++) {
        if (isEnglishVowel(word.charAt(i))) return i;
     }
     return -1;
  }

  /*
   * Returns true if the character ch is a vowel (A, E, I, O, or U, in
   * either upper or lower case).
   */
  function isEnglishVowel(ch) {
     return ch.length === 1 && "AEIOUaeiou".indexOf(ch) !== -1;
  }
}


