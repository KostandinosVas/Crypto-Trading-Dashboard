'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { CoinList } from '@/components/CoinList';
import { CandlestickChart } from '@/components/CandlestickChart';
import { useHistoricalData } from '@/hooks/useHistoricalData';
import styles from './page.module.css';

const INTERVAL = '1h';

export default function Home() {
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
  const { data, isLoading, error } = useHistoricalData(selectedSymbol, INTERVAL);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <Header />
        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <CoinList selectedSymbol={selectedSymbol} onSelect={setSelectedSymbol} />
          </aside>
          <section className={styles.chartSection}>
            <h2>{selectedSymbol}</h2>
            {isLoading && <div>Loading...</div>}
            {error && <div>Error loading chart</div>}
            {data && <CandlestickChart data={data} />}
          </section>
        </div>
      </div>
    </main>
  );
}