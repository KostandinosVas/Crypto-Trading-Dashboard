'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { CoinList } from '@/components/CoinList';
import { CandlestickChart } from '@/components/CandlestickChart';
import { IntervalSelector } from '@/components/IntervalSelector';
import { useHistoricalData } from '@/hooks/useHistoricalData';
import { usePriceStream } from '@/hooks/usePriceStream';
import styles from './page.module.css';

export default function Home() {
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
  const [interval, setInterval] = useState('1h');
  const { data, isLoading, error } = useHistoricalData(selectedSymbol, interval);
  const { changePercent } = usePriceStream(selectedSymbol);
  const isUp = (changePercent ?? 0) >= 0;

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <Header />
        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <CoinList selectedSymbol={selectedSymbol} onSelect={setSelectedSymbol} />
          </aside>
          <section className={styles.chartSection}>
            <div className={styles.chartHeader}>
              <h2>{selectedSymbol}</h2>
              <IntervalSelector selected={interval} onSelect={setInterval} />
            </div>
            {isLoading && <div>Loading...</div>}
            {error && <div>Error loading chart</div>}
            {data && <CandlestickChart data={data} isUp={isUp} />}
          </section>
        </div>
      </div>
    </main>
  );
}