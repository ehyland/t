import { expect } from 'vitest';

import { TRPCClientError } from '@trpc/client';
import { TRPC_ERROR_CODE_KEY } from '@trpc/server/rpc';
import { AppRouter } from '../rpc/appRouter';

type TRPCMatcherParams = {
  code?: TRPC_ERROR_CODE_KEY;
  inputErrors?: { [key: string | number | symbol]: string[] };
};

expect.extend({
  toThrowTRPCClientError(received, params: TRPCMatcherParams) {
    const { isNot, promise, equals } = this;

    const withCodeSuffix =
      params.code === undefined ? '' : ` with code ${params.code}`;

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

    if (!isTRPCClientError(received)) {
      return failureTemplate(
        `${received} is not an instance of TRPCClientError`,
      );
    }

    if (
      params.inputErrors !== undefined &&
      !equals(received.data?.inputErrors, params.inputErrors)
    ) {
      return failureTemplate(`But expected inputErrors did not match`, {
        actual: received.data?.inputErrors,
        expected: params.inputErrors,
      });
    }

    if (params.code !== undefined && received.data?.code !== params.code) {
      return failureTemplate(
        `Received error code was "${received.data?.code}"`,
      );
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
