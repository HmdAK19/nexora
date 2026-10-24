export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function readString(record: Record<string, unknown>, key: string): string {
  const value = record[key];

  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`Invalid API response field: ${key}`);
  }

  return value;
}

export function readFiniteNumber(record: Record<string, unknown>, key: string): number {
  const value = record[key];

  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    throw new Error(`Invalid API response field: ${key}`);
  }

  return value;
}

export function readPositiveNumber(record: Record<string, unknown>, key: string): number {
  const value = readFiniteNumber(record, key);

  if (value === 0) {
    throw new Error(`Invalid API response field: ${key}`);
  }

  return value;
}

export function readIsoDate(record: Record<string, unknown>, key: string): string {
  const value = readString(record, key);

  if (!Number.isFinite(Date.parse(value))) {
    throw new Error(`Invalid API response field: ${key}`);
  }

  return value;
}
