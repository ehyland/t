import type { Express } from "express";
import { yoga } from "./schema";

export async function install(app: Express) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  app.use(yoga.graphqlEndpoint, yoga as any);
}
