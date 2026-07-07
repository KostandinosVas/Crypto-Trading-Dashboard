import { useQuery } from '@tanstack/react-query';
import { fetchKlines } from '@/services/binance/rest';

export function useHistoricalData(symbol: string, interval: string) {
  return useQuery({
    queryKey: ['klines', symbol, interval],
    queryFn: () => fetchKlines(symbol, interval),
  });
}