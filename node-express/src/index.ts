import express from "express";
import { createServer } from "http";
import { config } from "~/config";
import * as routes from "~/routes";
import closeWithGrace from "close-with-grace";
import { promisify } from "util";

const app = express();
const httpServer = createServer(app);

routes.register(app);

httpServer.listen(config.PORT, () => {
  console.log(`🚀 Server is now running on http://localhost:${config.PORT}`);
});

closeWithGrace(async () => {
  await promisify(httpServer.close).bind(httpServer)();
});
