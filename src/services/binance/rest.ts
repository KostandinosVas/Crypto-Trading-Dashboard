import type { BinanceKlineRaw, Candle, Ticker } from '@/lib/types';

const BINANCE_REST_BASE_URL = 'https://api.binance.com/api/v3';

export async function fetchKlines(symbol:string, interval:string): Promise<Candle[]> {
    
  const url = `${BINANCE_REST_BASE_URL}/klines?symbol=${symbol}&interval=${interval}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Binance API error: ${res.status}`);
  }

  const rawKlines: BinanceKlineRaw[] = await res.json();

  return rawKlines.map(mapRawKlineToCandle);
}


interface BinanceTicker24hrRaw {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
  quoteVolume: string;
}

export async function fetchTopTickers(limit: number = 100): Promise<Ticker[]> {
  const res = await fetch(`${BINANCE_REST_BASE_URL}/ticker/24hr`);

  if (!res.ok) {
    throw new Error(`Binance API error: ${res.status}`);
  }

  const raw: BinanceTicker24hrRaw[] = await res.json();

  return raw
    .filter((t) => t.symbol.endsWith('USDT'))
    .map((t) => ({
      symbol: t.symbol,
      lastPrice: Number(t.lastPrice),
      priceChangePercent: Number(t.priceChangePercent),
      quoteVolume: Number(t.quoteVolume),
    }))
    .sort((a, b) => b.quoteVolume - a.quoteVolume)
    .slice(0, limit);
}

  export async function fetchSingleTicker(symbol: string): Promise<Ticker> {
    const res = await fetch(`${BINANCE_REST_BASE_URL}/ticker/24hr?symbol=${symbol}`);

    if (!res.ok) {
      throw new Error(`Binance API error: ${res.status}`);
    }

    const raw: BinanceTicker24hrRaw = await res.json();

    return {
      symbol: raw.symbol,
      lastPrice: Number(raw.lastPrice),
      priceChangePercent: Number(raw.priceChangePercent),
      quoteVolume: Number(raw.quoteVolume),
    };
  }

export function mapRawKlineToCandle(raw: BinanceKlineRaw): Candle {
  const [openTime, open, high, low, close, volume, closeTime] = raw;

  return {
    openTime,
    open: Number(open),
    high: Number(high),
    low: Number(low),
    close: Number(close),
    volume: Number(volume),
    closeTime,
  };
}



