import React from 'react';
import { AppLayout, ThemeProvider } from '..';
import { MantineColorScheme } from '@mantine/core';

type AppProps = {
  children?: React.ReactNode;
  colorScheme: MantineColorScheme;
};

export function App(props: AppProps) {
  return (
    <ThemeProvider colorScheme={props.colorScheme}>
      <AppLayout>{props.children}</AppLayout>
    </ThemeProvider>
  );
}
