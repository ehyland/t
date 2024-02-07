import { describe, expect, it } from 'vitest';
import { sayHello } from '.';

describe(`sayHello()`, () => {
  it(`returns hello message directed at the input name`, () => {
    expect(sayHello('eamon')).toBe('Hello eamon');
  });
});
