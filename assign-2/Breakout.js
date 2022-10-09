/*
 * File: Breakout.js
 * -----------------
 * This program implements the Breakout game.
 */
"use strict";

/* Constants */
const GWINDOW_WIDTH = 360;           /* Width of the graphics window      */
const GWINDOW_HEIGHT = 600;          /* Height of the graphics window     */
const N_ROWS = 10;                   /* Number of brick rows              */
const N_COLS = 10;                   /* Number of brick columns           */
const BRICK_ASPECT_RATIO = 4 / 1;    /* Width to height ratio of a brick  */
const BRICK_TO_BALL_RATIO = 3 / 2;   /* Ratio of brick width to ball size */
const BRICK_TO_PADDLE_RATIO = 2 / 3; /* Ratio of brick to paddle width    */
const BRICK_SEP = 2;                 /* Separation between bricks         */
const TOP_FRACTION = 0.1;            /* Fraction of window above bricks   */
const BOTTOM_FRACTION = 0.05;        /* Fraction of window below paddle   */
const N_BALLS = 3;                   /* Number of balls in a game         */
const TIME_STEP = 10;                /* Time step in milliseconds         */
const INITIAL_Y_VELOCITY = 3.0;      /* Starting y velocity downward      */
const MIN_X_VELOCITY = 1.0;          /* Minimum random x velocity         */
const MAX_X_VELOCITY = 3.0;          /* Maximum random x velocity         */

/* Derived constants */
const BRICK_WIDTH = (GWINDOW_WIDTH - (N_COLS + 1) * BRICK_SEP) / N_COLS;
const BRICK_HEIGHT = BRICK_WIDTH / BRICK_ASPECT_RATIO;
const PADDLE_WIDTH = BRICK_WIDTH / BRICK_TO_PADDLE_RATIO;
const PADDLE_HEIGHT = BRICK_HEIGHT / BRICK_TO_PADDLE_RATIO;
const PADDLE_Y = (1 - BOTTOM_FRACTION) * GWINDOW_HEIGHT - PADDLE_HEIGHT;
const BALL_SIZE = BRICK_WIDTH / BRICK_TO_BALL_RATIO;

/* Main program */

function Breakout() {
    let gw = GWindow(GWINDOW_WIDTH, GWINDOW_HEIGHT);
    let numBricks = N_ROWS * N_COLS;
    let introMsg;
    let createBricks = function(e) {
        let x0 = BRICK_SEP;
        let y0 = GWINDOW_HEIGHT * TOP_FRACTION;
        const colors = ["Red", "Red", "Orange", "Orange", "Yellow", "Yellow", "Cyan", "Cyan", "Blue", "Blue"];
        for (let i = 0; i < N_ROWS; i++){
            for (let j = 0; j < N_COLS; j++) {
                let x = x0 + ((BRICK_WIDTH + BRICK_SEP) * j);
                let y = y0 + ((BRICK_HEIGHT + BRICK_SEP) * i);
                let brick = GRect(x, y, BRICK_WIDTH, BRICK_HEIGHT);
                brick.setFilled(true);
                brick.setFillColor(colors[i%10]);
                gw.add(brick);
            }
        }
        introMsg = GLabel("Welcome to Brick Breaker", (GWINDOW_WIDTH-130)/2, 30);
        gw.add(introMsg);
        gw.add(brick);
    };

    let paddle = null;
    let createPaddle = function() {
        let PADDLE_X = (GWINDOW_WIDTH-PADDLE_WIDTH)/2;
        paddle = GRect(PADDLE_X, PADDLE_Y, PADDLE_WIDTH, PADDLE_HEIGHT);
        paddle.setFilled(true);
        gw.add(paddle);
    };

    let movePaddle = function(e) {
        if (paddle !== null){
            let X_ADJUST = e.getX();
            if (X_ADJUST >= 0 && X_ADJUST <= (GWINDOW_WIDTH-PADDLE_WIDTH)) {
                paddle.setBounds(X_ADJUST, PADDLE_Y, PADDLE_WIDTH, PADDLE_HEIGHT);
            }
        }
    };

    let ball = null;
    let ballsUsed = 0;
    let ballMsg;
    let loseMsg;
    let createBall = function() {
        let X0 = (GWINDOW_WIDTH - BALL_SIZE) / 2;
        let Y0 = (GWINDOW_HEIGHT - BALL_SIZE) / 2;
        ball = GOval(X0, Y0, BALL_SIZE, BALL_SIZE);
        ball.setFilled(true);
        if (ballsUsed < 3){
            ballMsg = GLabel((3-ballsUsed) + " Balls Remaining", (GWINDOW_WIDTH-80)/2, 50);
            gw.add(ballMsg);
            gw.add(ball);
            ballsUsed += 1;
        } else {
            loseMsg = GLabel("You Lose :(", (GWINDOW_WIDTH-60)/2, 100);
            gw.clear();
            gw.add(loseMsg);
        }

    };

    let X_VELO = randomReal(MIN_X_VELOCITY, MAX_X_VELOCITY);
    if (randomChance()) X_VELO = -X_VELO;
    let Y_VELO = INITIAL_Y_VELOCITY;
    let timer = 0;
    let winMsg;
    let hits = 0;
    let score = 0;
    let scoreMsg = GLabel("Score: 0", (GWINDOW_WIDTH-60), 20);
    gw.add(scoreMsg);
    let moveBall = function(e) {
        if (timer === 0) {
            gw.remove(ballMsg);
            gw.remove(introMsg);
            let step = function() {
                if (ball !== null) {
                    if (ball.getX() < 0 || (ball.getX() + BALL_SIZE) > GWINDOW_WIDTH) {
                        X_VELO = -X_VELO;
                    }
                    if (ball.getY() < 0) {
                        Y_VELO = -Y_VELO;
                    }
                    if ((ball.getY()) > GWINDOW_HEIGHT){
                        clearInterval(timer);
                        gw.remove(ball);
                        createBall();
                        timer = 0;
                    }
                    ball.move(X_VELO, Y_VELO);

                    const collider = getCollidingObject();
                    if (collider === paddle) {
                        Y_VELO = -Y_VELO;
                        hits += 1;
                        if (hits % 10 === 0) {
                            Y_VELO *= 1.2;
                        }

                    }
                    else {
                        gw.remove(collider);
                        if (numBricks > 1) {
                            numBricks -= 1;
                            score += 1;
                            gw.remove(scoreMsg);
                            scoreMsg = GLabel("Score: " + score, (GWINDOW_WIDTH-60), 20);
                            gw.add(scoreMsg);
                        } else {
                            winMsg = GLabel("You Win!", (GWINDOW_WIDTH-60)/2, 100);
                            clearInterval(timer);
                            gw.remove(ball);
                            gw.clear();
                            gw.add(winMsg);
                        }
                        Y_VELO = -Y_VELO;
                    }
                }
            };
            timer = setInterval(step, TIME_STEP);
        }
    };

    let getCollidingObject = function() {
        for(let i = 0; i < 2; i++){
            for (let j = 0; j < 2; j++){
                let elem = gw.getElementAt(ball.getX() + (i*BALL_SIZE), ball.getY() + (j*BALL_SIZE));
                if (elem === null) {
                    continue;
                }
                else {
                    return elem;

                }
                return;
            }
        }
    }


    setTimeout(createBricks, 0);
    setTimeout(createPaddle, 0);
    setTimeout(createBall, 0);
    gw.addEventListener("mousemove", movePaddle);
    gw.addEventListener("click", moveBall);

}


