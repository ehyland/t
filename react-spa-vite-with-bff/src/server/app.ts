import path from 'node:path';
import express from 'express';
import helmet from 'helmet';
import { mutableCacheHeader } from './cache-control';
import { log } from './logger';
import { trpcExpressMiddleware } from './router';

const CLIENT_DIR = path.resolve('dist/client');

export async function createApp() {
  const app = express();

  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );

  app.use('/trpc', trpcExpressMiddleware);

  if (process.env.NODE_ENV === 'development') {
    log('adding vite middleware');
    const vite = await import('vite');

    const viteDevServer = await vite.createServer({
      server: { middlewareMode: true },
      clearScreen: false,
    });

    app.use(viteDevServer.middlewares);
  }

  app.use(
    '/assets',
    express.static(`${CLIENT_DIR}/assets`, {
      maxAge: '1 year',
      immutable: true,
      index: false,
      fallthrough: false,
    }),
  );

  app.use(
    '/',
    express.static(CLIENT_DIR, {
      index: false,
      setHeaders: (res) => {
        res.setHeader('Cache-Control', mutableCacheHeader);
      },
    }),
  );

  app.use('/', (req, res) => {
    switch (req.accepts(['html', 'image/*'])) {
      case 'image/*':
        res.status(404).send('not found');
        break;
      default:
        res.setHeader('Cache-Control', mutableCacheHeader);
        res.sendFile(path.resolve('dist/client/index.html'));
    }
  });

  return app;
}
