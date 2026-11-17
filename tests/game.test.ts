import { describe, expect, it } from "vitest";
import { createInitialGame, playMove } from "../src/game";

describe("tic-tac-toe game", () => {
  it("starts with an empty board and gives X the first turn", () => {
    const game = createInitialGame();

    expect(game.board).toHaveLength(9);
    expect(game.board.every((cell) => cell === null)).toBe(true);
    expect(game.currentPlayer).toBe("X");
  });

  it("alternates turns and declares a winner", () => {
    let game = createInitialGame();
    for (const move of [0, 3, 1, 4, 2]) {
      game = playMove(game, move);
    }

    expect(game.winner).toBe("X");
    expect(game.currentPlayer).toBe("O");
    expect(playMove(game, 5)).toBe(game);
  });

  it("does not change the game for occupied or out-of-range moves", () => {
    const game = playMove(createInitialGame(), 0);

    expect(playMove(game, 0)).toBe(game);
    expect(playMove(game, -1)).toBe(game);
    expect(playMove(game, 9)).toBe(game);
  });

  it("recognizes a draw when the board fills without a winner", () => {
    let game = createInitialGame();
    for (const move of [0, 1, 2, 4, 3, 5, 7, 6, 8]) {
      game = playMove(game, move);
    }

    expect(game.winner).toBeNull();
    expect(game.isDraw).toBe(true);
  });
});
