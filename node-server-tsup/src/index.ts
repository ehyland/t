import { createServer } from "node:http";
import { config } from "~/config";
import { app } from "./app";

const httpServer = createServer(app);

httpServer.listen(config.PORT, "0.0.0.0", () => {
  console.log(`🚀 Server is now running on http://localhost:${config.PORT}`);
});
