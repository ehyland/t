import fs from 'node:fs';
import { createServer } from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll } from 'vitest';
import { createApp } from '~/s/app';
import { Agent, fetch, RequestInit } from 'undici';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '~/s/rpc/appRouter';

export function installServer() {
  const MOCK_BASE_URL = 'http://test.example.com';
  const app = createApp();
  const httpServer = createServer(app);

  const TMP_DIR = path.resolve(fs.mkdtempSync(`${os.tmpdir()}/`));
  const UNIX_SOCKET = path.resolve(TMP_DIR, 'app.sock');

  const agent = new Agent({
    connect: {
      socketPath: UNIX_SOCKET,
    },
  });

  const client = createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: 'http://localhost:3000/trpc',
        fetch: (input, init) =>
          fetch(input as string, {
            ...(init as RequestInit),
            dispatcher: agent,
          }),
      }),
    ],
  });

  beforeAll(async () => {
    await new Promise((resolve) => {
      httpServer.listen(UNIX_SOCKET, () => {
        resolve(undefined);
      });
    });
  });

  afterAll(async () => {
    await new Promise((resolve) => {
      httpServer.close(() => {
        resolve(undefined);
      });
    });

    fs.rmSync(TMP_DIR, { force: true, recursive: true });
  });

  return { client, fetch, MOCK_BASE_URL };
}
