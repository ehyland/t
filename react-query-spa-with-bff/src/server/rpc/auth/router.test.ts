import { assert, beforeEach, describe, expect, it } from 'vitest';

import type { DB } from '~/s/db/tables';
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
    assert(result.success);

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

    // Check can get account
    expect(await client.auth.account.query()).toEqual({
      createdAt: expect.any(Date),
      email: TEST_EMAIL,
      emailVerified: false,
      id: result.account.id,
      updatedAt: expect.any(Date),
    });
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
    // Check unable to access protected endpoint
    await expect(() =>
      client.auth.account.query(),
    ).rejects.toThrowTRPCClientError({
      code: 'UNAUTHORIZED',
      message: 'UNAUTHORIZED',
    });

    const loginResponse = await client.auth.login.mutate({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });

    // response shape snapshot (no unexpected fields)
    expect(loginResponse).toEqual({
      account: {
        createdAt: expect.any(Date),
        email: account.email,
        emailVerified: false,
        id: account.id,
        updatedAt: expect.any(Date),
      },
      success: true,
    });

    assert(loginResponse.success === true);
    expect(loginResponse.account).toEqual(await client.auth.account.query());
  });

  it('returns error on bad password', async () => {
    const loginResponse = await client.auth.login.mutate({
      email: TEST_EMAIL,
      password: 'bad password',
    });

    // response shape snapshot (no unexpected fields)
    expect(loginResponse).toEqual({
      success: false,
      reason: 'Password incorrect or account not found',
    });
  });
});

describe('account', () => {
  let account: DB.Account;
  const TEST_EMAIL = 'eamon@example.com';
  const TEST_PASSWORD = '12345678';

  beforeEach(async () => {
    const result = await client.auth.signUp.mutate({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });

    assert(result.success);

    account = result.account;
    await jar.removeAllCookies();
  });

  it('is only accessible when logged in', async () => {
    await expect(() =>
      client.auth.account.query(),
    ).rejects.toThrowTRPCClientError({
      code: 'UNAUTHORIZED',
      message: 'UNAUTHORIZED',
    });

    await client.auth.login.mutate({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });

    // response shape snapshot (no unexpected fields)
    expect(await client.auth.account.query()).toEqual({
      createdAt: expect.any(Date),
      email: account.email,
      emailVerified: false,
      id: account.id,
      updatedAt: expect.any(Date),
    });
  });
});
