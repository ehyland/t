import { beforeEach } from 'node:test';
import { describe, expect, it } from 'vitest';
import { db } from '~/s/db/db';
import { DB } from '~/s/db/tables';
import { installDB, installServer } from '~/s/test-utils';

installDB();
const { client, jar, MOCK_BASE_URL } = installServer();

describe('signUp', () => {
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

    // check cookie is set
    expect(jar.getCookiesSync(MOCK_BASE_URL)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          hostOnly: true,
          httpOnly: true,
          key: 'session',
          path: '/',
          sameSite: 'lax',
          value: expect.any(String),
        }),
      ]),
    );
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
      inputErrors: {
        password: ['String must contain at least 8 character(s)'],
      },
    });
  });
});

describe('login', () => {
  let account: DB.Account;
  const TEST_EMAIL = 'eamon@example.com';
  const TEST_PASSWORD = '12345678';

  beforeEach(async () => {
    // account = await client()
    const result = await client.auth.signUp.mutate({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });

    if (!result.success) {
      throw new Error('failed creating account for test');
    }

    account = result.account;
    await jar.removeAllCookies();
  });

  it('authenticates', async () => {
    const response = await client.auth.login.mutate({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });

    // response shape snapshot (no unexpected fields)
    expect(response).toEqual({
      account: {
        createdAt: expect.any(String),
        email: account.email,
        id: account.id,
        updatedAt: expect.any(String),
      },
      success: true,
    });

    // TODO: check authenticated endpoint
  });
});
