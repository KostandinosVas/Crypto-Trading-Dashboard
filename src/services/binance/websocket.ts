import { usePriceStore } from '@/store/usePriceStore';

const WS_URL = 'wss://stream.binance.com:9443/ws/!miniTicker@arr';

interface BinanceMiniTickerRaw {
  s: string;
  c: string;
  o: string;
}


class BinanceWebSocketManager {
  private static instance: BinanceWebSocketManager | null = null;
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

  private constructor() {
    this.connect();
  }

  static getInstance(): BinanceWebSocketManager {
    if (!BinanceWebSocketManager.instance) {
      BinanceWebSocketManager.instance = new BinanceWebSocketManager();
    }
    return BinanceWebSocketManager.instance;
  }

  private connect() {
    const socket = new WebSocket(WS_URL);
    this.ws = socket;

    socket.onopen = () => {
      this.reconnectAttempts = 0;
      usePriceStore.getState().setConnected(true);
    };

    socket.onmessage = (event) => {
      const tickers: BinanceMiniTickerRaw[] = JSON.parse(event.data);
      for (const ticker of tickers) {
        if (!ticker.s.endsWith('USDT')) continue;
        usePriceStore.getState().setPrice(ticker.s, Number(ticker.c), Number(ticker.o));
      }
    };

    socket.onerror = () => {
      socket.close();
    };

    socket.onclose = () => {
      usePriceStore.getState().setConnected(false);
      this.scheduleReconnect();
    };
  }

  private scheduleReconnect() {
    const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 30_000);
    this.reconnectAttempts++;

    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, delay);
  }
}


let singleton: BinanceWebSocketManager | null = null;

export function initBinanceWebSocket() {
  if (typeof window === 'undefined') return;
  if (!singleton) {
    singleton = BinanceWebSocketManager.getInstance();
  }
}