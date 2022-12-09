/*
 * File: deuxlingo.js
 * ------------------
 * Implements the core of Deuxlingo.
 */
"use strict";

/**
 * Function: Deuxlingo
 * -------------------
 * Defines the controller need to interact with the Deuxlingo
 * web application.
 */
const LANGUAGE_CODE = "fr"; // change to whatever you want
const ENDPOINT_URL = "https://web.stanford.edu/class/cs106ax/cgi-bin/translate.py";
function Deuxlingo() {
   let textArea = document.getElementById("textarea");
   let sourceDiv = document.getElementById("source-div");
   let targetDiv = document.getElementById("target-div");
   let editButton = document.getElementById("edit-button");
   let translateButton = document.getElementById("translate-button");
   
   // fill the rest in with your own solution

   // get input
   /**
    * Function: getInformation
    * ------------------------
    * Reads input, makes request, and handles response.
    */
   function getInformation(e) {
      // Read input.
      let text = textArea.value.trim();
      if (text === "") return;

      // Formulate the request.
      let req = AsyncRequest(ENDPOINT_URL);
      req.addParams({json: true, to: LANGUAGE_CODE, source: text});

      // Handle success and error responses.
      req.setSuccessHandler(parseResponse);
      // req.setErrorHandler(errorHandler);

      req.send();
   }

   /**
    * Function: successHandler
    * ------------------------
    * Extracts text from JSON response and embeds it.
    */
   function parseResponse(response) {
      let payload = response.getPayload();
      let info = JSON.parse(payload);
      console.log(info);
      let sourceText = info.source;
      let targetText = info.target;

      embedText(sourceDiv, sourceText);
      embedText(targetDiv, targetText);

      // textArea.classlist.add("invisible");
      // translateButton.classlist.add("invisible");

      [textArea, translateButton].forEach(function(elem){
         elem.classList.add("invisible");
      });

      [sourceDiv, targetDiv, editButton].forEach(function(elem){
         elem.classList.remove("invisible");
      });


   }

   /**
    * Function: errorHandler
    * ------------------------
    * Embeds error message.
    */
   function errorHandler(response) {
      embedText(targetDiv, "An error occured. Please input a whole number.");
   }

   /**
    * Function: embedText
    * ------------------------
    * Embed text into the specified div.
    */
   function embedText(div, text) {
      // div.innerHTML = ""; // empties tthe div before adding new translation
      while(div.lastChild !== null) {
         div.removeChild(div.lastChild);
      }
      let tn = document.createTextNode(text);
      div.appendChild(tn);
   }

   function showEditor() {
      textArea.value = "";

      [textArea, translateButton].forEach(function(elem){
         elem.classList.remove("invisible");
      });

      [sourceDiv, targetDiv, editButton].forEach(function(elem){
         elem.classList.add("invisible");
      });
   }

   editButton.addEventListener("click", showEditor);
   translateButton.addEventListener("click", getInformation);
}

document.addEventListener("DOMContentLoaded", Deuxlingo);