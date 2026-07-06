import type { BinanceKlineRaw, Candle } from '@/lib/types';

const BINANCE_REST_BASE_URL = 'https://api.binance.com/api/v3';

export async function fetchKlines(symbol: string,interval: string): Promise<Candle[]> {
  const url = `${BINANCE_REST_BASE_URL}/klines?symbol=${symbol}&interval=${interval}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Binance API error: ${res.status}`);
  }

  const rawKlines: BinanceKlineRaw[] = await res.json();

  return rawKlines.map(mapRawKlineToCandle);
}

function mapRawKlineToCandle(raw: BinanceKlineRaw): Candle {
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