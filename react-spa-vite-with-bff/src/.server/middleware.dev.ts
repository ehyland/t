import type { Express } from 'express';
import * as vite from 'vite';

const viteDevServer = await vite.createServer({
  server: { middlewareMode: true },
});

export async function applyAssetMiddleware(app: Express) {
  app.use(viteDevServer.middlewares);
}

export async function applyTrpcMiddleware(app: Express) {
  app.use('/trpc', async (req, res, next) => {
    const router = (await viteDevServer.ssrLoadModule(
      './src/.server/router.ts',
    )) as typeof import('./router');
    router.trpcExpressMiddleware(req, res, next);
  });
}
