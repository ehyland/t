import * as z from 'zod';

import { t } from '../trpc';
import { createAccount } from './queries';

export const SignUpRequest = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(255),
});

export const authRouter = t.router({
  signUp: t.procedure.input(SignUpRequest).mutation(async ({ input }) => {
    const result = await createAccount(input);

    if (result.type === 'success') {
      return { success: true, account: result.account };
    }

    return { success: false, reason: result.reason };
  }),
});
