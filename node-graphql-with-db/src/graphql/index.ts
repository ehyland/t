import type { Express } from "express";
import { yoga } from "./schema";

export async function install(app: Express) {
  app.use(yoga.graphqlEndpoint, yoga as any);
}
