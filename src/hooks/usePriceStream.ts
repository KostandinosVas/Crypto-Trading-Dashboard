import { useEffect } from 'react';
import { usePriceStore } from '@/store/usePriceStore';
import { initBinanceWebSocket } from '@/services/binance/websocket';

export function usePriceStream(symbol: string) {
  useEffect(() => {
    initBinanceWebSocket();
  }, []);

  const tick = usePriceStore((state) => state.prices[symbol]);
  const isConnected = usePriceStore((state) => state.isConnected);

  const price = tick?.price;
  const changePercent = tick
    ? ((tick.price - tick.openPrice) / tick.openPrice) * 100
    : undefined;

  return { price, changePercent, isConnected };
}