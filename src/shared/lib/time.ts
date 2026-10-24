export function getSecondsRemaining(expiresAt: string, now: number): number {
  const expiry = Date.parse(expiresAt);

  if (!Number.isFinite(expiry)) {
    return 0;
  }

  return Math.max(0, Math.ceil((expiry - now) / 1_000));
}
