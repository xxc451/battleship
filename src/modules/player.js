import GameBoard from "./gameBoard.js";

export default class {
    constructor(isHuman) {
        this.board = new GameBoard();
        this.isHuman = isHuman;
    }
}
