import cors from "cors";
import express, { Express } from "express";
import helmet from "helmet";
import morgan from "morgan";
import * as indexRoute from "~/routes/root";

export function register(app: Express) {
  app.use(morgan("tiny"));
  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  indexRoute.register(app);
}
