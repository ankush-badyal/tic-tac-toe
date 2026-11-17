# Tic-tac-toe

A small browser-based tic-tac-toe foundation rendered with PixiJS. The current
shell supports two local players, turn tracking, wins, draws, and starting a new
game. It intentionally does not include an AI or strategy selection yet.

## Development

- `npm install` installs the project dependencies.
- `npm run dev` starts the local development server.
- `npm test` runs the game logic tests.
- `npm run typecheck` checks the TypeScript sources.
- `npm run build` type-checks and creates the production build in `dist/`.

The game rules are kept in `src/game.ts`; `src/main.ts` connects those rules to
the accessible HTML controls and PixiJS board rendering.
