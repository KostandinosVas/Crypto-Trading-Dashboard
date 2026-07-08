'use client';

import { useTopTickers } from '@/hooks/useTopTickers';
import { CoinListRow } from '@/components/CoinListRow';
import styles from './CoinList.module.css';

interface CoinListProps {
  selectedSymbol: string;
  onSelect: (symbol: string) => void;
}

export function CoinList({ selectedSymbol, onSelect }: CoinListProps) {
  const { data, isLoading, error } = useTopTickers(100);

  if (isLoading) return <div className={styles.status}>Loading...</div>;
  if (error) return <div className={styles.status}>Error</div>;

  return (
    <div className={styles.list}>
      {data?.map((ticker) => (
        <CoinListRow
          key={ticker.symbol}
          ticker={ticker}
          isSelected={ticker.symbol === selectedSymbol}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}