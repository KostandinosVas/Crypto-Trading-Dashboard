import { useQuery } from '@tanstack/react-query';
import { fetchTopTickers } from '@/services/binance/rest';

export function useTopTickers(limit: number = 100) {
  return useQuery({
    queryKey: ['top-tickers', limit],
    queryFn: () => fetchTopTickers(limit),
  });
}