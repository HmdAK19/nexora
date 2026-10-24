export const supportedConversionAssets = ['BTC', 'ETH', 'USDT', 'SOL'] as const;

export type ConversionAsset = (typeof supportedConversionAssets)[number];

export const conversionLimits = {
  maximum: 1_000_000,
  maximumDecimals: 8,
  minimum: 0.00000001,
} as const;
