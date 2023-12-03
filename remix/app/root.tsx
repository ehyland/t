import '@mantine/core/styles.css';

import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import { App } from './components';
import { MantineColorScheme } from '@mantine/core';

const colorScheme: MantineColorScheme = 'dark';

export default function Root() {
  return (
    <html lang="en" data-mantine-color-scheme={colorScheme}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <App colorScheme={colorScheme}>
          <Outlet />
        </App>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
