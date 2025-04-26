import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';

import type { AppRouter, RouterOutput } from '../server/router';

export const api = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: '/trpc',
    }),
  ],
});

export type Prise = RouterOutput['prise'];
