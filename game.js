'use strict'

const tileCount = 20;         // logical game area size
const tileSize = 20;          // size of each tile, pixels

let canvas;
let context;

let playerX;
let playerY;
let hasChangedDirection;
let score;
let gameOver;
let foodX;
let foodY;
let movementX;
let movementY;
let tailLength;
let tail = [];

initialize();

window.onload = function () {
    canvas = document.getElementById("game-canvas");
    context = canvas.getContext("2d");
    document.addEventListener("keydown", keyDown);
    setInterval(mainLoop, 1000 / 15);
}

function mainLoop() {
    processGameLogic();
    render();
}

function processGameLogic() {
    if (gameOver) {
        return;
    }

    // move
    hasChangedDirection = false;
    playerX += movementX;
    playerY += movementY;

    // handle game area wraparound
    if (playerX < 0) { playerX = tileCount - 1; }
    if (playerX > tileCount - 1) { playerX = 0; }
    if (playerY < 0) { playerY = tileCount - 1; }
    if (playerY > tileCount - 1) { playerY = 0; }

    // handle self collision, i.e. game over
    // (this could be done in rendering to avoid 2 passes or we could use an index, lookup etc.)
    for (let t of tail) {
        if (t.x === playerX && t.y === playerY) {
            gameOver = true;
            break;
        }
    }

    // handle food collision
    if (foodX === playerX && foodY === playerY) {
        tailLength++;
        score++;

        foodX = Math.floor(Math.random() * tileCount);
        foodY = Math.floor(Math.random() * tileCount);
    }

    // add current pos to head of tail, remove excess tail
    tail.push({ x: playerX, y: playerY });
    while (tail.length > tailLength) {
        tail.shift();
    }
}

function render() {
    // background
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // player/snake
    for (let i = 0; i < tail.length; i++) {
        context.fillStyle = i === tail.length - 1 ? "aqua" : "lime";

        let t = tail[i];
        context.fillRect(t.x * tileSize, t.y * tileSize, tileSize - 2, tileSize - 2);
    }

    // food
    context.fillStyle = "deeppink";
    context.fillRect(foodX * tileSize, foodY * tileSize, tileSize - 2, tileSize - 2);

    // scoring etc.
    showScore(score);
    showGameOver(gameOver);
}

function showScore(score) {
    let scoreBoard = document.getElementById("score");
    scoreBoard.innerHTML = "Score: " + score;
}

function showGameOver(gameOver) {
    if (!gameOver) {
        return;
    }

    context.font = "7rem consolas";
    context.fillText("GAME", 70, 180);
    context.fillText("OVER", 70, 300);
}

function keyDown(e) {
    // space
    if (e.keyCode === 32 && gameOver) { 
        initialize();
        return;
    }
            
    // avoid multiple movement changes within one game "tick"
    if (hasChangedDirection) {
        return;
    }

    switch (e.keyCode) {
        case 37:    // left arrow
            if (movementX !== 1) { movementX = -1; movementY = 0; hasChangedDirection = true}
            break;

        case 38:    // up arrow
            if (movementY !== 1) { movementX = 0; movementY = -1; hasChangedDirection = true}
            break;

        case 39:    // right arrow
            if (movementX !== -1) { movementX = 1; movementY = 0; hasChangedDirection = true}
            break;

        case 40:    // down arrow
            if (movementY !== -1) { movementX = 0; movementY = 1; hasChangedDirection = true}
            break;
    }
}

function initialize() {
    playerX = 5;
    playerY = 10;
    hasChangedDirection = false;
    score = 0;
    foodX = Math.floor(Math.random() * tileCount);
    foodY = Math.floor(Math.random() * tileCount);
    movementX = 1;
    movementY = 0;
    tailLength = 5;
    tail = [];   
    gameOver = false;
}