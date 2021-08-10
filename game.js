'use strict'

let canvas;
let context;
let playerX = 10;
let playerY = 10;
let tileCount = 20;         // logical game area size
let tileSize = 20;          // size of each tile, pixels
let foodX = Math.floor(Math.random() * tileCount);
let foodY = Math.floor(Math.random() * tileCount);
let movementX = 1;             // x/y movement direction, one speed only
let movementY = 0;
let tailLength = 5;
let tail = [];

window.onload = function () {
    canvas = document.getElementById("game-canvas");
    context = canvas.getContext("2d");
    document.addEventListener("keydown", keyDown);
    setInterval(mainLoop, 1000 / 15);
}

function mainLoop() {
    // todo: add score
    // todo: add game over
    // todo: add title or smth
    // todo: add instructions if needed, maybe not...
    // todo: center game area
    // todo: add border around game area

    // *** game logic ***
    // move
    playerX += movementX;
    playerY += movementY;

    // handle game area wraparound
    if (playerX < 0) { playerX = tileCount - 1; }
    if (playerX > tileCount - 1) { playerX = 0; }
    if (playerY < 0) { playerY = tileCount - 1; }
    if (playerY > tileCount - 1) { playerY = 0; }

    // todo: handle game over, i.e. collision with self

    // handle food collision
    if (foodX === playerX && foodY === playerY) {
        tailLength++;

        // Todo: randomize into a free location, if possible, otherwise ignore, 
        //       i.e. ensure we do not enter an eternal loop here, or have a max retry count...then what?
        foodX = Math.floor(Math.random() * tileCount);
        foodY = Math.floor(Math.random() * tileCount);
    }

    // add current pos to tail, remove excess tail
    tail.push({ x: playerX, y: playerY });
    while (tail.length > tailLength) {
        tail.shift();
    }

    // *** render ***
    // background
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // player/snake
    context.fillStyle = "lime";
    for (let element of tail) {
        context.fillRect(element.x * tileSize, element.y * tileSize, tileSize - 2, tileSize - 2);

        // Todo: check collision with self -> reset game
    }

    // food
    context.fillStyle = "deeppink";
    context.fillRect(foodX * tileSize, foodY * tileSize, tileSize - 2, tileSize - 2);
}

function keyDown(e) {
    switch (e.keyCode) {
        // Todo: ensure player cannot move back 180 degrees, just ignore such ket presses
        case 37:    // left arrow
            movementX = -1; movementY = 0;
            break;

        case 38:    // up arrow
            movementX = 0; movementY = -1;
            break;

        case 39:    // right arrow
            movementX = 1; movementY = 0;
            break;

        case 40:    // down arrow
            movementX = 0; movementY = 1;
            break;
    }
}