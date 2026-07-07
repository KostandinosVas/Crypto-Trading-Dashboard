'use client';

import { CoinChart } from '@/components/CoinChart';
import styles from './page.module.css';

const COINS = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'XRPUSDT'];

export default function Home() {
  return (
    <main className={styles.grid}>
      {COINS.map((symbol) => (
        <CoinChart key={symbol} symbol={symbol} interval="1h" />
      ))}
    </main>
  );
}


