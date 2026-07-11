'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { CoinList } from '@/components/CoinList';
import { CandlestickChart } from '@/components/CandlestickChart';
import { IntervalSelector } from '@/components/IntervalSelector';
import { useHistoricalData } from '@/hooks/useHistoricalData';
import { usePriceStream } from '@/hooks/usePriceStream';
import { ChatWidget } from '@/components/ChatWidget';
import { getCoinIconUrl, FALLBACK_ICON } from '@/lib/coinIcon';
import { MarketStats } from '@/components/MarketStats';
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
        <MarketStats />
        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <CoinList selectedSymbol={selectedSymbol} onSelect={setSelectedSymbol} />
          </aside>
          <section className={styles.chartSection}>
            <div className={styles.chartHeader}>
              <div className={styles.chartTitle}>
              <img
                src={getCoinIconUrl(selectedSymbol)}
                alt=""
                className={styles.chartIcon}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = FALLBACK_ICON;
                }}
              />
              <h2>{selectedSymbol}</h2>
            </div>
              <IntervalSelector selected={interval} onSelect={setInterval} />
            </div>
            {isLoading && <div>Loading...</div>}
            {error && <div>Error loading chart</div>}
            {data && <CandlestickChart data={data} isUp={isUp} />}
            <div className={styles.chatSection}>
              <ChatWidget />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}