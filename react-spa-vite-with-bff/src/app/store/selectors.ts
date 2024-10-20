import * as lib from '~/libs/tic-tac-toe';
import type { State } from './core';

export const selectWinner = (state: State) => {
  for (const check of lib.lineChecks) {
    const result = check(state.ticTacToe.board);
    if (result !== false) {
      return result;
    }
  }

  return false;
};

export const selectIsGameOver = (state: State) => {
  return selectWinner(state) !== false;
};
