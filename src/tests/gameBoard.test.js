import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import GameBoard from "../modules/gameBoard.js";
import Ship from "../modules/ship.js";

jest.mock("../modules/ship.js");

let gameBoard;

beforeEach(() => {
    gameBoard = new GameBoard();
    Ship.mockClear();
});

describe("constructor", () => {
    test("Should have 10 rows", () => {
        expect(gameBoard.board.length).toBe(10);
    });

    test("Should have 10 columns", () => {
        const allRows = gameBoard.board.every((row) => row.length === 10);
        expect(allRows).toBe(true);
    });

    test("Should be initialized with correct elements", () => {
        const expected = { ship: null, hit: false };
        gameBoard.board.forEach((row) => {
            row.forEach((cell) => {
                expect(cell).toEqual(expected);
            });
        });
    });

    test("Should be initialized with 0 ships", () => {
        expect(gameBoard.numShips).toBe(0);
    });
});

describe("placeShip()", () => {
    test("Should create one ship", () => {
        gameBoard.placeShip(0, 0, 5, true);
        expect(Ship).toHaveBeenCalledTimes(1);
    });

    test("Should create ship with correct length", () => {
        gameBoard.placeShip(0, 0, 5, true);
        gameBoard.placeShip(6, 6, 1, true);
        expect(Ship).toHaveBeenNthCalledWith(1, 5);
        expect(Ship).toHaveBeenNthCalledWith(2, 1);
    });

    test("Should have the same ship occupying the cells of its length", () => {
        expect(gameBoard.placeShip(0, 0, 4, true)).toBe(true);
        expect(gameBoard.board[0][0].ship).not.toBeFalsy();
        expect(gameBoard.board[0][0].ship).toBe(gameBoard.board[0][1].ship);
        expect(gameBoard.board[0][1].ship).toBe(gameBoard.board[0][2].ship);
        expect(gameBoard.board[0][2].ship).toBe(gameBoard.board[0][3].ship);
        expect(gameBoard.board[0][4].ship).toBe(null);
        expect(gameBoard.placeShip(6, 6, 2, true)).toBe(true);
        expect(gameBoard.board[0][0].ship).not.toBeFalsy();
        expect(gameBoard.board[6][6].ship).toBe(gameBoard.board[6][7].ship);
    });

    test("Should be able to place ship vertically", () => {
        expect(gameBoard.placeShip(0, 0, 4, false)).toBe(true);
        expect(gameBoard.board[0][0].ship).not.toBeFalsy();
        expect(gameBoard.board[0][0].ship).toBe(gameBoard.board[1][0].ship);
        expect(gameBoard.board[1][0].ship).toBe(gameBoard.board[2][0].ship);
        expect(gameBoard.board[2][0].ship).toBe(gameBoard.board[3][0].ship);
        expect(gameBoard.board[4][0].ship).toBe(null);
    });

    test("Should not be able to place ship if no more room", () => {
        expect(gameBoard.placeShip(0, 8, 4, true)).toBe(false);
        expect(gameBoard.board[0][8].ship).toBe(null);
        expect(gameBoard.placeShip(9, 2, 2, false)).toBe(false);
        expect(gameBoard.board[9][2].ship).toBe(null);
    });

    test("Should not be able to place ship if other ship is in the way", () => {
        expect(gameBoard.placeShip(1, 1, 4, true)).toBe(true);
        expect(gameBoard.placeShip(1, 0, 4, true)).toBe(false);
        expect(gameBoard.board[1][0].ship).toBe(null);
        expect(gameBoard.placeShip(0, 1, 2, false)).toBe(false);
        expect(gameBoard.board[0][1].ship).toBe(null);
    });

    test("Should increase ship count by 1 when placed", () => {
        gameBoard.placeShip(1, 1, 4, false);
        expect(gameBoard.numShips).toBe(1);
        gameBoard.placeShip(0, 0, 4, true);
        expect(gameBoard.numShips).toBe(2);
    });
});

describe("receiveAttack()", () => {
    test("Should indicate attacked cell", () => {
        gameBoard.receiveAttack(0, 0);
        expect(gameBoard.board[0][0].hit).toBe(true);
        gameBoard.receiveAttack(5, 5);
        expect(gameBoard.board[5][5].hit).toBe(true);
        expect(gameBoard.board[2][2].hit).toBe(false);
    });

    test("Should call hit() on ship when hit", () => {
        gameBoard.placeShip(0, 0, 5, true);
        gameBoard.receiveAttack(0, 0);
        const mockShip = Ship.mock.instances[0];
        const mockHit = mockShip.hit;
        expect(mockHit).toHaveBeenCalledTimes(1);
        gameBoard.receiveAttack(0, 1);
        expect(mockHit).toHaveBeenCalledTimes(2);
    });

    test("Should not call hit() again on same cell", () => {
        gameBoard.placeShip(0, 0, 5, true);
        gameBoard.receiveAttack(0, 0);
        const mockShip = Ship.mock.instances[0];
        const mockHit = mockShip.hit;
        expect(mockHit).toHaveBeenCalledTimes(1);
        gameBoard.receiveAttack(0, 0);
        expect(mockHit).toHaveBeenCalledTimes(1);
    });

    test("Should call isSunk() on ship when hit", () => {
        gameBoard.placeShip(0, 0, 5, true);
        gameBoard.receiveAttack(0, 0);
        const mockShip = Ship.mock.instances[0];
        const mockIsSunk = mockShip.isSunk;
        expect(mockIsSunk).toHaveBeenCalledTimes(1);
        gameBoard.receiveAttack(0, 1);
        expect(mockIsSunk).toHaveBeenCalledTimes(2);
    });

    test("Should decrease ship number when ship sunk", () => {
        gameBoard.placeShip(0, 0, 1, true);
        gameBoard.placeShip(1, 0, 1, true);
        const mockIsSunk = Ship.mock.instances[0].isSunk;
        mockIsSunk.mockReturnValueOnce(true);
        gameBoard.receiveAttack(0, 0);
        expect(gameBoard.numShips).toBe(1);
    });

    test("Should not decrease ship number when ship not sunk", () => {
        gameBoard.placeShip(0, 0, 2, true);
        gameBoard.placeShip(1, 0, 1, true);
        const mockIsSunk = Ship.mock.instances[0].isSunk;
        mockIsSunk.mockReturnValueOnce(false);
        gameBoard.receiveAttack(0, 0);
        expect(gameBoard.numShips).toBe(2);
    });
});

describe("allShipSunk()", () => {
    test("Should only return true when all ships sunk", () => {
        gameBoard.placeShip(0, 0, 1, true);
        expect(gameBoard.allShipSunk()).toBe(false);
        const mockIsSunk = Ship.mock.instances[0].isSunk;
        mockIsSunk.mockReturnValueOnce(true);
        gameBoard.receiveAttack(0, 0);
        expect(gameBoard.allShipSunk()).toBe(true);
    });
});
