import { createServer } from "node:http";
import closeWithGrace from "close-with-grace";
import { runMigration } from "~/server/db/migrator";
import { createApp } from "./app";
import { config } from "./config";
import { GRAPHQL_ENDPOINT_PATH } from "./constants";

await runMigration();

const httpServer = createServer(createApp());

httpServer.listen(config.PORT, () => {
  console.log(
    `🚀 Server is now running on http://localhost:${config.PORT}${GRAPHQL_ENDPOINT_PATH}`,
  );
});

closeWithGrace(
  () =>
    new Promise((resolve) => {
      httpServer.close(() => {
        resolve();
      });
    }),
);
