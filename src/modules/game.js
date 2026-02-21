import Player from "./player.js";

let human;
let computer;

const dialog = document.querySelector("dialog");
const dialogClose = document.querySelector("dialog button");

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

function displayWinner(isHuman) {
    const header = document.querySelector("dialog h1");

    header.textContent = isHuman ? "You Win" : "You Lose";

    dialog.showModal();
}

function initGame() {
    human = new Player(true);
    computer = new Player(false);
    human.board.placeShip(0, 0, 5, true);
    human.board.placeShip(1, 0, 3, true);

    computer.board.placeShip(0, 0, 5, true);
    computer.board.placeShip(1, 0, 3, true);
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
    let boardContainer = document.querySelector(".board-container");
    boardContainer.textContent = "";

    const humanBoard = createBoard(human);
    const computerBoard = createBoard(computer);

    computerBoard.addEventListener("click", (e) => {
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
    });

    boardContainer.append(humanBoard, computerBoard);

    const content = document.querySelector("#content");
    content.append(boardContainer);
}

export { initGame, renderBoards };
