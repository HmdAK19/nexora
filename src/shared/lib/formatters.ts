export const formatCurrency = (value: number, currency = 'USD', locale = 'en-US') =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: value < 1 ? 6 : 2,
  }).format(value);
export const formatCompact = (value: number, locale = 'en-US') =>
  new Intl.NumberFormat(locale, {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
export const formatPercent = (value: number, locale = 'en-US') =>
  new Intl.NumberFormat(locale, {
    style: 'percent',
    signDisplay: 'always',
    maximumFractionDigits: 2,
  }).format(value / 100);
