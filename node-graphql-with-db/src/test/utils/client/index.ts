import fs from "node:fs";
import { createServer } from "node:http";
import os from "node:os";
import path from "node:path";
import { GraphQLClient } from "graphql-request";
import { Agent, fetch, setGlobalDispatcher } from "undici";
import { afterAll, beforeAll } from "vitest";
import { createApp } from "~/app";
import { GRAPHQL_ENDPOINT_PATH } from "~/constants";
import { getSdk } from "./generated";

export function installServer() {
  const MOCK_BASE_URL = "http://test.example.com";
  const app = createApp();
  const httpServer = createServer(app);

  const GRAPHQL_ENDPOINT_URL = `${MOCK_BASE_URL}${GRAPHQL_ENDPOINT_PATH}`;

  const TMP_DIR = path.resolve(fs.mkdtempSync(`${os.tmpdir()}/`));
  const UNIX_SOCKET = path.resolve(TMP_DIR, "app.sock");

  const agent = new Agent({
    connect: {
      socketPath: UNIX_SOCKET,
    },
  });

  setGlobalDispatcher(agent);

  const requestClient = new GraphQLClient(GRAPHQL_ENDPOINT_URL, {
    fetch: fetch as unknown as typeof global.fetch,
  });

  const client = getSdk(requestClient);

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
