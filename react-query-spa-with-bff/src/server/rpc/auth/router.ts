import * as z from 'zod';

import { sleepFromNowFn } from '~/libs/time';

import { authenticated, setSessionCookie, t } from '../trpc';
import * as queries from './queries';

export const SignUpRequest = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(255),
});

export const authRouter = t.router({
  signUp: t.procedure.input(SignUpRequest).mutation(async ({ input, ctx }) => {
    const result = await queries.createAccount(input);

    if (result.type === 'success') {
      setSessionCookie(ctx, result.account);
      return { success: true as const, account: result.account };
    }

    return { success: false as const, reason: result.reason };
  }),

  login: t.procedure.input(SignUpRequest).mutation(async ({ input, ctx }) => {
    const sleepRemaining = sleepFromNowFn(100);

    const result = await queries.checkCredentials(input);

    if (result.type === 'success') {
      setSessionCookie(ctx, result.account);
      return { success: true as const, account: result.account };
    }

    // prevent timing attacks
    await sleepRemaining();

    return {
      success: false as const,
      reason: 'Password incorrect or account not found',
    };
  }),

  account: authenticated.query(async ({ ctx }) => ctx.account),

  requestEmailVerificationCode: t.procedure.mutation(async () => {}),

  provideEmailVerificationCode: t.procedure
    .input(
      z.object({
        code: z.string(),
      }),
    )
    .mutation(async () => {}),
});
