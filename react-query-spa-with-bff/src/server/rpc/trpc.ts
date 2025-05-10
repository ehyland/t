import { initTRPC, TRPCError } from '@trpc/server';
import type * as trpcExpress from '@trpc/server/adapters/express';
import superjson from 'superjson';
import { ZodError } from 'zod';

import { config } from '../config';
import type { DB } from '../db/tables';
import * as queries from './auth/queries';

const SESSION_COOKIE_KEY = 'session';

export async function createContext({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) {
  const sessionCookie = req.signedCookies[SESSION_COOKIE_KEY];

  let user;

  if (typeof sessionCookie === 'string') {
    user = await queries.getUserAccount(sessionCookie);
  }

  return { req, res, account: user };
}

export function setSessionCookie(ctx: Context, account: DB.Account) {
  ctx.res.cookie(SESSION_COOKIE_KEY, account.id, {
    secure: config.ENV === 'prod',
    httpOnly: true,
    sameSite: 'lax',
    signed: true,
  });
}

export type Context = Awaited<ReturnType<typeof createContext>>;

export const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter(opts) {
    const { shape, error } = opts;
    return {
      ...shape,
      data: {
        ...shape.data,
        inputErrors:
          error.code === 'BAD_REQUEST' && isZodError(error.cause)
            ? error.cause.flatten().fieldErrors
            : undefined,
      },
    };
  },
});

export const authenticated = t.procedure.use(async function isAuthed(opts) {
  const { ctx } = opts;
  if (!ctx.account) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return opts.next({
    ctx: {
      account: ctx.account,
    },
  });
});

export const isZodError = (error: unknown): error is ZodError => {
  return error instanceof ZodError;
};
