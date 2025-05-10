import fs from 'node:fs';
import { createServer } from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { beforeEach } from 'node:test';

import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { cookie } from 'http-cookie-agent/undici';
import superjson from 'superjson';
import { CookieJar } from 'tough-cookie';
import { Agent, fetch, type RequestInit } from 'undici';
import { afterAll, beforeAll } from 'vitest';

import { createApp } from '~/s/app';
import type { AppRouter } from '~/s/rpc/appRouter';

export function installServer() {
  const MOCK_BASE_URL = 'http://test.example.com';
  const app = createApp();
  const httpServer = createServer(app);

  const TMP_DIR = path.resolve(fs.mkdtempSync(`${os.tmpdir()}/`));
  const UNIX_SOCKET = path.resolve(TMP_DIR, 'app.sock');

  const jar = new CookieJar();
  const agent = new Agent({
    connect: {
      socketPath: UNIX_SOCKET,
    },
  }).compose(cookie({ jar }));

  const client = createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        transformer: superjson,
        url: `${MOCK_BASE_URL}/trpc`,
        fetch: (input, init) =>
          fetch(input as string, {
            ...(init as RequestInit),
            dispatcher: agent,
          }),
      }),
    ],
  });

  beforeEach(async () => {
    await jar.removeAllCookies();
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

  return { client, jar, fetch, MOCK_BASE_URL };
}
