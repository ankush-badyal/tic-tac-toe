import { Application, Container, Graphics } from "pixi.js";
import { createInitialGame, playMove, type GameState } from "./game";
import "./style.css";

const boardElement = document.querySelector<HTMLDivElement>("#board");
const controlsElement = document.querySelector<HTMLDivElement>("#board-controls");
const statusElement = document.querySelector<HTMLParagraphElement>("#game-status");
const resetButton = document.querySelector<HTMLButtonElement>("#reset-button");

if (!boardElement || !controlsElement || !statusElement || !resetButton) {
  throw new Error("The game page is missing required elements.");
}

const board = boardElement;
const controls = controlsElement;
const status = statusElement;
const reset = resetButton;
const app = new Application();
const boardGraphics = new Container();
let game: GameState = createInitialGame();

const cellButtons = Array.from({ length: 9 }, (_, index) => {
  const button = document.createElement("button");
  button.className = "board__cell";
  button.type = "button";
  button.addEventListener("click", () => {
    game = playMove(game, index);
    render();
  });
  controls.append(button);
  return button;
});

reset.addEventListener("click", () => {
  game = createInitialGame();
  render();
});

async function initializeGame(): Promise<void> {
  await app.init({
    antialias: true,
    autoDensity: true,
    background: "#111827",
    resolution: Math.min(window.devicePixelRatio || 1, 2),
    resizeTo: board,
  });

  app.canvas.className = "board__canvas";
  app.canvas.setAttribute("aria-hidden", "true");
  board.prepend(app.canvas);
  app.stage.addChild(boardGraphics);

  const resizeObserver = new ResizeObserver(drawBoard);
  resizeObserver.observe(board);
  render();
}

function render(): void {
  if (game.winner) {
    status.textContent = `Player ${game.winner} wins!`;
  } else if (game.isDraw) {
    status.textContent = "It's a draw.";
  } else {
    status.textContent = `Player ${game.currentPlayer}'s turn.`;
  }

  cellButtons.forEach((button, index) => {
    const mark = game.board[index];
    const row = Math.floor(index / 3) + 1;
    const column = (index % 3) + 1;
    button.setAttribute(
      "aria-label",
      `Row ${row}, column ${column}, ${mark ?? "empty"}`,
    );
    button.disabled = mark !== null || game.winner !== null || game.isDraw;
  });

  drawBoard();
}

function drawBoard(): void {
  if (!app.renderer) {
    return;
  }

  boardGraphics.removeChildren().forEach((child) => child.destroy());

  const { width, height } = app.screen;
  const size = Math.min(width, height);
  const offsetX = (width - size) / 2;
  const offsetY = (height - size) / 2;
  const cellSize = size / 3;
  const lineWidth = Math.max(2, size * 0.012);

  boardGraphics.position.set(offsetX, offsetY);

  const grid = new Graphics();
  for (let division = 1; division < 3; division += 1) {
    const position = cellSize * division;
    grid.moveTo(position, size * 0.06).lineTo(position, size * 0.94);
    grid.moveTo(size * 0.06, position).lineTo(size * 0.94, position);
  }
  grid.stroke({ color: "#374151", width: lineWidth });
  boardGraphics.addChild(grid);

  game.board.forEach((mark, index) => {
    if (mark === null) {
      return;
    }

    const centerX = (index % 3 + 0.5) * cellSize;
    const centerY = (Math.floor(index / 3) + 0.5) * cellSize;
    const radius = cellSize * 0.27;
    const markGraphic = new Graphics();

    if (mark === "X") {
      markGraphic
        .moveTo(centerX - radius, centerY - radius)
        .lineTo(centerX + radius, centerY + radius)
        .moveTo(centerX + radius, centerY - radius)
        .lineTo(centerX - radius, centerY + radius)
        .stroke({ color: "#fbbf24", width: lineWidth * 2.5, cap: "round" });
    } else {
      markGraphic
        .circle(centerX, centerY, radius)
        .stroke({ color: "#38bdf8", width: lineWidth * 2.5 });
    }

    boardGraphics.addChild(markGraphic);
  });
}

void initializeGame().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  status.textContent = `Unable to start the game: ${message}`;
  console.error("Failed to initialize the PixiJS game.", error);
});
