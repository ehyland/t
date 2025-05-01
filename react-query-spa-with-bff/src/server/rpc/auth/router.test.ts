import { expect, it } from 'vitest';
import { db } from '~/s/db/db';
import { installDB, installServer } from '~/s/test-utils';

installDB();
const { client } = installServer();

it('creates an account', async () => {
  const TEST_EMAIL = 'eamon@example.com';
  const result = await client.auth.signUp.mutate({
    email: TEST_EMAIL,
    password: '12345678',
  });

  // API returns success
  expect(result.success).toBe(true);

  // account exists with password in db
  const account = await db.query.account.findFirst({
    where: (t, { eq }) => eq(t.email, TEST_EMAIL),
    with: { password: true },
  });

  expect(account?.email).toBe(TEST_EMAIL);
  expect(account?.password?.id).toBeDefined();
});

it('reject if account exists for email', async () => {
  const TEST_EMAIL = 'eamon@example.com';
  const result1 = await client.auth.signUp.mutate({
    email: TEST_EMAIL,
    password: '12345678',
  });

  expect(result1.success).toBe(true);

  const result2 = await client.auth.signUp.mutate({
    email: TEST_EMAIL,
    password: '12345678',
  });

  expect(result2).toEqual({ success: false, reason: 'email_used' });
});

it('reject if password is too short', async () => {
  const TEST_EMAIL = 'eamon@example.com';

  await expect(() =>
    client.auth.signUp.mutate({
      email: TEST_EMAIL,
      password: '12345',
    }),
  ).rejects.toThrowTRPCClientError({
    code: 'BAD_REQUEST',
    inputErrors: { password: ['String must contain at least 8 character(s)'] },
  });
});
