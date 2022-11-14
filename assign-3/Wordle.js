/*
 * File: Wordle.js
 * -----------------
 * This program implements the Wordle game.
 */
"use strict";

/* Constants */
// If you turn this to true, the game will use colors that are R/G colorblind friendly.
const COLORBLIND_MODE = false;

const GWINDOW_WIDTH = 400;  /** The width of the GWindow */

const NUM_LETTERS = 5;  /** The number of letters in each guess */
const NUM_GUESSES = 6;  /** The number of guesses the player has to win */

const GUESS_MARGIN = 8; /** The space around each guess square */
const SECTION_SEP = 32; /** The space between the grid, alert, and keyboard */

const BACKGROUND_DEFAULT_COLOR = "#121213";
const BACKGROUND_CORRECT_COLOR = COLORBLIND_MODE ? "#E37E43" : "#618C55";  /** Used in keyboard and guess squares */
const BACKGROUND_FOUND_COLOR = COLORBLIND_MODE ? "#94C1F6" : "#B1A04C";  /** Used in keyboard and guess squares */
const BACKGROUND_WRONG_COLOR = "#3A3A3C";  /** Used in keyboard and guess squares */
const KEYBOARD_DEFAULT_COLOR = "#818384";
const BORDER_COLOR = "#3A3A3C";  /** Color of the border around guess squares */
const TEXT_DEFAULT_COLOR = "#FFFFFF";
const TEXT_ALERT_COLOR = "#B05050";
const TEXT_WIN_COLOR = COLORBLIND_MODE ? "#94C1F6" : "#618C55";
const TEXT_LOSS_COLOR = "#B05050";

const GUESS_FONT = "700 36px HelveticaNeue";
const ALERT_FONT = "700 20px HelveticaNeue";

/* Computed Constants */

// The size of each guess square (computed to fill the entire GWINDOW_WIDTH)
const GUESS_SQUARE_SIZE =
  (GWINDOW_WIDTH - GUESS_MARGIN * 2 * NUM_LETTERS) / NUM_LETTERS;

// Height of the guess section in total
const GUESS_SECTION_HEIGHT =
  GUESS_SQUARE_SIZE * NUM_GUESSES + GUESS_MARGIN * NUM_GUESSES * 2;

// X and Y position where alerts should be centered
const ALERT_X = GWINDOW_WIDTH / 2;
const ALERT_Y = GUESS_SECTION_HEIGHT + SECTION_SEP;

// X and Y position to place the keyboard
const KEYBOARD_X = 0;
const KEYBOARD_Y = ALERT_Y + SECTION_SEP;

// GWINDOW_HEIGHT calculated to fit everything perfectly.
const GWINDOW_HEIGHT = KEYBOARD_Y + GKeyboard.getHeight(GWINDOW_WIDTH);

/* Keyboard 'keydown' Recognizing Event Listener Functions */

/**
 * Accepts a KeyboardEvent and returns
 * the letter that was pressed, or null
 * if a letter wasn't pressed.
 *
 * The letter returned will be lowercase
 */
function getKeystrokeLetter(e) {
  if (e.altKey || e.ctrlKey || e.metaKey) return null;
  const key = e.key.toLowerCase();

  if (!/^[a-z]$/.exec(key)) return null;

  return key;
}

/**
 * Accepts a KeyboardEvent and returns true
 * if that KeyboardEvent was the user pressing
 * enter (or return), and false otherwise.
 */
function isEnterKeystroke(e) {
  return (
    !e.altKey &&
    !e.ctrlKey &&
    !e.metaKey &&
    (e.code === "Enter" || e.code === "Return")
  );
}

/**
 * Accepts a KeyboardEvent and returns true
 * if that KeyboardEvent was the user pressing
 * backspace (or delete), and false otherwise.
 */
function isBackspaceKeystroke(e) {
  return (
    !e.altKey &&
    !e.ctrlKey &&
    !e.metaKey &&
    (e.code === "Backspace" || e.code === "Delete")
  );
}

/* English Word Identifier and Creator Functions */

/**
 * Accepts a string, and returns if it is a valid English word.
 */
function isEnglishWord(str) {
  str = str.toLowerCase();
  return _DICTIONARY.has(str);
}

/**
 * Returns a random common word from the English lexicon,
 * that is NUM_LETTERS long. All lowercase.
 * 
 * Throws an error if no such word exists.
 */
function getRandomWord() {
  const nLetterWords = [..._COMMON_WORDS].filter(
    (word) => word.length === NUM_LETTERS && isEnglishWord(word)
  );

  if (nLetterWords.length === 0) {
    throw new Error(
      `The list of common words does not have any words that are ${NUM_LETTERS} long!`
    );
  }

  return nLetterWords[randomInteger(0, nLetterWords.length)];
}

