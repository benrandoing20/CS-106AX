/*
 * File: BouncingBalls.js
 * ------------------
 * This program simulates the motion of a ball bouncing under the influence
 * of gravitational force.
 */
"use strict";

/* Constants */
const GWINDOW_WIDTH = 800;
const GWINDOW_HEIGHT = 300;
const DIAMETER = 20;
const MIN_X_VEL = 3;
const MAX_X_VEL = 15;
const TIME_STEP = 20;
const GRAVITY = 3; // amount Y velocity is increased each cycle
const BOUNCE_REDUCE = 0.75; // amount Y velocity is reduced during bounce

/* Main Function */
function BouncingBalls() {
    // TODO: Implement physics!
    let gw = GWindow(GWINDOW_WIDTH, GWINDOW_HEIGHT);
    let timer = 0;


    let createBall = function(e) {
        let ball = GOval(0,0,DIAMETER, DIAMETER);
        ball.setFilled(true);
        ball.setColor(randomColor());
        gw.add(ball);

        let X_VELO = randomReal(MIN_X_VEL, MAX_X_VEL);
        let Y_VELO = 0;
        let step = function() {
            ball.move(X_VELO, Y_VELO);
            Y_VELO += GRAVITY;
            if ((ball.getY() + DIAMETER) > GWINDOW_HEIGHT && Y_VELO > 0) {
                Y_VELO *= -1*BOUNCE_REDUCE;
            }

        };
        timer = setInterval(step, TIME_STEP);
    };

    gw.addEventListener("click", createBall);
}
