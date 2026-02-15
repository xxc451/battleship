import { describe, expect, test } from "@jest/globals";
import Ship from "../modules/ship.js";

describe("constructor", () => {
    test("Initialize with 3 health", () => {
        const ship = new Ship(3);
        expect(ship.length).toBe(3);
    });

    test("Initialize with 1 health", () => {
        const ship = new Ship(1);
        expect(ship.length).toBe(1);
    });

    test("Start with 0 hits", () => {
        const ship = new Ship(3);
        expect(ship.numHits).toBe(0);
    });
});

describe("hit()", () => {
    test("Hit decrease health by 1", () => {
        const ship = new Ship(3);

        ship.hit();
        expect(ship.numHits).toBe(1);
    });

    test("Multiple hits", () => {
        const ship = new Ship(3);

        ship.hit();
        ship.hit();
        ship.hit();
        expect(ship.numHits).toBe(3);
    });
});

describe("isSunk()", () => {
    test("Sink when number of hits equal length", () => {
        const ship = new Ship(3);

        ship.hit();
        ship.hit();
        ship.hit();
        expect(ship.isSunk()).toBe(true);
    });

    test("Not sunk when less hits than length", () => {
        const ship = new Ship(2);

        ship.hit();
        expect(ship.isSunk()).toBe(false);
    });

    test("Not sunk when no hits", () => {
        const ship = new Ship(4);
        expect(ship.isSunk()).toBe(false);
    });
});
