import type { Express } from "express";
import handler from "express-async-handler";

export function installRoutes(app: Express) {
  app.get(
    "/",
    handler(async (_req, res) => {
      res.json({
        message: "hello",
      });
    }),
  );
}
