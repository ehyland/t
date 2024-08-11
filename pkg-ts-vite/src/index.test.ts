import { expect, it } from 'vitest';
import { sayHello } from './index';

it('does good things', () => {
  expect(sayHello()).toEqual('Hello 👋');
});
