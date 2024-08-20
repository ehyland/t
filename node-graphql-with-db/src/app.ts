import cors from "cors";
import express from "express";
import morgan from "morgan";
import * as graphql from "~/graphql";
import type { AppContext } from "./graphql/context";
import { createPubSub } from "./graphql/pubSub";
import * as routes from "./routes";

export function createApp() {
  const app = express();

  app.locals.appContext = {
    pubSub: createPubSub(),
  } satisfies AppContext;

  app.use(morgan("tiny"));
  app.use(cors());
  app.use(express.json());

  routes.install(app);
  graphql.install(app);

  return app;
}
