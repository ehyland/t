import { createServer } from "node:http";
import closeWithGrace from "close-with-grace";
import { runMigration } from "~/db/migrator";
import { createApp } from "./app";
import { config } from "./config";

runMigration();

const httpServer = createServer(createApp());

httpServer.listen(config.PORT, () => {
  console.log(`🚀 Server is now running on http://localhost:${config.PORT}`);
});

closeWithGrace(
  () =>
    new Promise((resolve) => {
      httpServer.close(() => {
        resolve();
      });
    }),
);