/** Main Function */
function Wordle() {
  const gw = GWindow(GWINDOW_WIDTH, GWINDOW_HEIGHT); // The main GWindow object
  let secretWord = getRandomWord(); // The secret wordle string
  let currentWord = 0; // The current word from 0 to 5 (inclusive)
  let guesses = ["", "", "", "", "", "", ""]; // The array of guesses as they are entered
  let enter = [0, 0, 0, 0, 0, 0]; // The array indicating if a row has an entered word
  let correctLetters = "";
  let alertKey = 0;
  let win = false;
  let lose = false;

  let keyboard = GKeyboard(KEYBOARD_X, KEYBOARD_Y, GWINDOW_WIDTH, TEXT_DEFAULT_COLOR, KEYBOARD_DEFAULT_COLOR);
  guessGrid(gw, guesses, keyboard, secretWord, enter, alertKey, currentWord);

  /**
   * alterGuesses
   * ------------
   * alterGuesses adds a letter to the wordle screen in a row that has not
   * been entered.
   *
   * @param letter a passed letter from the keyboard event listener
   */
  let alterGuesses = function (letter) {
    if (guesses[currentWord].length <= 4 && !win && !lose) {
      guesses[currentWord] += letter;
      guessGrid(gw, guesses, keyboard, secretWord, enter, alertKey, currentWord);
    }
  };

  /**
   * goBack
   * ------
   * goBack simply deletes the most recent letter on a line that has not
   * been entered yet. This is called when both the onscreen or physical
   * backspace are clicked.
   */
  let goBack = function () {
    if (!win && !lose) {
      guesses[currentWord] = guesses[currentWord].substring(0, (guesses[currentWord].length) - 1);
      guessGrid(gw, guesses, keyboard, secretWord, enter, alertKey, currentWord);
    }

  };

  /**
   * enterWords
   * -----------
   * enterWords is run when an enter key on the on screen or physical
   * keyboard is recognized. Only 5 letter, real words are allowed to be
   * entered. The screen color, keyboard color, and message could all
   * change. If a non-word word is created, the logic here will remove
   * the word when a new letter is clicked.
   */
  let enterWords = function () {
    if (guesses[currentWord].length === 5 && !lose) {
      if (isEnglishWord(guesses[currentWord]) && !win) {
        if (guesses[currentWord] === secretWord) {
          win = true;
          alertKey =1;
        } else if (currentWord === 5) {
          lose = true;
          alertKey = 3;
        }
        adjustKeyColor(secretWord, guesses, keyboard, correctLetters);
        enter[currentWord] = 1;
        guessGrid(gw, guesses, keyboard, secretWord, enter, alertKey, currentWord);
        currentWord += 1;
      } else {
        alertKey = 2; // This code is for when a non-word is entered
        guessGrid(gw, guesses, keyboard, secretWord, enter, alertKey, currentWord);
        guesses[currentWord] = "";
        alertKey = 0;
      }
    }
  };

  /**
   * callBack
   * --------
   * callBack determines which type of keyboard event occurred between a
   * letter, backspace, or enter.
   *
   * @param e the keyboard event variable with stored information
   */
  let callBack = function(e) {
    if (isBackspaceKeystroke(e)) goBack();
    else if (isEnterKeystroke(e)) enterWords();
    else {
      if (getKeystrokeLetter(e) === null) {
        return;
      }
      else {
        alterGuesses(getKeystrokeLetter(e));
      }
    }
  };

  /* The Event Listeners below allow for on screen clicking or keyboard
  * manipulation of the wordle game
  */
  keyboard.addEventListener("keyclick", alterGuesses);
  keyboard.addEventListener("backspace", goBack);
  keyboard.addEventListener("enter", enterWords);
  gw.addEventListener("keydown", callBack);
}


/**
 * guessGrid
 * ---------
 * guessGrid calls the makeGrid function to create the screen and the
 * createMessage function to prepare the appropriate message. This is
 * essentially the driver function.
 *
 * @param gw object: the main GWindow in which Wordle is created
 * @param guesses array: a list of guesses that is parsed to realize the screen
 * @param keyboard GObject: the keyboard GCompound that is created in
 * GKeyboard.js
 * @param secret string: the randomly generated secret word
 * @param enter array: an indication of the rows that have been locked in
 * with an enter command. Implemented to ensure player has enetered winning
 * word to indicate it is correct.
 * @param alertKey int: a variable that codes the message displayed
 * @param currentWord int: a counter indicating which word and row are
 * currently in question.
 */
