'use client';

import { useTopTickers } from '@/hooks/useTopTickers';
import { getMarketSummary } from '@/lib/marketStats';
import styles from './MarketStats.module.css';

export function MarketStats() {
  const { data } = useTopTickers(100);

  if (!data) return null;

  const summary = getMarketSummary(data);

  return (
    <div className={styles.strip}>
      <span className={styles.item}>
        <span className={styles.label}>Tracking</span>
        <span className={styles.value}>{summary.total} coins</span>
      </span>

      <span className={styles.item}>
        <span className={styles.label}>Green / Red</span>
        <span className={styles.value}>
          <span className={styles.up}>{summary.greenCount}</span>
          {' / '}
          <span className={styles.down}>{summary.redCount}</span>
        </span>
      </span>

      {summary.topGainer && (
        <span className={styles.item}>
          <span className={styles.label}>Top gainer</span>
          <span className={`${styles.value} ${styles.up}`}>
            {summary.topGainer.symbol} +{summary.topGainer.priceChangePercent.toFixed(2)}%
          </span>
        </span>
      )}

      {summary.topLoser && (
        <span className={styles.item}>
          <span className={styles.label}>Top loser</span>
          <span className={`${styles.value} ${styles.down}`}>
            {summary.topLoser.symbol} {summary.topLoser.priceChangePercent.toFixed(2)}%
          </span>
        </span>
      )}
    </div>
  );
}