import { Box } from '@mui/material';

import { sparklineStyles } from './Sparkline.styles';

interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
}
export function Sparkline({ data, color = '#20d6c7', height = 44 }: SparklineProps) {
  const styles = sparklineStyles(height);
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map(
      (value, index) =>
        `${(index / Math.max(1, data.length - 1)) * 100},${height - ((value - min) / range) * (height - 6) - 3}`
    )
    .join(' ');
  const id = `spark-${data.join('-').replaceAll('.', '')}`;
  return (
    <Box
      component="svg"
      viewBox={`0 0 100 ${height}`}
      preserveAspectRatio="none"
      sx={styles.box1}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity=".28" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${height} ${points} 100,${height}`} fill={`url(#${id})`} />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </Box>
  );
}
