import crypto from 'node:crypto';

import * as R from 'remeda';
import type { z } from 'zod';

import { db } from '~/s/db/db';
import type { DB } from '~/s/db/tables';

import type { SignUpRequest } from './router';

type CreateResult =
  | { type: 'success'; account: DB.Account }
  | { type: 'error'; reason: 'email_used' | 'unknown' };

export async function createAccount(
  input: z.infer<typeof SignUpRequest>,
): Promise<CreateResult> {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(input.password, salt, 1000, 64, 'sha256')
    .toString('hex');

  const [error, account] = await db
    .insert(db.schema.account)
    .values({ email: input.email, emailVerified: false })
    .returning()
    .then(
      ([account]) => [undefined, account] as const,
      (error) => [error, undefined] as const,
    );

  if (error && error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
    return { type: 'error', reason: 'email_used' };
  }

  if (!account) {
    return { type: 'error', reason: 'unknown' };
  }

  // save password
  await db
    .insert(db.schema.password)
    .values({ hash, salt, idAccount: account.id });

  return { type: 'success', account };
}

type CheckResult =
  | { type: 'success'; account: DB.Account }
  | { type: 'error'; reason: 'account_not_found' | 'password_incorrect' };

export async function checkCredentials(
  input: z.infer<typeof SignUpRequest>,
): Promise<CheckResult> {
  const accountWithPassword = await db.query.account.findFirst({
    where: (t, { eq }) => eq(t.email, input.email),
    with: {
      password: true,
    },
  });

  if (accountWithPassword === undefined) {
    return { type: 'error', reason: 'account_not_found' };
  }

  if (accountWithPassword.password === null) {
    throw new Error('Account missing password record');
  }

  const hash = crypto
    .pbkdf2Sync(
      input.password,
      accountWithPassword.password.salt,
      1000,
      64,
      'sha256',
    )
    .toString('hex');

  if (hash !== accountWithPassword.password.hash) {
    return { type: 'error', reason: 'password_incorrect' };
  }

  return {
    type: 'success',
    account: R.omit(accountWithPassword, ['password']),
  };
}

export async function createOneTimeCode(
  accountId: string,
  purpose: DB.OneTimeCode['purpose'],
) {
  const [record] = await db
    .insert(db.schema.oneTimeCode)
    .values({
      idAccount: accountId,
      code: Array.from({ length: 6 })
        .map(() => crypto.randomInt(0, 10))
        .join(''),
      purpose: purpose,
    })
    .returning();

  return record;
}

export async function getUserAccount(id: string) {
  return await db.query.account.findFirst({
    where: (t, { eq }) => eq(t.id, id),
  });
}
