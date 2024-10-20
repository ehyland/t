import type { ImmerStore } from '@bad-hacking/tanstack-store-extensions';
import type { BoardState, PlayerKey } from '~/libs/tic-tac-toe';
import { type ResourcesStateSlice, resources } from './resources';

export type State = {
  ticTacToe: {
    nextPlayer: PlayerKey;
    board: BoardState;
  };
} & ResourcesStateSlice;

export const getInitialState = (): State => ({
  ...resources.initialStateSlice,
  ticTacToe: {
    nextPlayer: 'x',
    board: [
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
    ],
  },
});

export type Store = ImmerStore<State>;
