import Player from "./player.js";

const human = new Player(true);
const computer = new Player(false);

function createElementWithClass(element, className) {
    const node = document.createElement(element);
    node.className = className;
    return node;
}

function initGame() {
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
            if (cell.ship && player.isHuman) {
                cellDiv.classList.add("ship");
            }
            cellDiv.dataset.x = x;
            cellDiv.dataset.y = y;
            board.append(cellDiv);
        });
    });

    return board;
}

function renderBoards() {
    const boardContainer = createElementWithClass("div", "board-container");
    const humanBoard = createBoard(human);
    const computerBoard = createBoard(computer);
    boardContainer.append(humanBoard, computerBoard);

    const content = document.querySelector("#content");
    content.append(boardContainer);
}

export { initGame, renderBoards };
