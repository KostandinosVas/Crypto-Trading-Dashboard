'use client';

import { useHistoricalData } from '@/hooks/useHistoricalData';
import { CandlestickChart } from '@/components/CandlestickChart';

export function CoinChart({ symbol, interval }: { symbol: string; interval: string }) {
  const { data, isLoading, error } = useHistoricalData(symbol, interval);

  if (isLoading) return <div>{symbol}: Loading...</div>;
  if (error) return <div>{symbol}: Error</div>;

  return (
    <div>
      <h2>{symbol}</h2>
      {data && <CandlestickChart data={data} />}
    </div>
  );
}