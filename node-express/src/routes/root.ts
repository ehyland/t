import { Express } from "express";
import handler from "express-async-handler";
import { duration } from "~/lib/time/duration";

export function register(app: Express) {
  app.get(
    "/",
    handler(async (_req, res) => {
      res.json({
        "5 mins as seconds": duration(5, "minutes").asSeconds(),
      });
    }),
  );
}
