let board = document.querySelector(".board");
const blockHeight = 30;
const blockWidth = 30;
const rows = Math.floor(board.clientHeight / blockHeight);
const cols = Math.floor(board.clientWidth / blockWidth);

const startBtn = document.querySelector(".btn-start");
const modal = document.querySelector(".modal");
const gameOverModal = document.querySelector(".game-over");
const restartBtn = document.querySelector(".btn-restart");
const startGame = document.querySelector(".start-game");

let highScore = document.querySelector("#high-score");
let timeElement = document.querySelector("#time");
let score = document.querySelector("#score")

let hScore = 0;
var time = 0-0;
let s = 0;
highScore.innerText = "0";

// High score check on load
if(localStorage.getItem("ghScore")) {
    hScore = parseInt(localStorage.getItem("ghScore"));
    highScore.innerText = hScore;
}

let intervalId = null;
let timeintervalId = null;
let direction = "right";

let snake;
let food;

const blocks = {};

function initGame() {
    snake = [
        { x: 1, y: 3 },
        { x: 1, y: 4 },
        { x: 1, y: 5 }
    ];

    direction = "right";

    food = {
        x: Math.floor(Math.random() * rows),
        y: Math.floor(Math.random() * cols)
    };

    render();
}

// create grid
for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const div = document.createElement("div");
        div.classList.add("block");
        board.appendChild(div);
        blocks[`${row}-${col}`] = div;
    }
}

function render() {
    for (let key in blocks) {
        blocks[key].classList.remove("fill", "food");
    }

    snake.forEach(seg => {
        blocks[`${seg.x}-${seg.y}`]?.classList.add("fill");
    });

    blocks[`${food.x}-${food.y}`]?.classList.add("food");
}

function startGameLoop() {
    clearInterval(intervalId);

    intervalId = setInterval(() => {
        let head = snake[0];
        let newHead = {};

        if (direction === "left") newHead = { x: head.x, y: head.y - 1 };
        if (direction === "right") newHead = { x: head.x, y: head.y + 1 };
        if (direction === "up") newHead = { x: head.x - 1, y: head.y };
        if (direction === "down") newHead = { x: head.x + 1, y: head.y };

        // collision with wall
        if (
            newHead.x < 0 || newHead.x >= rows ||
            newHead.y < 0 || newHead.y >= cols
        ) {
            clearInterval(intervalId);
            clearInterval(timeintervalId); // Time rokna zaroori hai
            gameOverModal.style.display = "flex";
            modal.style.display = "flex";
            startGame.style.display = "none";
            return;
        }
        
        // Body collision check (Snake khud ko na kaat le)
        // (Optional: Aap chahein to add kar sakte hain logic yahan)

        snake.unshift(newHead);

        // food collision
        if (newHead.x === food.x && newHead.y === food.y) {
            food = {
                x: Math.floor(Math.random() * rows),
                y: Math.floor(Math.random() * cols)
            };

            s += 1;
            score.innerText = s;
            if (s > hScore) {
                hScore = s;
                localStorage.setItem("ghScore", hScore.toString())
                highScore.innerText = localStorage.getItem("ghScore")
            }
        } else {
            snake.pop();
        }

        render();
    }, 200);
}

// --- Keyboard Controls ---
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && direction !== "down") direction = "up";
    if (e.key === "ArrowDown" && direction !== "up") direction = "down";
    if (e.key === "ArrowLeft" && direction !== "right") direction = "left";
    if (e.key === "ArrowRight" && direction !== "left") direction = "right";
});

// --- NEW MOBILE SWIPE CONTROLS ADDED HERE ---
let touchStartX = 0;
let touchStartY = 0;
const gameArea = document.body; // Puri screen par touch kaam karega

gameArea.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}, false);

gameArea.addEventListener('touchend', function(e) {
    let touchEndX = e.changedTouches[0].screenX;
    let touchEndY = e.changedTouches[0].screenY;
    handleSwipe(touchStartX, touchStartY, touchEndX, touchEndY);
}, false);

function handleSwipe(startX, startY, endX, endY) {
    let diffX = endX - startX;
    let diffY = endY - startY;

    // Chhote touch ko ignore karein (galti se touch)
    if (Math.abs(diffX) < 30 && Math.abs(diffY) < 30) return;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal Swipe
        if (diffX > 0 && direction !== "left") {
            direction = "right";
        } else if (diffX < 0 && direction !== "right") {
            direction = "left";
        }
    } else {
        // Vertical Swipe
        if (diffY > 0 && direction !== "up") {
            direction = "down";
        } else if (diffY < 0 && direction !== "down") {
            direction = "up";
        }
    }
}
// ----------------------------------------

// start button
startBtn.addEventListener("click", () => {
    modal.style.display = "none";
    initGame();
    startGameLoop();

    // Reset time correctly
    time = 0-0; 
    
    clearInterval(timeintervalId);
    timeintervalId = setInterval(() => {
        let [min, sec] = time.split("-").map(Number);

        if (sec >= 59) {
            min += 1;
            sec = 0;
        } else {
            sec += 1;
        }

        time = `${min}-${sec}`;
        timeElement.innerText = time;

    }, 1000);
});

// restart button
restartBtn.addEventListener("click", () => {
    gameOverModal.style.display = "none";
    modal.style.display = "none";
    
    // Time reset logic
    time = 0-0;
    timeElement.innerText = time;
    clearInterval(timeintervalId);
    
    // Restart logic
    score.innerText = "0";
    s = 0;
    
    // Time start again
    timeintervalId = setInterval(() => {
        let [min, sec] = time.split("-").map(Number);
        if (sec >= 59) {
            min += 1;
            sec = 0;
        } else {
            sec += 1;
        }
        time = `${min}-${sec}`;
        timeElement.innerText = time;
    }, 1000);

    initGame();
    startGameLoop();
});