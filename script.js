
let board = document.querySelector(".board");
const blockHeight = 30;
const blockWidth = 30;
const rows = Math.floor(board.clientHeight / blockHeight);
const cols = Math.floor(board.clientWidth / blockWidth);

let intervalId = null;

let food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols)
};

const blocks = [];
const snake = [
    { x: 1, y: 3 },
    { x: 1, y: 4 },
    { x: 1, y: 5 }
];

let direction = "right";

// grid create
for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        let block = document.createElement("div");
        block.classList.add("block");
        board.appendChild(block);
        blocks[`${row}-${col}`] = block;
    }
}

function render() {
    for (let key in blocks) {
        blocks[key].classList.remove("fill", "food");
    }

    // snake draw
    snake.forEach(seg => {
        blocks[`${seg.x}-${seg.y}`].classList.add("fill");
    });

    // food draw
    blocks[`${food.x}-${food.y}`].classList.add("food");
}

intervalId = setInterval(() => {

    let head = snake[0];
    let newHead = {};

    if (direction === "left") newHead = { x: head.x, y: head.y - 1 };
    if (direction === "right") newHead = { x: head.x, y: head.y + 1 };
    if (direction === "up") newHead = { x: head.x - 1, y: head.y };
    if (direction === "down") newHead = { x: head.x + 1, y: head.y };

    snake.unshift(newHead);

    // border collision
    if (
        newHead.x < 0 || newHead.x >= rows ||
        newHead.y < 0 || newHead.y >= cols
    ) {
        alert("Game Over");
        clearInterval(intervalId);
        return;
    }

    // 🥚 check food eat
    if (newHead.x === food.x && newHead.y === food.y) {
        // new food (correct)
        food = {
            x: Math.floor(Math.random() * rows),
            y: Math.floor(Math.random() * cols)
        };
    } else {
        // tail remove
        snake.pop();
    }

    // draw
    render();

}, 300);

// control
addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && direction !== "down") direction = "up";
    else if (e.key === "ArrowDown" && direction !== "up") direction = "down";
    else if (e.key === "ArrowLeft" && direction !== "right") direction = "left";
    else if (e.key === "ArrowRight" && direction !== "left") direction = "right";
});
