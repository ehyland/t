import { TicTacToeApp } from './components';
import { getInitialState } from './store/core';
import { StoreProvider } from './store/react';

export default function App() {
  return (
    <StoreProvider initialState={getInitialState()}>
      <TicTacToeApp />
    </StoreProvider>
  );
}
