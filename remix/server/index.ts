// install source maps first
import 'source-map-support/register';

// then remix globals
import '@remix-run/node/install';

// then prometheus server
import './prometheus';

import {
  unstable_createViteServer,
  unstable_loadViteServerBuild,
} from '@remix-run/dev';
import { createRequestHandler } from '@remix-run/express';
import express from 'express';
import { startServer } from './utils/startServer';

const SERVER_BUILD_PATH = '../build/index.js';

const vite =
  process.env.NODE_ENV === 'production'
    ? undefined
    : await unstable_createViteServer();

const app = express();

// handle asset requests
if (vite) {
  app.use(vite.middlewares);
} else {
  app.use(
    '/build',
    express.static('public/build', { immutable: true, maxAge: '1y' })
  );
}

app.use(express.static('public', { maxAge: '1h' }));

const requestHandler = createRequestHandler({
  build: vite
    ? () => unstable_loadViteServerBuild(vite!)
    : ((await import(SERVER_BUILD_PATH)) as any),
});

// handle SSR requests
app.all('*', requestHandler);

startServer({
  name: 'app',
  server: app,
  port: 3000,
});
