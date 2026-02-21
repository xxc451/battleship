import Player from "./player.js";

let human;
let computer;
let gameStart;
const shipLengths = [5, 4, 3, 3, 2];

const dialog = document.querySelector("dialog");
const dialogClose = document.querySelector("dialog button");
const gameButtonDiv = document.querySelector(".game-buttons");

dialog.addEventListener("close", () => {
    initGame();
    renderBoards();
});

dialogClose.addEventListener("click", () => {
    dialog.close();
});

function createElementWithClass(element, className) {
    const node = document.createElement(element);
    node.className = className;
    return node;
}

function randomizeShipPlacement(player) {
    for (const length of shipLengths) {
        let placed = false;
        while (!placed) {
            const randX = Math.floor(Math.random() * 10);
            const randY = Math.floor(Math.random() * 10);
            const horizontal = Math.random() < 0.5;

            let nextToShip = false;
            const boardLength = player.board.board.length;

            for (let k = -1; k <= length; k++) {
                for (let l = -1; l <= 1; l++) {
                    const x = horizontal ? randX + l : randX + k;
                    const y = horizontal ? randY + k : randY + l;

                    if (
                        x >= 0 &&
                        x < boardLength &&
                        y >= 0 &&
                        y < boardLength
                    ) {
                        if (player.board.board[x][y].ship) {
                            nextToShip = true;
                            break;
                        }
                    }
                }
                if (nextToShip) {
                    break;
                }
            }
            if (!nextToShip) {
                placed = player.board.placeShip(
                    randX,
                    randY,
                    length,
                    horizontal,
                );
            }
        }
    }
}

function createRandomizeButton() {
    const button = createElementWithClass("button", "random secondary");
    button.textContent = "Randomize Board";

    button.addEventListener("click", () => {
        if (!gameStart) {
            human = new Player(true);
            randomizeShipPlacement(human);
            renderBoards();
        }
    });

    return button;
}

function createResetButton() {
    const button = createElementWithClass("button", "reset secondary");
    button.textContent = "Reset Game";

    button.addEventListener("click", () => {
        initGame();
        renderBoards();
    });

    return button;
}

function createStartButton() {
    const button = createElementWithClass("button", "start primary");
    button.textContent = "Start Game";

    button.addEventListener("click", () => {
        gameStart = true;
        gameButtonDiv.textContent = "";
        gameButtonDiv.append(createResetButton());
    });

    return button;
}

function displayWinner(isHuman) {
    const header = document.querySelector("dialog h1");

    header.textContent = isHuman ? "You Win" : "You Lose";

    dialog.showModal();
}

function initGame() {
    human = new Player(true);
    computer = new Player(false);
    gameStart = false;
    randomizeShipPlacement(human);
    randomizeShipPlacement(computer);
    gameButtonDiv.textContent = "";
    gameButtonDiv.append(createRandomizeButton(), createStartButton());
}

function createBoard(player) {
    const board = createElementWithClass("div", "board");
    player.board.board.forEach((row, x) => {
        row.forEach((cell, y) => {
            const cellDiv = createElementWithClass("div", "cell");
            if (cell.ship) {
                if (cell.hit) {
                    cellDiv.classList.add("hit-ship");
                } else if (player.isHuman) {
                    cellDiv.classList.add("ship");
                }
            } else if (cell.hit) {
                cellDiv.classList.add("hit");
            }
            cellDiv.dataset.x = x;
            cellDiv.dataset.y = y;
            board.append(cellDiv);
        });
    });

    return board;
}

function renderBoards() {
    const left = document.querySelector(".left");
    left.textContent = "";
    const leftTitle = document.createElement("h2");
    leftTitle.textContent = "Your Board";

    const right = document.querySelector(".right");
    right.textContent = "";
    const rightTitle = document.createElement("h2");
    rightTitle.textContent = "Computer's Board";

    const humanBoard = createBoard(human);
    const computerBoard = createBoard(computer);

    computerBoard.addEventListener("click", (e) => {
        if (gameStart) {
            if (e.target.classList.contains("cell")) {
                const x = parseInt(e.target.dataset.x);
                const y = parseInt(e.target.dataset.y);
                if (computer.board.receiveAttack(x, y)) {
                    if (computer.board.allShipSunk()) {
                        renderBoards();
                        displayWinner(true);
                        return;
                    }
                    // computer turn
                    let computerHit = false;
                    while (!computerHit) {
                        const computerX = Math.floor(Math.random() * 10);
                        const computerY = Math.floor(Math.random() * 10);
                        computerHit = human.board.receiveAttack(
                            computerX,
                            computerY,
                        );
                    }

                    renderBoards();
                    if (human.board.allShipSunk()) {
                        displayWinner(false);
                    }
                }
            }
        }
    });

    left.append(leftTitle, humanBoard);
    right.append(rightTitle, computerBoard);
}

export { initGame, renderBoards };
