'use client';

import { useHistoricalData } from '@/hooks/useHistoricalData';
import { CandlestickChart } from '@/components/CandlestickChart';

export default function Home() {
  const { data, isLoading, error } = useHistoricalData('BTCUSDT', '1h');

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {String(error)}</div>;

  return (
    <main>
      <h1>BTC/USDT — 1h</h1>
      {data && <CandlestickChart data={data} />}
    </main>
  );
}


/*
useHistoricalData('BTCUSDT', '1h') → καλεί το facade hook που φτιάξαμε, με το hardcoded pair/interval που συμφωνήσαμε
{data && <CandlestickChart data={data} />} → δείχνει το chart μόνο όταν τα data έχουν φτάσει 
(αποφεύγει να περάσουμε undefined στο component πριν ολοκληρωθεί το fetch)

Key takeaways

page.tsx = composition layer, όχι λογική
Κάθε layer (services → hooks → components) κάνει ένα πράγμα και το κάνει καλά
Αν αύριο αλλάξει το πώς φέρνουμε data, το page.tsx δεν αγγίζεται καθόλου
*/