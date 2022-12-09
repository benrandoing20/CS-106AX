/**
 * File: match-the-flag.js
 * -----------------------
 * Defines the controller for the MatchTheFlag application.
 */
"use strict";

function BootstrapMatchTheFlag() {

   // the divider is accessed below as part of the DOM
   let flagDiv = document.getElementById("board");

   // The three variables below are a counter of how many items have been
   // clicked and two fileNames corresponding to the clicked tiles.
   let flagShowing = 0;
   let flagFile1 = "";
   let flagFile2 = "";

   /**
    * correctFlag
    * -----------
    * changes two flags to matched color
    *
    * correctFLag is a function that goes through the DOM to identify the
    * current src states of the two selected [non-cover] images. Since the
    * logic occurs before the function call, the two images are switched to
    * the MATCHED_IMAGE
    */
   let correctFlag = function() {
      let names = document.getElementsByTagName("img");
      for (let i = 0; i < names.length; i++) {
         if (names[i].getAttribute("src") !== COVER_IMAGE) {
            names[i].setAttribute("src", MATCHED_IMAGE);
         }
      }
      flagShowing = 0;
   };

   /**
    * incorrectFlag
    * -----------
    * changes two flags back to cover
    *
    * incorrectFLag is a function that goes through the DOM to identify the
    * images that are non-cover images and classifies them as cover. Since the
    * logic occurs before the function call, the two images are switched to
    * the COVER_IMAGE.
    */
   let incorrectFlag = function() {
      let names = document.getElementsByTagName("img");
      for (let i = 0; i < names.length; i++) {
         if (names[i].getAttribute("src") !== COVER_IMAGE && names[i].getAttribute("src") !== MATCHED_IMAGE) {
            names[i].setAttribute("src", COVER_IMAGE);
         }
      }
      flagShowing = 0;
   };

   /**
    * flipCard
    * --------
    * switches cards to the flag saved
    *
    * flipCard is called by an event listener on a specific card element.
    * If an image is currently the cover and there has not yet been two
    * images selected, the image card with be switched with the correct
    * flag saved in the img element as an attribute.
    *
    * @param e contains information regarding the click event listener.
    */
   let flipCard = function(e) {
      if (flagShowing < 2) {
         if (e.target.getAttribute("src") === COVER_IMAGE) {
            e.target.setAttribute("src", e.target.getAttribute("data-country-image"));
            if (flagShowing === 0) {
               flagFile1 = e.target.getAttribute("data-country-image");
            }
            else if (flagShowing === 1) {
               flagFile2 = e.target.getAttribute("data-country-image");
            }
            flagShowing += 1;
         }
         else {
            return;
         }

         if (flagShowing === 2) {
            if (flagFile1 === flagFile2) {
               setTimeout(correctFlag, DELAY);
            }
            else {
               setTimeout(incorrectFlag, DELAY);
            }
         }
      }
   };

   /**
    * createIMG
    * ---------
    * creates an img element to be added to the div
    *
    * createIMG takes in a flag name from the created array of country names
    * and creates an img element with the cover attribute as src and saved
    * flag as a separate attribute.
    *
    * @param flagName string: lowercase flag name from the shuffled array
    */
   let createIMG = function(flagName) {
      let img = document.createElement("img");
      img.setAttribute("src", COVER_IMAGE);
      img.setAttribute("data-country-image", "images/" + flagName + ".png");
      img.addEventListener("click", flipCard);
      flagDiv.appendChild(img);
   };

   /**
    * createArray
    * -----------
    * creates 16 entry array of 8 unique countries and shuffles array
    *
    * createArray reads the 8 country names iin the COUNTRIES constant and
    * creates a randomly shuffled array with duplicates of each country.
    * This backend structure powes the creation of the game grid.
    */
   let createArray = function() {
      let flagArray = [];
      for (let i = 0; i < NUM_COUNTRIES; i++) {
         let flag = COUNTRIES[i].toLowerCase();
         flagArray.push(flag);
         flagArray.push(flag);
      }
      shuffle(flagArray);

      for (let i = 0; i < flagArray.length; i++) {
         createIMG(flagArray[i]);
      }
   };

   // Calls create array to establish game instance
   let flagArray = createArray();

   /*
    * Function: shuffle
    * -----------------
    * Generically shuffles the supplied array so
    * that any single permutation of the elements
    * is equally likely.
    */
   function shuffle(array) {
      for (let lh = 0; lh < array.length; lh++) {
         let rh = lh + Math.floor(Math.random() * (array.length - lh));
         let temp = array[rh];
         array[rh] = array[lh];
         array[lh] = temp;
      }    
   }
}

/* Execute the above function when the DOM tree is fully loaded. */
document.addEventListener("DOMContentLoaded", BootstrapMatchTheFlag);
