import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter, RouterOutput } from './.server/router';

const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: '/trpc',
    }),
  ],
});

export type Messages = RouterOutput['messages'];

export const getMessages = () => trpc.messages.query();
