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
    expect(
      checkForWinner([
        ['x', 'o', 'x'],
        ['o', 'x', 'o'],
        ['x', 'x', 'o'],
      ]),
    ).toEqual({ marker: 'x' });

    expect(
      checkForWinner([
        ['x', 'o', 'x'],
        ['o', 'x', 'o'],
        ['x', undefined, 'o'],
      ]),
    ).toEqual({ marker: 'x' });

    expect(
      checkForWinner([
        [undefined, undefined, 'x'],
        [undefined, 'x', undefined],
        ['x', undefined, undefined],
      ]),
    ).toEqual({ marker: 'x' });

    expect(
      checkForWinner([
        [undefined, undefined, undefined],
        ['o', 'o', 'o'],
        [undefined, undefined, undefined],
      ]),
    ).toEqual({ marker: 'o' });

    expect(
      checkForWinner([
        [undefined, undefined, 'o'],
        [undefined, undefined, 'o'],
        [undefined, undefined, 'o'],
      ]),
    ).toEqual({ marker: 'o' });

    expect(
      checkForWinner([
        ['o', undefined, undefined],
        [undefined, 'o', undefined],
        [undefined, undefined, 'o'],
      ]),
    ).toEqual({ marker: 'o' });
  });
});
