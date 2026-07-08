'use client';

import { useHistoricalData } from '@/hooks/useHistoricalData';
import { usePriceStream } from '@/hooks/usePriceStream';
import { CandlestickChart } from '@/components/CandlestickChart';
import styles from './CoinChart.module.css';

export function CoinChart({ symbol, interval }: { symbol: string; interval: string }) {
  const { data, isLoading, error } = useHistoricalData(symbol, interval);
  const { price, isConnected } = usePriceStream(symbol);

  if (isLoading) return <div>{symbol}: Loading...</div>;
  if (error) return <div>{symbol}: Error</div>;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2>{symbol}</h2>
        <span className={styles.price}>
          {price ? price.toFixed(2) : '—'}
          <span className={isConnected ? styles.live : styles.offline}>
            {isConnected ? '● live' : '○ connecting'}
          </span>
        </span>
      </div>
      {data && <CandlestickChart data={data} />}
    </div>
  );
}


/*
 Τα δύο σημεία που αξίζει να δεις:

{price ? price.toFixed(2) : '—'} → το price θα είναι undefined για μια στιγμή, 
μέχρι να φτάσει το πρώτο μήνυμα από το WebSocket (το subscribe() στέλνει request, 
αλλά η απάντηση δεν είναι instant). Το '—' είναι απλά ένα καθαρό fallback ώστε να μη δεις undefined γραμμένο στην οθόνη.

isConnected ? '● live' : '○ connecting' → μικρό UX detail, αλλά σημαντικό: δίνει στον χρήστη οπτική επιβεβαίωση 
ότι το socket πραγματικά συνδέθηκε, αντί να αναρωτιέται αν κάτι έχει κολλήσει.
 */