let guessGrid = function(gw, guesses, keyboard, secret, enter, alertKey, currentWord){
  gw.clear();
  makeGrid(gw, guesses, secret, enter, alertKey);
  createMessage(gw, alertKey, guesses, currentWord, secret);
  gw.add(keyboard);
};

/**
 * adjustKeyColor
 * --------------
 * adjustKeyColor manipulates the coloring of the GKeyboard once a word is
 * entered. Correct letters are green, letters in the wrong place but in
 * the word are yellow. Incorrect letters are gray.
 *
 * @param secretWord string: the randomly generated secret word
 * @param guesses array: a list of guesses that is parsed to realize the screen
 * @param keyboard GObject: the keyboard GCompound that is created in
 * GKeyboard.js
 * @param corrects string: a compiled string of guessed letters that appear
 * in the secret word.
 */
let adjustKeyColor = function(secretWord, guesses, keyboard, corrects) {
  for (let i = 0; i < guesses.length; i++) {
    if (guesses[i].length === 5){
      for (let j = 0; j < guesses[i].length; j++) {
        if (guesses[i][j] === secretWord[j] || corrects.indexOf(guesses[i][j]) !== -1) {
          keyboard.setKeyColor(guesses[i][j], BACKGROUND_CORRECT_COLOR);
          corrects += guesses[i][j];
        } else if (secretWord.indexOf(guesses[i][j]) !== -1 && corrects.indexOf(guesses[i][j]) === -1) {
          keyboard.setKeyColor(guesses[i][j], BACKGROUND_FOUND_COLOR);
        } else {
          keyboard.setKeyColor(guesses[i][j], BACKGROUND_WRONG_COLOR);
        }
      }
    }
  }
};


/**
 * makeGuessSquare
 * ---------------
 * makeGuessSquare creates a GCompound with a letter that is centered in the
 * middle. Te coloring of the background is dictated by the logic analysis
 * performed in makeRow.
 *
 * @param gw object: the main GWindow in which Wordle is created
 * @param char char: the character of interest from the current string str
 * @param background int: indicator for the color of the created square
 * background.
 * @returns {guess} GCompound: the square GCompound-empty or with a letter-
 * and appropriately colored
 */
let makeGuessSquare = function(gw, char, background) {
    let guess = GCompound();
    let box = GRect(0,0,GUESS_SQUARE_SIZE, GUESS_SQUARE_SIZE);
    let color;
    switch (background) {
      case 0:
        color = BORDER_COLOR;
        break;
      case 1:
        box.setFilled(true);
        color = BACKGROUND_WRONG_COLOR; // Gray
        break;
      case 2:
        box.setFilled(true);
        color = BACKGROUND_FOUND_COLOR; // Yellow
        break;
      case 3:
        box.setFilled(true);
        color = BACKGROUND_CORRECT_COLOR; // Green
        break;
    }

    box.setColor(color);

    let letter = GLabel(char,GUESS_SQUARE_SIZE/2,GUESS_SQUARE_SIZE/2);
    letter.setFont(GUESS_FONT);
    letter.setColor(TEXT_DEFAULT_COLOR);
    letter.setBaseline("middle");
    letter.setTextAlign("center");
    guess.add(box);
    guess.add(letter);


    return guess;
  };

/**
 * makeRow
 * -------
 * makeRow creates a GCompound row in the proper style for Wordle. 5
 * squares from the makeGuessSquare are compiled and appropriate colored
 * into a completely 5 character row. In addition to arranging the
 * squares, the logic is found in makeRow to identify the appropriate color
 * for each square in a specific row.
 *
 * @param gw object: the main GWindow in which Wordle is created
 * @param str string: the current string in the guesses array
 * @param secret string: the randomly generated secret word
 * @param enter array: an indication of the rows that have been locked in
 * with an enter command. Implemented to ensure player has entered winning
 * word to indicate it is correct.
 * @param wordNum int: a counter indicating which word and row are
 * currently in question.
 * @returns {row} GCompound: a complete formatted row to pass the makeGrid
 * function for gross arrangement.
 */
