import React from 'react';
import { MantineColorScheme, MantineProvider } from '@mantine/core';
import { createTheme } from '@mantine/core';

export const theme = createTheme({
  /* Put your mantine theme override here */
});

type ThemeProviderProps = {
  children?: React.ReactNode;
  colorScheme: MantineColorScheme;
};

export function ThemeProvider(props: ThemeProviderProps) {
  return (
    <MantineProvider defaultColorScheme={props.colorScheme} theme={theme}>
      {props.children}
    </MantineProvider>
  );
}
