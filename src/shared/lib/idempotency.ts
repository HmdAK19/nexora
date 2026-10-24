export function createIdempotencyKey(): string {
  if (!globalThis.crypto?.randomUUID) {
    throw new Error('Secure UUID generation is unavailable');
  }

  return globalThis.crypto.randomUUID();
}
