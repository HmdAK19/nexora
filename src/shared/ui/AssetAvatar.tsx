import { Avatar } from '@mui/material';

import { assetAvatarStyles } from './AssetAvatar.styles';

const colors: Record<string, string> = {
  BTC: '#f7931a',
  ETH: '#627eea',
  SOL: '#14f195',
  USDT: '#26a17b',
  ADA: '#3468d4',
  XRP: '#23292f',
  DOGE: '#c2a633',
};
interface AssetAvatarProps {
  symbol: string;
  size?: number;
}
export function AssetAvatar({ symbol, size = 34 }: AssetAvatarProps) {
  const styles = assetAvatarStyles(colors[symbol] ?? '#546278', size);
  return <Avatar sx={styles.avatar1}>{symbol.slice(0, 1)}</Avatar>;
}
