import { useEffect, useRef, useState } from 'react';

interface PriceTick {
  symbol: string;
  price: number;
  change24h: number;
  timestamp: number;
}

function parseTick(value: unknown, expectedSymbol: string): PriceTick | null {
  if (typeof value !== 'object' || value === null) return null;

  const tick = value as Record<string, unknown>;

  if (
    tick.symbol !== expectedSymbol ||
    typeof tick.price !== 'number' ||
    !Number.isFinite(tick.price) ||
    tick.price <= 0 ||
    typeof tick.change24h !== 'number' ||
    !Number.isFinite(tick.change24h) ||
    typeof tick.timestamp !== 'number' ||
    !Number.isFinite(tick.timestamp)
  ) {
    return null;
  }

  return tick as unknown as PriceTick;
}
export const useMarketStream = (symbol: string) => {
  const [tick, setTick] = useState<PriceTick | null>(null);
  const retryRef = useRef(0);
  useEffect(() => {
    let socket: WebSocket | null = null;
    let reconnectTimer: number | undefined;
    let cancelled = false;
    const connect = () => {
      const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
      socket = new WebSocket(`${protocol}://${window.location.host}/ws?symbol=${encodeURIComponent(symbol)}`);
      socket.onopen = () => {
        retryRef.current = 0;
      };
      socket.onmessage = (event) => {
        try {
          const nextTick = parseTick(JSON.parse(event.data) as unknown, symbol);

          if (nextTick)
            setTick((current) => (!current || nextTick.timestamp > current.timestamp ? nextTick : current));
        } catch {
          /* Ignore malformed ticks at the network boundary. */
        }
      };
      socket.onclose = () => {
        if (!cancelled) {
          const delay = Math.min(1000 * 2 ** retryRef.current, 15_000);
          retryRef.current += 1;
          reconnectTimer = window.setTimeout(connect, delay);
        }
      };
    };
    connect();
    return () => {
      cancelled = true;
      if (reconnectTimer) window.clearTimeout(reconnectTimer);
      socket?.close();
    };
  }, [symbol]);
  return tick;
};
