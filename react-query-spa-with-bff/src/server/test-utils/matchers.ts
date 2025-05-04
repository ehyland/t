import { TRPCClientError } from '@trpc/client';
import type { TRPC_ERROR_CODE_KEY } from '@trpc/server/rpc';
import { expect } from 'vitest';

import type { AppRouter } from '../rpc/appRouter';

type TRPCMatcherParams = {
  code?: TRPC_ERROR_CODE_KEY;
  message?: string;
  inputErrors?: { [key: string | number | symbol]: string[] };
};

expect.extend({
  toThrowTRPCClientError(received, params: TRPCMatcherParams) {
    const { isNot, promise, equals } = this;

    const withCodeSuffix =
      params.code === undefined ? '' : ` with code ${params.code}`;

    // Must be a rejects assertion
    if (promise !== 'rejects') {
      return {
        message: () =>
          `expected promise ${isNot ? 'to not throw' : 'to throw'} a TRPCClientError${withCodeSuffix}`,
        pass: false,
      };
    }

    const failureTemplate = (
      reason: string,
      extra?: { actual: unknown; expected: unknown },
    ) => ({
      message: () =>
        `expected "${received}" ${isNot ? 'to not be' : 'to be'} a TRPCClientError${withCodeSuffix}. ${reason}`,
      pass: false,
      ...extra,
    });

    // must be trpc error
    if (!isTRPCClientError(received)) {
      return failureTemplate(
        `${received} is not an instance of TRPCClientError`,
      );
    }

    // check inputErrors
    if (
      params.inputErrors !== undefined &&
      !equals(received.data?.inputErrors, params.inputErrors)
    ) {
      return failureTemplate(`But expected inputErrors did not match`, {
        actual: received.data?.inputErrors,
        expected: params.inputErrors,
      });
    }

    // check code
    if (params.code !== undefined && received.data?.code !== params.code) {
      return failureTemplate(`Unexpected error code`, {
        actual: received.data?.code,
        expected: params.code,
      });
    }

    // check message
    if (params.message !== undefined && received.message !== params.message) {
      return failureTemplate(`Unexpected error message`, {
        actual: received.message,
        expected: params.message,
      });
    }

    return {
      message: () => `TRPCClientError${withCodeSuffix}`,
      pass: true,
    };
  },
});

export const isTRPCClientError = (
  error: unknown,
): error is TRPCClientError<AppRouter> => {
  return error instanceof TRPCClientError;
};

export interface ExpectTRPCClientError<R = unknown> {
  toThrowTRPCClientError(params: TRPCMatcherParams): R;
}
