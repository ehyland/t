import { expect, it } from 'vitest';
import { howManySeconds } from './index';

it('does good things', () => {
  expect(howManySeconds(10, 'minutes')).toEqual(600);
});
