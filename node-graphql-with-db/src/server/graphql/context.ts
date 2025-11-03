import type { Request, Response } from "express";
import type { createPubSub } from "./pubSub";

export type AppContext = {
  pubSub: ReturnType<typeof createPubSub>;
};

export type ServerContext = {
  req: Request;
  res: Response;
};

export type UserContext = {
  user: undefined;
};

export type Context = ServerContext & UserContext & AppContext;

export async function buildContext(
  serverContext: ServerContext,
): Promise<UserContext & AppContext> {
  return {
    ...serverContext.req.app.locals.appContext,
    user: undefined,
  };
}
