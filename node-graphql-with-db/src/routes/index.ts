import type { Express } from "express";
import handler from "express-async-handler";

export function install(app: Express) {
  app.get(
    "/readiness",
    handler(async (req, res) => {
      res.status(200).json({ success: true });
    }),
  );
}
