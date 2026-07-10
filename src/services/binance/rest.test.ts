import { describe, it, expect } from 'vitest';
import { mapRawKlineToCandle } from './rest';
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