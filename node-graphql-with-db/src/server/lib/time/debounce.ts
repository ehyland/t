export interface DebounceOptions<T> {
  timeout: number;
  callback: () => T;
  debug?: (message: string) => void;
}

interface DebouncedFunction {
  (): void;
  cancel: () => void;
}

export function debounce<T>({
  timeout,
  callback,
  debug,
}: DebounceOptions<T>): DebouncedFunction {
  let lastCallTime = Number.NEGATIVE_INFINITY;
  let timeoutRef: NodeJS.Timeout | undefined = undefined;

  async function call() {
    lastCallTime = Date.now();
    timeoutRef = undefined;
    debug?.("calling function");
    const callStartTime = lastCallTime;
    try {
      await callback();
      debug?.(`took ${Date.now() - callStartTime}ms`);
    } catch (error) {
      debug?.(
        `error executing after ${
          Date.now() - callStartTime
        }ms. Error: ${error}`,
      );
    }
  }

  function debouncedFunction() {
    const now = Date.now();
    const sinceLastCall = now - lastCallTime;
    if (timeoutRef === undefined && now - lastCallTime > timeout) {
      debug?.("calling immediately");
      call();
    } else if (timeoutRef === undefined) {
      debug?.(`delaying call for ${timeout - sinceLastCall}`);
      timeoutRef = setTimeout(call, timeout - sinceLastCall);
    } else {
      debug?.(
        `dropping call as already queued (${timeout - sinceLastCall} pending)`,
      );
    }
  }

  function cancel() {
    debug?.("cancelling debounce");
    if (timeoutRef) {
      debug?.("clearing timeout");
      clearTimeout(timeoutRef);
      timeoutRef = undefined;
    }
  }

  return Object.assign(debouncedFunction, { cancel });
}
