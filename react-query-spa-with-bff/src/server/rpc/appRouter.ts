import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';

import { authRouter } from './auth/router';
import { createContext, t } from './trpc';

const appRouter = t.router({
  auth: authRouter,
});

export const trpcExpressMiddleware = trpcExpress.createExpressMiddleware({
  router: appRouter,
  createContext,
});

export type AppRouter = typeof appRouter;

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
