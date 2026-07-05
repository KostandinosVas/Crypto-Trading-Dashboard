'use client';

import { useQuery } from '@tanstack/react-query';

export default function Home() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['sanity-check'],
    queryFn: async () => {
      const res = await fetch('https://api.binance.com/api/v3/ping');
      return res.json();
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {String(error)}</div>;

  return <div>Binance ping response: {JSON.stringify(data)}</div>;
}