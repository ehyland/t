import { cva } from 'class-variance-authority';
import { useEffect } from 'react';
import { type PositionState, positionKey } from '~/libs/tic-tac-toe';
import { useActions, useSelector } from '~/store/react';
import { resources } from '~/store/resources';
import { selectIsGameOver, selectWinner } from '~/store/selectors';

const box = cva(
  'relative aspect-square w-full flex justify-center items-center',
  {
    variants: {
      firstRow: {
        true: [],
        false: [
          "before:content[''] before:absolute before:z-[1] before:bg-neutral-900 before:-top-[--board-gap] before:-left-[--board-gap] before:-right-[--board-gap] before:h-[--board-gap]",
        ],
      },
      firstCol: {
        true: [],
        false: [
          "after:content[''] after:absolute after:z-[1] after:bg-neutral-900 after:-left-[--board-gap] after:-top-[--board-gap] after:-bottom-[--board-gap] after:w-[--board-gap]",
        ],
      },
    },
  },
);

export function TicTacToeApp() {
  const board = useSelector((state) => state.ticTacToe.board);
  return (
    <div className="px-4 py-6 flex gap-8 flex-col [--board-gap:theme(spacing.1)]">
      <div className="text-center text-2xl" data-testid="game-status">
        <GameStatus />
      </div>
      <div className="grid grid-cols-3 gap-[--board-gap] max-w-[500px] w-full self-center">
        {board.flatMap((row, y) =>
          row.map((marker, x) => (
            <div
              key={positionKey(x, y)}
              data-testid={positionKey(x, y)}
              className={box({ firstRow: y === 0, firstCol: x === 0 })}
            >
              <BoardPosition state={marker} x={x} y={y} />
            </div>
          )),
        )}
      </div>
    </div>
  );
}

type BoardPositionProps = {
  state: PositionState;
  x: number;
  y: number;
};

export function BoardPosition({ state, x, y }: BoardPositionProps) {
  const actions = useActions();
  const isGameOver = useSelector(selectIsGameOver);

  if (state === undefined && !isGameOver) {
    return (
      <button
        className="w-full h-full"
        type="button"
        onClick={() => actions.markPosition(x, y)}
      />
    );
  }

  return <span className="text-5xl">{state}</span>;
}

export function GameStatus() {
  const nextPlayer = useSelector((state) => state.ticTacToe.nextPlayer);
  const winner = useSelector(selectWinner);
  const prise = useSelector(resources.selectors.prise.state);
  const actions = useActions();

  useEffect(() => {
    actions.load('prise');
  }, [actions]);

  if (!winner) {
    return <>Next turn {nextPlayer}</>;
  }

  if (prise.status === 'LOADING') {
    return <>{winner.marker} wins, loading prise...</>;
  }

  if (prise.status === 'ERROR') {
    return (
      <>
        {winner.marker} wins, but unfortunately there was an error loading the
        prise!
      </>
    );
  }

  if (prise.status === 'LOADED') {
    return (
      <>
        {winner.marker} wins {prise.data.formattedValue}!
      </>
    );
  }

  return null;
}
