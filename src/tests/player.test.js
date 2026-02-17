import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import Player from "../modules/player.js";
import GameBoard from "../modules/gameBoard.js";

jest.mock("../modules/gameBoard.js");

beforeEach(() => {
    GameBoard.mockClear();
});

describe("constructor", () => {
    test("Should create a game board", () => {
        new Player();
        expect(GameBoard).toHaveBeenCalledTimes(1);
    });

    test("Should indicate if player is human or not", () => {
        const player1 = new Player(true);
        expect(player1.isHuman).toBe(true);
        const player2 = new Player(false);
        expect(player2.isHuman).toBe(false);
    });
});
