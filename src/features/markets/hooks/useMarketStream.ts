import { useEffect, useRef, useState } from 'react';

interface PriceTick {
  symbol: string;
  price: number;
  change24h: number;
  timestamp: number;
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
          setTick(JSON.parse(event.data) as PriceTick);
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
