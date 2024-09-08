import type { ActionDefinitions } from '@bad-hacking/zustand';
import type { State, Store } from './core';

function markPosition(store: Store, x: number, y: number) {
  store.update((draft) => {
    draft.ticTacToe.board[y][x] = draft.ticTacToe.nextPlayer;
    draft.ticTacToe.nextPlayer = draft.ticTacToe.nextPlayer === 'x' ? 'o' : 'x';
  });
}

export type Actions = typeof actions;

export const actions = {
  markPosition,
} satisfies ActionDefinitions<State>;
