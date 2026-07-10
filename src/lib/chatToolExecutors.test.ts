import { describe, it, expect, vi } from 'vitest';
import { executeGetTopMovers } from './chatToolExecutors';
import { fetchTopTickers } from '@/services/binance/rest';

vi.mock('@/services/binance/rest', () => ({
  fetchTopTickers: vi.fn(),
}));

describe('executeGetTopMovers', () => {
  it('returns top gainers sorted by highest change percent', async () => {
    vi.mocked(fetchTopTickers).mockResolvedValue([
      { symbol: 'BTCUSDT', lastPrice: 62000, priceChangePercent: -2.5, quoteVolume: 500000000 },
      { symbol: 'ETHUSDT', lastPrice: 1700, priceChangePercent: 7.1, quoteVolume: 800000000 },
      { symbol: 'SOLUSDT', lastPrice: 77, priceChangePercent: 3.1, quoteVolume: 100000000 },
    ]);

    const result = await executeGetTopMovers({ direction: 'gainers', limit: 2 });

    expect(result).toEqual([
      { symbol: 'ETHUSDT', changePercent: 7.1 },
      { symbol: 'SOLUSDT', changePercent: 3.1 },
    ]);
  });

  it('defaults to limit 3 and sorts ascending when direction is losers', async () => {
    vi.mocked(fetchTopTickers).mockResolvedValue([
      { symbol: 'BTCUSDT', lastPrice: 62000, priceChangePercent: -2.5, quoteVolume: 500000000 },
      { symbol: 'ETHUSDT', lastPrice: 1700, priceChangePercent: 7.1, quoteVolume: 800000000 },
      { symbol: 'SOLUSDT', lastPrice: 77, priceChangePercent: -6.9, quoteVolume: 100000000 },
    ]);

    const result = await executeGetTopMovers({ direction: 'losers' });

    expect(result).toEqual([
      { symbol: 'SOLUSDT', changePercent: -6.9 },
      { symbol: 'BTCUSDT', changePercent: -2.5 },
      { symbol: 'ETHUSDT', changePercent: 7.1 },
    ]);
  });
});