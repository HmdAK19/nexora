export type Timeframe = '1m' | '5m' | '15m' | '1h' | '4h' | '1D';

export interface Candle {
  close: number;
  high: number;
  low: number;
  open: number;
  time: number;
  volume: number;
}

export const chartTimeframes: Timeframe[] = ['1m', '5m', '15m', '1h', '4h', '1D'];

export function generateCandles(timeframe: Timeframe): Candle[] {
  const seed = chartTimeframes.indexOf(timeframe) + 2;
  let previous = 67_300 + seed * 70;

  return Array.from({ length: 110 }, (_, index) => {
    const wave = Math.sin(index * 0.39 + seed) * 145 + Math.cos(index * 0.17) * 82;
    const open = previous;
    const close = open + Math.sin(index * 1.71 + seed) * 115 + wave * 0.11;
    const high = Math.max(open, close) + 35 + ((index * 37) % 105);
    const low = Math.min(open, close) - 32 - ((index * 29) % 92);
    previous = close;

    return {
      close,
      high,
      low,
      open,
      time: Date.now() - (109 - index) * 15 * 60_000,
      volume: 18 + ((index * 47) % 105) + Math.abs(close - open) * 0.18,
    };
  });
}

export function movingAverage(values: number[], period: number) {
  return values.map((_, index) => {
    if (index < period - 1) return null;

    const slice = values.slice(index - period + 1, index + 1);

    return slice.reduce((sum, value) => sum + value, 0) / period;
  });
}

export function linePath(
  values: Array<number | null>,
  x: (index: number) => number,
  y: (value: number) => number
) {
  return values.reduce(
    (path, value, index) =>
      value === null ? path : `${path}${path ? ' L' : 'M'} ${x(index).toFixed(2)} ${y(value).toFixed(2)}`,
    ''
  );
}
