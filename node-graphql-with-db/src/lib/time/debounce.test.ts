import { expect, it, vi } from "vitest";
import { debounce } from "./debounce";
import { duration } from "./duration";

vi.useFakeTimers({});

function setup() {
  const mockFn = vi.fn();
  const debounceFn = debounce({
    timeout: duration(1, "second").asMilliseconds(),
    callback: mockFn,
  });

  return { mockFn, debounceFn };
}

it("calls makes leading call", () => {
  const ctx = setup();
  ctx.debounceFn();
  expect(ctx.mockFn).toHaveBeenCalledOnce();
});

it("queues second call for timeout", async () => {
  const ctx = setup();

  // queue 2
  ctx.debounceFn();
  ctx.debounceFn();

  // expect first immediately
  expect(ctx.mockFn).toHaveBeenCalledOnce();

  // wait less than timeout & expect no second call
  await vi.advanceTimersByTimeAsync(500);
  expect(ctx.mockFn).toHaveBeenCalledOnce();

  // wait remaining time & expect second call
  await vi.advanceTimersByTimeAsync(500);
  expect(ctx.mockFn).toHaveBeenCalledTimes(2);

  // confirm there are no more calls
  await vi.runOnlyPendingTimersAsync();
  expect(ctx.mockFn).toHaveBeenCalledTimes(2);
});

it("drops calls once one is already queued", async () => {
  const ctx = setup();

  // call 4 times
  ctx.debounceFn();
  ctx.debounceFn();
  ctx.debounceFn();
  ctx.debounceFn();

  // expect first immediately
  expect(ctx.mockFn).toHaveBeenCalledOnce();

  // wait for timeout
  await vi.advanceTimersByTimeAsync(1000);
  expect(ctx.mockFn).toHaveBeenCalledTimes(2);

  // confirm there are no more calls
  await vi.advanceTimersByTimeAsync(10_000);
  await vi.advanceTimersByTimeAsync(10_000);
  await vi.runOnlyPendingTimersAsync();
  expect(ctx.mockFn).toHaveBeenCalledTimes(2);
});

it("cancels pending timeout on cancel", async () => {
  const ctx = setup();

  // call 2 times
  ctx.debounceFn();
  ctx.debounceFn();

  // expect first immediately
  expect(ctx.mockFn).toHaveBeenCalledOnce();

  // wait for less than timeout then cancel
  await vi.advanceTimersByTimeAsync(500);
  ctx.debounceFn.cancel();

  // confirm there are no more calls
  await vi.advanceTimersByTimeAsync(10_000);
  await vi.advanceTimersByTimeAsync(10_000);
  await vi.runOnlyPendingTimersAsync();
  expect(ctx.mockFn).toHaveBeenCalledOnce();
});
