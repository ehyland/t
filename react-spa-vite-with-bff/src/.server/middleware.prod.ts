import path from 'node:path';
import type { Express } from 'express';
import express from 'express';
import { mutableCacheHeader } from './cache-control';
import { trpcExpressMiddleware } from './router';

const CLIENT_DIR = path.resolve('dist/client');

export async function applyAssetMiddleware(app: Express) {
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
}

export async function applyTrpcMiddleware(app: Express) {
  app.use('/trpc', trpcExpressMiddleware);
}
