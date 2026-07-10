import { describe, it, expect, vi, afterEach } from 'vitest';
import { mapRawKlineToCandle, fetchTopTickers } from './rest';
import type { BinanceKlineRaw } from '@/lib/types';

describe('mapRawKlineToCandle', () => {
  it('converts raw Binance kline array into a clean Candle object', () => {
    const raw: BinanceKlineRaw = [
      1625097600000,
      '35000.50',
      '35500.00',
      '34800.25',
      '35200.75',
      '1234.5678',
      1625101199999,
      '43500000.00',
      1500,
      '600.1234',
      '21000000.00',
      '0',
    ];

    const result = mapRawKlineToCandle(raw);

    expect(result).toEqual({
      openTime: 1625097600000,
      open: 35000.5,
      high: 35500.0,
      low: 34800.25,
      close: 35200.75,
      volume: 1234.5678,
      closeTime: 1625101199999,
    });
  });
});








describe('fetchTopTickers', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('filters to USDT pairs, sorts by volume desc, and respects the limit', async () => {
    const mockRawTickers = [
      { symbol: 'BTCUSDT', lastPrice: '62000.00', priceChangePercent: '-2.50', quoteVolume: '500000000' },
      { symbol: 'ETHBTC', lastPrice: '0.028', priceChangePercent: '1.20', quoteVolume: '999999999' },
      { symbol: 'SOLUSDT', lastPrice: '77.00', priceChangePercent: '3.10', quoteVolume: '100000000' },
      { symbol: 'ETHUSDT', lastPrice: '1700.00', priceChangePercent: '-1.10', quoteVolume: '800000000' },
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockRawTickers),
    }) as unknown as typeof fetch;

    const result = await fetchTopTickers(2);

    expect(result).toEqual([
      { symbol: 'ETHUSDT', lastPrice: 1700, priceChangePercent: -1.1, quoteVolume: 800000000 },
      { symbol: 'BTCUSDT', lastPrice: 62000, priceChangePercent: -2.5, quoteVolume: 500000000 },
    ]);
  });
});