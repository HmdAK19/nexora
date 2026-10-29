import { describe, expect, it } from 'vitest';

import { linePath, movingAverage } from './chartMath';

describe('chart math', () => {
  it('calculates a moving average while preserving its warm-up range', () => {
    expect(movingAverage([2, 4, 6, 8], 3)).toEqual([null, null, 4, 6]);
  });

  it('builds a rounded SVG path and skips missing values', () => {
    expect(
      linePath(
        [10, null, 20],
        (index) => index + 0.126,
        (value) => value / 3
      )
    ).toBe('M 0.13 3.33 L 2.13 6.67');
  });

  it('returns an empty path when all values are missing', () => {
    expect(
      linePath(
        [null, null],
        (index) => index,
        (value) => value
      )
    ).toBe('');
  });
});
