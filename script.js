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
let time = document.querySelector("#time");
let score = document.querySelector("#score")

let hScore = 0;
let t = `00-00`;
let s = 0;
highScore.innerText = "0";

let intervalId = null;
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
            gameOverModal.style.display = "flex";
            modal.style.display = "flex";
            startGame.style.display = "none";
            return;
        }

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

// controls
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && direction !== "down") direction = "up";
    if (e.key === "ArrowDown" && direction !== "up") direction = "down";
    if (e.key === "ArrowLeft" && direction !== "right") direction = "left";
    if (e.key === "ArrowRight" && direction !== "left") direction = "right";
});

// start button
startBtn.addEventListener("click", () => {
    modal.style.display = "none";
    initGame();
    startGameLoop();
});

// restart button
restartBtn.addEventListener("click", () => {
    gameOverModal.style.display = "none";
    modal.style.display = "none";

    initGame();
    startGameLoop();
    score.innerText = "0";
    s = 0;
});
