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
