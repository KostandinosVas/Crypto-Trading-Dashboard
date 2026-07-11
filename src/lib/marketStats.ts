import type { Ticker } from '@/lib/types';

export function getTopMover(tickers: Ticker[], direction: 'gainers' | 'losers'): Ticker | null {
  if (tickers.length === 0) return null;

  return [...tickers].sort((a, b) =>
    direction === 'gainers'
      ? b.priceChangePercent - a.priceChangePercent
      : a.priceChangePercent - b.priceChangePercent
  )[0];
}

export function getMarketSummary(tickers: Ticker[]) {
  const greenCount = tickers.filter((t) => t.priceChangePercent >= 0).length;

  return {
    total: tickers.length,
    greenCount,
    redCount: tickers.length - greenCount,
    topGainer: getTopMover(tickers, 'gainers'),
    topLoser: getTopMover(tickers, 'losers'),
  };
}