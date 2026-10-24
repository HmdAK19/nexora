export const supportedPurchaseAssets = ['USDT', 'BTC', 'ETH'] as const;
export type PurchaseAsset = (typeof supportedPurchaseAssets)[number];

export const purchaseLimits = {
  maximum: 50_000,
  minimum: 10,
} as const;

export const p2pOffers = [
  { asset: 'USDT', offer: 'USDT · 0.999 USD', completion: 98 },
  { asset: 'BTC', offer: 'BTC · 67,980 USD', completion: 98.5 },
  { asset: 'ETH', offer: 'ETH · 3,625 USD', completion: 99 },
] as const;
