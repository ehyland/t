import '@mantine/core/styles.css';

import { createTheme, MantineProvider } from '@mantine/core';
import type React from 'react';

const theme = createTheme({
  primaryColor: 'green',
  primaryShade: 7,
});

interface ThemeProviderProps {
  children: React.ReactNode;
  forceColorScheme: 'dark' | 'light' | undefined;
}

export function ThemeProvider(props: ThemeProviderProps) {
  return (
    <MantineProvider
      defaultColorScheme={props.forceColorScheme}
      forceColorScheme={props.forceColorScheme}
      theme={theme}
    >
      {props.children}
    </MantineProvider>
  );
}
