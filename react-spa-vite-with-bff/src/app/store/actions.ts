import type { ActionDefinitions } from '@bad-hacking/tanstack-store-extensions';

import type { Store } from './core';
import { resources } from './resources';

function markPosition(store: Store, x: number, y: number) {
  store.setState((draft) => {
    draft.ticTacToe.board[y][x] = draft.ticTacToe.nextPlayer;
    draft.ticTacToe.nextPlayer = draft.ticTacToe.nextPlayer === 'x' ? 'o' : 'x';
  });
}

export type Actions = typeof actions;

export const actions = {
  markPosition,
  ...resources.actions,
} satisfies ActionDefinitions;
