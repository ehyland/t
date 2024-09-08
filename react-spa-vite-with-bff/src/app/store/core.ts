import type { EnhancedStore } from '@bad-hacking/zustand';
import type { BoardState, PlayerKey } from '~/libs/tic-tac-toe';

export type State = {
  ticTacToe: {
    nextPlayer: PlayerKey;
    board: BoardState;
  };
};

export const getInitialState = (): State => ({
  ticTacToe: {
    nextPlayer: 'x',
    board: [
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
    ],
  },
});

export type Store = EnhancedStore<State>;
