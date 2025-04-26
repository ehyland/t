import { ThemeProvider, TicTacToeApp } from './components';
import { getInitialState } from './store/core';
import { StoreProvider } from './store/react';

export default function App() {
  return (
    <ThemeProvider forceColorScheme="light">
      <StoreProvider initialState={getInitialState()}>
        <TicTacToeApp />
      </StoreProvider>
    </ThemeProvider>
  );
}
