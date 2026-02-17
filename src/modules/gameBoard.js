import Ship from "./ship.js";

export default class {
    constructor() {
        this.board = Array.from({ length: 10 }, () =>
            Array.from({ length: 10 }, () => {
                return { ship: null, hit: false };
            }),
        );
        this.numShips = 0;
    }

    placeShip(x, y, length, isHorizontal) {
        const ship = new Ship(length);
        if (isHorizontal) {
            if (y + length > 10) {
                return false;
            }
            for (let i = 0; i < length; i++) {
                if (this.board[x][y + i].ship) {
                    return false;
                }
            }
            for (let i = 0; i < length; i++) {
                this.board[x][y + i].ship = ship;
            }
            this.numShips += 1;
            return true;
        } else {
            if (x + length > 10) {
                return false;
            }
            for (let i = 0; i < length; i++) {
                if (this.board[x + i][y].ship) {
                    return false;
                }
            }
            for (let i = 0; i < length; i++) {
                this.board[x + i][y].ship = ship;
            }
            this.numShips += 1;
            return true;
        }
    }

    receiveAttack(x, y) {
        if (!this.board[x][y].hit) {
            this.board[x][y].hit = true;
            if (this.board[x][y].ship) {
                const ship = this.board[x][y].ship;
                ship.hit();
                if (ship.isSunk()) {
                    this.numShips -= 1;
                }
            }
            return true;
        }
        return false;
    }

    allShipSunk() {
        return this.numShips === 0;
    }
}
