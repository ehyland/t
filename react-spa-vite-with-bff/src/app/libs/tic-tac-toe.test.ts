import { describe, expect, it } from 'vitest';
import { checkForWinner } from './tic-tac-toe';

describe('checkForWinner()', () => {
  it('returns undefined for empty board', () => {
    const result = checkForWinner([
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
    ]);

    expect(result).toBe(undefined);
  });

  it('returns undefined for no winner board', () => {
    const result = checkForWinner([
      ['x', 'o', 'o'],
      ['o', 'x', 'x'],
      ['x', 'x', 'o'],
    ]);

    expect(result).toBe(undefined);
  });

  it('returns marker for winner', () => {
    const result = checkForWinner([
      ['x', 'o', 'x'],
      ['o', 'x', 'o'],
      ['x', 'x', 'o'],
    ]);

    expect(result).toEqual({ marker: 'x' });
  });
});
