const DEFAULT_ERROR_MESSAGE = 'Expected value to be non-nullable';

export function notNull<T>(
  value: T,
  message = DEFAULT_ERROR_MESSAGE,
): NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error(message);
  }
  return value;
}
