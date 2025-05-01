import { initTRPC } from '@trpc/server';
import type * as trpcExpress from '@trpc/server/adapters/express';
import { ZodError } from 'zod';

export const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({ req, res }); // no context
export type Context = Awaited<ReturnType<typeof createContext>>;

export const t = initTRPC.context<Context>().create({
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

export const isZodError = (error: unknown): error is ZodError => {
  return error instanceof ZodError;
};
