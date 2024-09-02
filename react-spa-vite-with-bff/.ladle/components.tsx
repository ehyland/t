import { type GlobalProvider, ThemeState } from '@ladle/react';
import { ThemeProvider } from '../src/components/ThemeProvider';

const themeMap = {
  [ThemeState.Auto]: undefined,
  [ThemeState.Dark]: 'dark',
  [ThemeState.Light]: 'light',
} as const;

export const Provider: GlobalProvider = ({ children, globalState }) => (
  <ThemeProvider forceColorScheme={themeMap[globalState.theme]}>
    {children}
  </ThemeProvider>
);
