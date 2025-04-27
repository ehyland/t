import {
  AspectRatio,
  Container,
  Flex,
  SimpleGrid,
  Stack,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { useEffect } from 'react';

import { positionKey, type PositionState } from '~/libs/tic-tac-toe';
import { useActions, useSelector } from '~/store/react';
import { resources } from '~/store/resources';
import { selectIsGameOver, selectWinner } from '~/store/selectors';

export function TicTacToeApp() {
  const board = useSelector((state) => state.ticTacToe.board);

  return (
    <>
      <Container size="xs">
        <Stack>
          <Text data-testid="game-status" ta="center" size="xl">
            <GameStatus />
          </Text>
          <AspectRatio ratio={1} w="100%">
            <SimpleGrid
              cols={3}
              bg="black"
              spacing="2px"
              style={{ gridTemplateRows: '1fr 1fr 1fr' }}
            >
              {board.flatMap((row, y) =>
                row.map((marker, x) => (
                  <Flex
                    key={positionKey(x, y)}
                    data-testid={positionKey(x, y)}
                    align="center"
                    justify="center"
                    bg="white"
                  >
                    <BoardPosition state={marker} x={x} y={y} />
                  </Flex>
                )),
              )}
            </SimpleGrid>
          </AspectRatio>
        </Stack>
      </Container>
    </>
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
      <UnstyledButton
        onClick={() => actions.markPosition(x, y)}
        w="100%"
        h="100%"
      />
    );
  }

  return <Text size="xl">{state}</Text>;
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
