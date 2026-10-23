import { useMemo, useRef, useState } from 'react';
import {
  Crosshair,
  Eye,
  EyeOff,
  Maximize2,
  Minus,
  MousePointer2,
  RotateCcw,
  Ruler,
  Trash2,
  TrendingUp,
  Type,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { Box, Button, Divider, IconButton, Menu, MenuItem, Stack, Tooltip, Typography } from '@mui/material';

import { chartTimeframes, generateCandles, linePath, movingAverage, type Timeframe } from '../lib';
import { styles } from './CandlestickChart.styles';

type DrawingTool = 'cursor' | 'trend' | 'horizontal' | 'measure' | 'text';
interface Point {
  x: number;
  y: number;
}
interface Drawing {
  end: Point;
  id: number;
  start: Point;
  tool: Exclude<DrawingTool, 'cursor'>;
}
const WIDTH = 920;
const HEIGHT = 430;
const PRICE_HEIGHT = 330;
const PLOT_LEFT = 12;
const PLOT_RIGHT = 850;
function ToolButton({
  active,
  label,
  onClick,
  children,
}: {
  active?: boolean;
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <Tooltip title={label} placement="right">
      <IconButton
        aria-label={label}
        aria-pressed={active}
        onClick={onClick}
        size="small"
        sx={styles.iconButton1(active)}
      >
        {children}
      </IconButton>
    </Tooltip>
  );
}
export function CandlestickChart() {
  const [timeframe, setTimeframe] = useState<Timeframe>('15m');
  const [tool, setTool] = useState<DrawingTool>('cursor');
  const [zoom, setZoom] = useState(1);
  const [hover, setHover] = useState<Point | null>(null);
  const [draft, setDraft] = useState<Point | null>(null);
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [showVolume, setShowVolume] = useState(true);
  const [showMa, setShowMa] = useState(true);
  const [showBands, setShowBands] = useState(true);
  const [settingsAnchor, setSettingsAnchor] = useState<HTMLElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const candles = useMemo(() => generateCandles(timeframe), [timeframe]);
  const visibleCount = Math.max(28, Math.round(candles.length / zoom));
  const visible = useMemo(() => candles.slice(-visibleCount), [candles, visibleCount]);
  const bounds = useMemo(() => {
    const values = visible.flatMap((candle) => [candle.high, candle.low]);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.08;
    return {
      min: min - padding,
      max: max + padding,
    };
  }, [visible]);
  const x = (index: number) => PLOT_LEFT + ((index + 0.5) / visible.length) * (PLOT_RIGHT - PLOT_LEFT);
  const y = (value: number) => 12 + ((bounds.max - value) / (bounds.max - bounds.min)) * (PRICE_HEIGHT - 24);
  const closes = visible.map(({ close }) => close);
  const ma7 = movingAverage(closes, 7);
  const ma20 = movingAverage(closes, 20);
  const bandMiddle = movingAverage(closes, 20);
  const bandOffset = (index: number) =>
    index < 19
      ? 0
      : Math.sqrt(
          closes
            .slice(index - 19, index + 1)
            .reduce((sum, value) => sum + (value - (bandMiddle[index] ?? value)) ** 2, 0) / 20
        ) * 2;
  const upperBand = bandMiddle.map((value, index) => (value === null ? null : value + bandOffset(index)));
  const lowerBand = bandMiddle.map((value, index) => (value === null ? null : value - bandOffset(index)));
  const candleWidth = Math.max(2, Math.min(9, ((PLOT_RIGHT - PLOT_LEFT) / visible.length) * 0.62));
  const hoveredIndex = hover
    ? Math.max(
        0,
        Math.min(
          visible.length - 1,
          Math.floor(((hover.x - PLOT_LEFT) / (PLOT_RIGHT - PLOT_LEFT)) * visible.length)
        )
      )
    : visible.length - 1;
  const hoveredCandle = visible[hoveredIndex] ?? visible.at(-1);
  const eventPoint = (event: React.PointerEvent<SVGSVGElement>): Point => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) * WIDTH) / rect.width,
      y: ((event.clientY - rect.top) * HEIGHT) / rect.height,
    };
  };
  const handleClick = (event: React.PointerEvent<SVGSVGElement>) => {
    if (tool === 'cursor') return;
    const point = eventPoint(event);
    if (tool === 'horizontal') {
      setDrawings((items) => [
        ...items,
        {
          id: Date.now(),
          tool,
          start: {
            x: PLOT_LEFT,
            y: point.y,
          },
          end: {
            x: PLOT_RIGHT,
            y: point.y,
          },
        },
      ]);
      return;
    }
    if (!draft) setDraft(point);
    else {
      setDrawings((items) => [
        ...items,
        {
          id: Date.now(),
          tool,
          start: draft,
          end: point,
        },
      ]);
      setDraft(null);
    }
  };
  const reset = () => {
    setZoom(1);
    setHover(null);
    setDraft(null);
    setTool('cursor');
  };
  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) await wrapperRef.current?.requestFullscreen();
    else await document.exitFullscreen();
  };
  return (
    <Box ref={wrapperRef} sx={styles.box2}>
      <Stack aria-label="Drawing tools" role="toolbar" spacing={0.35} sx={styles.stack3}>
        <ToolButton
          active={tool === 'cursor'}
          label="Cursor"
          onClick={() => {
            setTool('cursor');
            setDraft(null);
          }}
        >
          <MousePointer2 size={15} />
        </ToolButton>
        <ToolButton active={tool === 'trend'} label="Trend line" onClick={() => setTool('trend')}>
          <TrendingUp size={15} />
        </ToolButton>
        <ToolButton
          active={tool === 'horizontal'}
          label="Horizontal line"
          onClick={() => setTool('horizontal')}
        >
          <Minus size={16} />
        </ToolButton>
        <ToolButton active={tool === 'measure'} label="Measure" onClick={() => setTool('measure')}>
          <Ruler size={15} />
        </ToolButton>
        <ToolButton active={tool === 'text'} label="Text note" onClick={() => setTool('text')}>
          <Type size={15} />
        </ToolButton>
        <Divider flexItem sx={styles.divider4} />
        <ToolButton
          label="Remove drawings"
          onClick={() => {
            setDrawings([]);
            setDraft(null);
          }}
        >
          <Trash2 size={15} />
        </ToolButton>
        <Box sx={styles.box5} />
        <ToolButton label="Crosshair" onClick={() => setTool('cursor')}>
          <Crosshair size={15} />
        </ToolButton>
      </Stack>
      <Box sx={styles.box6}>
        <Box sx={styles.box7}>
          {chartTimeframes.map((item) => (
            <Button
              key={item}
              aria-pressed={timeframe === item}
              color={timeframe === item ? 'primary' : 'inherit'}
              onClick={() => setTimeframe(item)}
              size="small"
              sx={styles.button8}
            >
              {item}
            </Button>
          ))}
          <Divider flexItem orientation="vertical" sx={styles.divider9} />
          <Button
            color="inherit"
            onClick={(event) => setSettingsAnchor(event.currentTarget)}
            size="small"
            startIcon={showMa || showBands ? <Eye size={14} /> : <EyeOff size={14} />}
          >
            Indicators
          </Button>
          <Box sx={styles.box10} />
          <Tooltip title="Zoom out">
            <span>
              <IconButton
                aria-label="Zoom out"
                disabled={zoom <= 1}
                onClick={() => setZoom((value) => Math.max(1, value - 0.35))}
                size="small"
              >
                <ZoomOut size={16} />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Zoom in">
            <span>
              <IconButton
                aria-label="Zoom in"
                disabled={zoom >= 3}
                onClick={() => setZoom((value) => Math.min(3, value + 0.35))}
                size="small"
              >
                <ZoomIn size={16} />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Reset chart">
            <IconButton aria-label="Reset chart" onClick={reset} size="small">
              <RotateCcw size={15} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Fullscreen">
            <IconButton aria-label="Fullscreen chart" onClick={() => void toggleFullscreen()} size="small">
              <Maximize2 size={15} />
            </IconButton>
          </Tooltip>
        </Box>
        <Menu
          anchorEl={settingsAnchor}
          open={Boolean(settingsAnchor)}
          onClose={() => setSettingsAnchor(null)}
        >
          <MenuItem onClick={() => setShowMa((value) => !value)}>
            {showMa ? <Eye size={15} /> : <EyeOff size={15} />}
            <Typography sx={styles.typography11}>MA 7 / MA 20</Typography>
          </MenuItem>
          <MenuItem onClick={() => setShowBands((value) => !value)}>
            {showBands ? <Eye size={15} /> : <EyeOff size={15} />}
            <Typography sx={styles.typography12}>Bollinger Bands</Typography>
          </MenuItem>
          <MenuItem onClick={() => setShowVolume((value) => !value)}>
            {showVolume ? <Eye size={15} /> : <EyeOff size={15} />}
            <Typography sx={styles.typography13}>Volume</Typography>
          </MenuItem>
        </Menu>
        <Box sx={styles.box14}>
          {hoveredCandle && (
            <Stack direction="row" spacing={1.25} sx={styles.stack15}>
              <Typography fontSize={10.5} color="text.secondary">
                O{' '}
                <Box component="span" color="text.primary">
                  {hoveredCandle.open.toFixed(2)}
                </Box>
              </Typography>
              <Typography fontSize={10.5} color="text.secondary">
                H{' '}
                <Box component="span" color="success.main">
                  {hoveredCandle.high.toFixed(2)}
                </Box>
              </Typography>
              <Typography fontSize={10.5} color="text.secondary">
                L{' '}
                <Box component="span" color="error.main">
                  {hoveredCandle.low.toFixed(2)}
                </Box>
              </Typography>
              <Typography fontSize={10.5} color="text.secondary">
                C{' '}
                <Box component="span" color="text.primary">
                  {hoveredCandle.close.toFixed(2)}
                </Box>
              </Typography>
            </Stack>
          )}
          <Box
            component="svg"
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            preserveAspectRatio="none"
            role="img"
            aria-label="Interactive BTC USDT candlestick chart"
            onPointerMove={(event) => setHover(eventPoint(event))}
            onPointerLeave={() => setHover(null)}
            onClick={handleClick}
            sx={styles.box16(tool)}
          >
            <defs>
              <linearGradient id="bandFill" x1="0" x2="0" y1="0" y2="1">
                <stop stopColor="#7c5cff" stopOpacity=".14" />
                <stop offset="1" stopColor="#7c5cff" stopOpacity=".02" />
              </linearGradient>
            </defs>
            {[0, 1, 2, 3, 4, 5].map((index) => {
              const gy = 18 + index * 58;
              const price = bounds.max - (index / 5) * (bounds.max - bounds.min);
              return (
                <g key={`h-${index}`}>
                  <line
                    x1={PLOT_LEFT}
                    x2={PLOT_RIGHT}
                    y1={gy}
                    y2={gy}
                    stroke="rgba(143,153,179,.14)"
                    strokeDasharray="2 3"
                  />
                  <text x="858" y={gy + 3} fill="#8f99b3" fontSize="10">
                    {price.toFixed(0)}
                  </text>
                </g>
              );
            })}
            {[0, 1, 2, 3, 4, 5, 6].map((index) => {
              const gx = PLOT_LEFT + (index / 6) * (PLOT_RIGHT - PLOT_LEFT);
              return (
                <line key={`v-${index}`} x1={gx} x2={gx} y1="12" y2="410" stroke="rgba(143,153,179,.09)" />
              );
            })}
            {showBands && (
              <>
                <path
                  d={`${linePath(upperBand, x, y)} ${linePath([...lowerBand].reverse(), (index) => x(lowerBand.length - index - 1), y).replace('M', 'L')} Z`}
                  fill="url(#bandFill)"
                />
                <path d={linePath(upperBand, x, y)} fill="none" stroke="#7c5cff" strokeOpacity=".55" />
                <path d={linePath(lowerBand, x, y)} fill="none" stroke="#7c5cff" strokeOpacity=".55" />
              </>
            )}
            {visible.map((candle, index) => {
              const cx = x(index);
              const up = candle.close >= candle.open;
              const color = up ? '#28d7a2' : '#ff4d78';
              const top = y(Math.max(candle.open, candle.close));
              const bottom = y(Math.min(candle.open, candle.close));
              return (
                <g key={candle.time}>
                  <line
                    x1={cx}
                    x2={cx}
                    y1={y(candle.high)}
                    y2={y(candle.low)}
                    stroke={color}
                    strokeWidth="1.2"
                  />
                  <rect
                    x={cx - candleWidth / 2}
                    y={top}
                    width={candleWidth}
                    height={Math.max(1.8, bottom - top)}
                    fill={color}
                    rx=".7"
                  />
                </g>
              );
            })}
            {showMa && (
              <>
                <path d={linePath(ma7, x, y)} fill="none" stroke="#ffb648" strokeWidth="1.25" />
                <path d={linePath(ma20, x, y)} fill="none" stroke="#3b82f6" strokeWidth="1.25" />
              </>
            )}
            {showVolume &&
              visible.map((candle, index) => {
                const barHeight = Math.min(57, candle.volume / 3);
                return (
                  <rect
                    key={`volume-${candle.time}`}
                    x={x(index) - candleWidth / 2}
                    y={405 - barHeight}
                    width={candleWidth}
                    height={barHeight}
                    fill={candle.close >= candle.open ? '#28d7a2' : '#ff4d78'}
                    opacity=".24"
                  />
                );
              })}
            <line x1={PLOT_LEFT} x2={PLOT_RIGHT} y1="342" y2="342" stroke="rgba(143,153,179,.16)" />
            {drawings.map((drawing) => (
              <g key={drawing.id}>
                {drawing.tool === 'text' ? (
                  <>
                    <circle cx={drawing.end.x} cy={drawing.end.y} r="3" fill="#ffb648" />
                    <text x={drawing.end.x + 6} y={drawing.end.y - 5} fill="#ffb648" fontSize="11">
                      Note
                    </text>
                  </>
                ) : (
                  <>
                    <line
                      x1={drawing.start.x}
                      y1={drawing.start.y}
                      x2={drawing.end.x}
                      y2={drawing.end.y}
                      stroke={drawing.tool === 'measure' ? '#ffb648' : '#39a0ff'}
                      strokeWidth="1.5"
                      strokeDasharray={drawing.tool === 'measure' ? '5 4' : undefined}
                    />
                    <circle cx={drawing.start.x} cy={drawing.start.y} r="2.5" fill="#39a0ff" />
                    <circle cx={drawing.end.x} cy={drawing.end.y} r="2.5" fill="#39a0ff" />
                    {drawing.tool === 'measure' && (
                      <text
                        x={(drawing.start.x + drawing.end.x) / 2}
                        y={(drawing.start.y + drawing.end.y) / 2 - 7}
                        fill="#ffb648"
                        fontSize="10"
                      >
                        {Math.abs(drawing.end.y - drawing.start.y).toFixed(0)} px
                      </text>
                    )}
                  </>
                )}
              </g>
            ))}
            {draft && hover && (
              <line
                x1={draft.x}
                y1={draft.y}
                x2={hover.x}
                y2={hover.y}
                stroke="#39a0ff"
                strokeDasharray="4 3"
              />
            )}
            {hover && (
              <g pointerEvents="none">
                <line
                  x1={PLOT_LEFT}
                  x2={PLOT_RIGHT}
                  y1={hover.y}
                  y2={hover.y}
                  stroke="rgba(183,192,216,.48)"
                  strokeDasharray="3 3"
                />
                <line
                  x1={hover.x}
                  x2={hover.x}
                  y1="12"
                  y2="410"
                  stroke="rgba(183,192,216,.48)"
                  strokeDasharray="3 3"
                />
                <rect x="851" y={hover.y - 10} width="67" height="20" rx="3" fill="#273044" />
                <text x="884" y={hover.y + 4} textAnchor="middle" fill="#fff" fontSize="10">
                  {(bounds.max - ((hover.y - 12) / (PRICE_HEIGHT - 24)) * (bounds.max - bounds.min)).toFixed(
                    1
                  )}
                </text>
              </g>
            )}
            <g transform="translate(18 355)">
              <text fill="#8f99b3" fontSize="10">
                VOL
              </text>
              {showMa && (
                <>
                  <circle cx="42" cy="-3" r="3" fill="#ffb648" />
                  <text x="49" fill="#8f99b3" fontSize="10">
                    MA7
                  </text>
                  <circle cx="82" cy="-3" r="3" fill="#3b82f6" />
                  <text x="89" fill="#8f99b3" fontSize="10">
                    MA20
                  </text>
                </>
              )}
            </g>
          </Box>
          {tool !== 'cursor' && (
            <Box sx={styles.box17}>
              {draft
                ? 'Select the end point'
                : tool === 'horizontal'
                  ? 'Click to place line'
                  : 'Select the start point'}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
