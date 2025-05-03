export async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export function sleepFromNowFn(ms: number): () => Promise<unknown> {
  const start = Date.now();
  return () => sleep(Math.max(0, ms - Date.now() - start));
}
