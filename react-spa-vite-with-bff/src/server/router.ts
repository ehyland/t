import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import { mutableCacheHeader } from './cache-control';
import { publicProcedure, router } from './trpc';

const appRouter = router({
  prise: publicProcedure.query(async () => ({
    formattedValue: '$100,000',
  })),
});

export const trpcExpressMiddleware = trpcExpress.createExpressMiddleware({
  router: appRouter,
  responseMeta: () => ({
    headers: {
      'cache-control': mutableCacheHeader,
    },
  }),
});

export type AppRouter = typeof appRouter;

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
