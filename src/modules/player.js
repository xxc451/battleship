import GameBoard from "./gameBoard";

export default class {
    constructor(isHuman) {
        this.board = new GameBoard();
        this.isHuman = isHuman;
    }
}
