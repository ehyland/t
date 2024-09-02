import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';
import { createTheme } from '@mantine/core';
import { localStorageColorSchemeManager } from '@mantine/core';
import type React from 'react';

const colorSchemeManager = localStorageColorSchemeManager({
  key: 'my-app-color-scheme',
});

const theme = createTheme({
  primaryColor: 'green',
  primaryShade: 7,
});

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultColorScheme?: 'dark' | 'light' | undefined;
}

export function ThemeProvider(props: ThemeProviderProps) {
  return (
    <MantineProvider
      defaultColorScheme={props.defaultColorScheme}
      colorSchemeManager={colorSchemeManager}
      theme={theme}
    >
      {props.children}
    </MantineProvider>
  );
}
