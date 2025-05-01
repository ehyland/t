import 'vitest';
import { ExpectTRPCClientError } from './matchers';

declare module 'vitest' {
  interface Assertion<T = any> extends ExpectTRPCClientError<T> {}
}
