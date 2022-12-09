/**
 * File: meme.js
 * -------------
 * Provides the necessary Javascript needed to wire up the
 * Memm Generator.  This is an example of a client-side app
 * that uses textareas and its ability to response to oninput
 * events.
 */
"use strict";

/*
 * Function: BootstrapMemeGenerator
 * --------------------------------
 * Builds the closure used to manage all of the DOM elements that are
 * continually revisited every time the content of the one textarea
 * changes.  Each change prompts the generation of a collection of
 * text memes, each of which are embedded in dedicated locations.
 */
function BootstrapMemeGenerator() {

    /* 
     * Local variables that persist, because all are referenced 
     * by the inner functions, all of which are installed as
     * callbacks for mouse and input events.
     *
     * Relevant variable names = textarea, camelMemeDiv, clapMemeDiv, spaceMemeDiv
     * Relevant DOM ids: source, camel-case-meme, clap-meme, space-meme
     */
    // TODO: Get the textarea, camel-case-meme div, clap-meme div, and
    // space-meme div from the DOM

    let textarea = document.getElementById("source");
    let camelMemeDiv = document.getElementById("camel-case-meme");
    let clapMemeDiv = document.getElementById("clap-meme");
    let spaceMemeDiv = document.getElementById("space-meme");

    /**
     * Function: onTextareaInput
     * -------------------------
     * Triggers every time there's any time the text within the
     * source textarea changes.  This is an opportunity to build the
     * three different meme strings and embed them in the relevant <div>
     * tags.  Note that this function is installed as an event handler,
     * and it references the four variables defined above.
     *
     * The benefit of this new closure-oriented approach is that we
     * only need to call document.getElementById once for each of the
     * four DOM elements ever manipulated by the code.
     */
    function onTextareaInput(e) { // e is ignored
        // TODO: place your implementation here
        let text = textarea.value.trim();

        let camel = constructCamelCaseMeme(text);
        let clap = constructClapMeme(text);
        let space = constructSpaceMeme(text);

        embedUpdatedMeme(camelMemeDiv, camel);
        embedUpdatedMeme(clapMemeDiv, clap);
        embedUpdatedMeme(spaceMemeDiv, space);
    };

    /**
     * Function: embedUpdatedMeme
     * --------------------------
     * Accepts a reference to the div element which should be cleared and
     * updated to contain a new meme, the text of which is supplied via
     * content.
     */
    function embedUpdatedMeme(div, content) {
        // TODO: place your implementation here
        // clear the div
        while (div.childNodes.length > 0) {
            div.removeChild(div.lastChild);
        }
        let text = document.createTextNode(content);
        div.appendChild(text);
    };

    /**
     * Function: constructCamelCase
     * ----------------------------
     * Returns the incoming text as is, except that all alphabetic
     * characters have been updated to alternate between upper case
     * and lower case.
     */
    function constructCamelCaseMeme(text) {
        let meme = "";
        let shouldBeUpperCase = true;
        for (let i = 0; i < text.length; i++) {
            let ch = text.charAt(i).toLowerCase();
            if ("a" <= ch && ch <= "z") {
                if (shouldBeUpperCase) ch = ch.toUpperCase();
                shouldBeUpperCase = !shouldBeUpperCase;
            }
            meme += ch;
        }
        return meme;
    };

    /**
     * Function: constructClapMeme
     * ---------------------------
     * Returns the supplied text mostly as is, except that
     * all letters have been capitalized, and a handclap emoji
     * is appended to the end of each word.
     * 
     * Note: "👏" really is a character. :)
     */   
    function constructClapMeme(text) {
        let meme = text.toUpperCase();
        if (meme == ""){
                    return "";
        }
        let wordArray = meme.split(" ");
        let result = ""
        for (let i = 0; i < wordArray.length; i++){
            wordArray[i] = wordArray[i] + "👏"
            result += wordArray[i]
        }
        return result; // TODO: replace with you own implementation
    };

    /**
     * Function: constructSpaceMeme
     * ----------------------------
     * Constructs and returns a meme consisting of the incoming
     * string's alphabetic characters (everything else is discarded)
     * with single spaces spliced in between neighboring characters.
     */
    function constructSpaceMeme(text) {
        let meme = "";
        for (let i = 0; i < text.length; i++) {
            let ch = text.charAt(i);
            let chlower = ch.toLowerCase();
            if ("a" <= chlower && chlower <= "z") {
                meme += ch + " ";
            }
        }
        return meme;
    };

    /* 
     * Installs onTextareaInput to be invoked every time 
     * the textarea changes. 
     */
    textarea.addEventListener("input", onTextareaInput);
}

/* 
 * Bootstrap the JavaScript engine when the DOM has been
 * fully built.  Good times.
 */
document.addEventListener("DOMContentLoaded", BootstrapMemeGenerator);
