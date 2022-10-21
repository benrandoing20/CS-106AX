/*
 * File: GraphicsContest.js
 * ------------------------
 * Replace this with a description of what your contest entry does.
 */

"use strict";

/* Constants */
const GWINDOW_WIDTH = 800;           /* Width of the graphics window      */
const GWINDOW_HEIGHT = 600;          /* Height of the graphics window     */
const TIME_STEP = 10;                /* Time step in milliseconds         */
const MAX_STAR = 1000;                /* The max # of stars in the image   */
const MIN_STAR = 500;                /* The min # of stars in the image   */
const MAX_STAR_RADIUS = 5;          /* The max radius of stars           */

function GraphicsContest() {
    // let audio = new Audio("Session 8_ The Path.mp3");
    // audio.play();
    let gw = GWindow(GWINDOW_WIDTH, GWINDOW_HEIGHT);
    let space = function() {
        let background = GRect(0,0, GWINDOW_WIDTH, GWINDOW_HEIGHT);
        background.setFilled(true);
        background.setColor("Black");
        gw.add(background);

        let numStars = randomReal(MIN_STAR, MAX_STAR);
        for (let i = 0; i < numStars; i++) {
            let r = randomReal(1, MAX_STAR_RADIUS);
            let x = randomReal(r, GWINDOW_WIDTH-r);
            let y = randomReal(r, GWINDOW_HEIGHT -r);
            let circ = GOval(x,y, r, r);
            circ.setFilled(true);
            circ.setColor("White");
            gw.add(circ);
        }

    };

    let runs = 0;
    let starwars = function(e) {
        if (runs < 1) {
            let fontSize = 120;
            let star = GLabel("STAR");
            star.setColor("Yellow");
            star.setFont(fontSize + "px 'Times New Roman'");
            let starX = (GWINDOW_WIDTH - star.getWidth()) / 2;
            let starY = (GWINDOW_HEIGHT - star.getHeight()) / 2;
            gw.add(star, starX, starY);

            let wars = GLabel("WARS");
            wars.setColor("Yellow");
            wars.setFont(fontSize + "px 'Times New Roman'");
            let warsX = (GWINDOW_WIDTH - wars.getWidth()) / 2;
            let warsY = ((GWINDOW_HEIGHT - wars.getHeight()) / 2) + star.getHeight();
            gw.add(wars, warsX, warsY);

            let swCrawl = function() {
                let step = function() {
                    if (fontSize > 5) {
                        fontSize -= 0.5;
                        star.setFont(fontSize + "px 'Times New Roman'");
                        wars.setFont(fontSize + "px 'Times New Roman'");
                        let starX = (GWINDOW_WIDTH - star.getWidth()) / 2;
                        let starY = (GWINDOW_HEIGHT - star.getHeight()) / 2;
                        gw.remove(star);
                        gw.add(star, starX, starY);

                        let warsX = (GWINDOW_WIDTH - wars.getWidth()) / 2;
                        let warsY = ((GWINDOW_HEIGHT - wars.getHeight()) / 2) + star.getHeight();
                        gw.remove(wars);
                        gw.add(wars, warsX, warsY);
                    }
                    else {
                        gw.remove(star);
                        gw.remove(wars);
                    }
                };
                setInterval(step, TIME_STEP);
            };
            setTimeout(swCrawl, 0);
        }
        runs += 1;
        setTimeout(callCrawl, 7000);
    };

    let callCrawl = function() {
        let textScroll = ["Episode IV", "", "A NEW HOPE", "", "It is a" +
        " period of" +
        " civil war.",
            "Rebel spaceships, striking", "from a hidden base, have won", "their first victory against",
        "the evil Galactic Empire.", "", "During the battle, Rebel", "spies" +
            " managed to steal secret", "plans to the Empire's", "ultimate" +
            " weapon, the DEATH", "STAR, an armored space", "station with" +
            " enough power to", "destroy an entire planet.", "", "Pursued by" +
            " the Empire's", "sinister agents, Princess", "Leia races home" +
            " aboard her", "starship, custodian of the", "stolen plans that" +
            " can save", "her people and restore", "freedom to the galaxy"];
        for (let i = 0; i < textScroll.length; i++) {
            wordCrawl(textScroll[i], i);
        }
    };

    let wordCrawl = function(string, num) {
        let words = GLabel(string, GWINDOW_WIDTH/2, GWINDOW_HEIGHT+30+(40*num));
        words.setColor("Yellow");
        let fontSize = 40 + num;
        words.setFont(fontSize + "px 'Times New Roman'");
        words.setTextAlign("center");
        gw.add(words);

        let wordStep = function() {
            words.move(0,-2);
            if (fontSize > 2) {
                fontSize -= 0.08;
                words.setFont(fontSize + "px 'Times New Roman'");
                words.setTextAlign("center");
            } else {
                gw.remove(words);
            }

        };
        setInterval(wordStep, TIME_STEP);
    };


    setTimeout(space, 0);
    gw.addEventListener("click", starwars);
}