let makeRow = function(gw, str, secret, enter, wordNum) {
  let row = GCompound();
  let shade = false;
  let background = 0;
  if (str.length === 5 && enter[wordNum] === 1) {
    shade = true;
  }

  /** The following maps specify letters in the secret word, correct
   *  guessed letters, and good letters that are in the wrong place. The
   *  core of the logic checks if the amount of correctly placed of a
   *  certain letter and already yellowed of the same letter is <= the
   *  total number of that letter in the secret word. This avoids excess
   *  yellowing of multiple guesses of the same letter. Like Mommy guess.
   */
  let letFreq = new Map();
  let greenTot = new Map();
  let yelPassed = new Map();
  for (let i = 0; i < NUM_LETTERS; i++) {
    if (letFreq.get(secret.charAt(i)) >=1) {
      let old = letFreq.get(secret.charAt(i));
      letFreq.set(secret.charAt(i), old + 1);
    } else {
      letFreq.set(secret.charAt(i), 1);
    }

    greenTot.set(str.charAt(i), 0);
    if (str.charAt(i) === secret.charAt(i)) {
      if (greenTot.get(str.charAt(i)) >= 1) {
        let oldG = greenTot.get(str.charAt(i));
        greenTot.set(str.charAt(i), oldG + 1);
      } else {
        greenTot.set(str.charAt(i), 1);
      }
    }
  }

  for (let i = 0; i < NUM_LETTERS; i++) {
    if (shade) {
      if (secret.indexOf(str.charAt(i)) !== -1 && str.charAt(i) !== secret.charAt(i)) {
        if (yelPassed.get(str.charAt(i)) >= 1) {
            let oldC = yelPassed.get(str.charAt(i));
            yelPassed.set(str.charAt(i), oldC + 1);
          } else {
            yelPassed.set(str.charAt(i), 1);
          }
      }

      if (str.charAt(i) === secret.charAt(i)) {
        background = 3;
      } else if (secret.indexOf(str.charAt(i)) !== -1 && (yelPassed.get(str.charAt(i)) + greenTot.get(str.charAt(i))) <= letFreq.get(str.charAt(i))) {
        background = 2;
      } else {
        background = 1;
      }
    }

    let guess = makeGuessSquare(gw, str.charAt(i), background);
    let startX = GUESS_MARGIN*(2*i+1) + GUESS_SQUARE_SIZE*(i);
    row.add(guess, startX, GUESS_MARGIN);
  }
  return row;
};

/**
 * makeGrid
 * --------
 * This function arranges the rows from makeRow into a 6 row long grid that
 * is appropriate arranged in the GWindow. The logic for identifying the
 * winning string is also present to indicate the appropriate message.
 *
 * @param gw object: the main GWindow in which Wordle is created
 * @param strings array: a list of guesses that is parsed to realize the screen
 * @param secret string: the randomly generated secret word
 * @param enter array: an indication of the rows that have been locked in
 * with an enter command. Implemented to ensure player has enetered winning
 * word to indicate it is correct.
 * @param alertKey int: a variable that codes the message displayed
 */
let makeGrid = function(gw, strings, secret, enter, alertKey) {
  let grid = GCompound();
  for (let i = 0; i < NUM_GUESSES; i++) {
    let row = makeRow(gw, strings[i].toUpperCase(), secret.toUpperCase(), enter, i);
    let startY = GUESS_MARGIN*(2*i) + GUESS_SQUARE_SIZE*(i);
    grid.add(row, 0, startY);

    if (strings[i] === secret && enter[i] === 1) {
      alertKey = 1;
    }
  }
  gw.add(grid, 0, 0);
  return
};

/**
 * createMessage
 * ------------
 * This function creates a message to instruct the user if they have won,
 * lost, entered a non-word. If none of these conditions hold tre, a hello
 * world string is created. The function adds the message directly to the
 * GWindow so nothing is returned.
 *
 * @param gw object: the main GWindow in which Wordle is created
 * @param alertKey int: a variable that codes the message displayed
 * @param strings array: a list of guesses that is parsed to realize the screen
 * @param currentWord int: a counter indicating which word and row are
 * currently in question.
 * @param secret string: the randomly generated secret word
 */
let createMessage = function(gw, alertKey, strings, currentWord, secret) {
  let message;
  if (alertKey === 1) {
    message = GLabel("You Won!", ALERT_X, ALERT_Y);
    message.setColor(TEXT_WIN_COLOR);
  } else if (alertKey === 2) {
    message = GLabel(strings[currentWord].toUpperCase() + " isn't a word!", ALERT_X, ALERT_Y);
    message.setColor(TEXT_ALERT_COLOR);
  }
    else if (alertKey === 3) {
    message = GLabel("You Lose! Secret Word Was: " +secret, ALERT_X, ALERT_Y);
    message.setColor(TEXT_ALERT_COLOR);
  } else {
    message = GLabel("Hello World!", ALERT_X, ALERT_Y);
    message.setColor(TEXT_DEFAULT_COLOR);
  }
  message.setFont(ALERT_FONT);
  message.setTextAlign("center");
  message.setBaseline(GUESS_SECTION_HEIGHT);
  gw.add(message);
};