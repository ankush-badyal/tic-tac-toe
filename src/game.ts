export type Player = "X" | "O";
export type Cell = Player | null;
export type Board = readonly Cell[];

export interface GameState {
  readonly board: Board;
  readonly currentPlayer: Player;
  readonly winner: Player | null;
  readonly isDraw: boolean;
}

const WINNING_LINES: readonly (readonly number[])[] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

/** Creates the initial empty board with X to move. */
export function createInitialGame(): GameState {
  return {
    board: Array<Cell>(9).fill(null),
    currentPlayer: "X",
    winner: null,
    isDraw: false,
  };
}

/** Applies a move when the selected cell is available and the game is active. */
export function playMove(state: GameState, index: number): GameState {
  if (
    !Number.isInteger(index) ||
    index < 0 ||
    index >= state.board.length ||
    state.board[index] !== null ||
    state.winner !== null ||
    state.isDraw
  ) {
    return state;
  }

  const board = [...state.board];
  board[index] = state.currentPlayer;

  const winner = findWinner(board);
  const isDraw = winner === null && board.every((cell) => cell !== null);

  return {
    board,
    currentPlayer: state.currentPlayer === "X" ? "O" : "X",
    winner,
    isDraw,
  };
}

function findWinner(board: Board): Player | null {
  for (const [first, second, third] of WINNING_LINES) {
    const player = board[first];
    if (player !== null && player === board[second] && player === board[third]) {
      return player;
    }
  }

  return null;
}
