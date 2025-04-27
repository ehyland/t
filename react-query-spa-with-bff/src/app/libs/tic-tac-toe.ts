export type PlayerKey = 'x' | 'o';
export type Position = { x: number; y: number };
export type PositionState = PlayerKey | undefined;

export type BoardState = [
  [PositionState, PositionState, PositionState],
  [PositionState, PositionState, PositionState],
  [PositionState, PositionState, PositionState],
];

function* walkHorizontal(board: BoardState, rowIndex: number) {
  for (const item of board[rowIndex]) {
    yield item;
  }
  return undefined;
}

function* walkVertical(board: BoardState, columnIndex: number) {
  for (const row of board) {
    yield row[columnIndex];
  }
  return undefined;
}

function* walkCross(board: BoardState, start: 'top_left' | 'bottom_left') {
  if (start === 'top_left') {
    for (let index = 0; index < board.length; index++) {
      yield board[index][index];
    }
  } else {
    for (let index = 0; index < board.length; index++) {
      yield board[board.length - 1 - index][index];
    }
  }

  return undefined;
}

function checkLine(
  line: Generator<PositionState, void>,
): false | { marker: PlayerKey } {
  const first = line.next();
  const firstValue = first.value;

  if (!firstValue) {
    return false;
  }

  for (const value of line) {
    if (value !== firstValue) return false;
  }

  return { marker: firstValue };
}

export const lineChecks = [
  (game: BoardState) => checkLine(walkVertical(game, 0)),
  (game: BoardState) => checkLine(walkVertical(game, 1)),
  (game: BoardState) => checkLine(walkVertical(game, 2)),
  (game: BoardState) => checkLine(walkHorizontal(game, 0)),
  (game: BoardState) => checkLine(walkHorizontal(game, 1)),
  (game: BoardState) => checkLine(walkHorizontal(game, 2)),
  (game: BoardState) => checkLine(walkCross(game, 'top_left')),
  (game: BoardState) => checkLine(walkCross(game, 'bottom_left')),
];

export function checkForWinner(board: BoardState) {
  for (const check of lineChecks) {
    const result = check(board);
    if (result !== false) {
      return result;
    }
  }
}

export function positionKey(x: number, y: number) {
  return `x=${x},y=${y}`;
}
