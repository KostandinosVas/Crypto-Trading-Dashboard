'use client';

import { useState } from 'react';
import { useTopTickers } from '@/hooks/useTopTickers';
import { CoinListRow } from '@/components/CoinListRow';
import styles from './CoinList.module.css';

interface CoinListProps {
  selectedSymbol: string;
  onSelect: (symbol: string) => void;
}

export function CoinList({ selectedSymbol, onSelect }: CoinListProps) {
  const { data, isLoading, error } = useTopTickers(100);
  const [search, setSearch] = useState('');

  if (isLoading) return <div className={styles.status}>Loading...</div>;
  if (error) return <div className={styles.status}>Error</div>;

  const filtered = data?.filter((ticker) =>
    ticker.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.wrapper}>
      <input
        className={styles.search}
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className={styles.list}>
        {filtered?.map((ticker) => (
          <CoinListRow
            key={ticker.symbol}
            ticker={ticker}
            isSelected={ticker.symbol === selectedSymbol}
            onSelect={onSelect}
          />
        ))}
        {filtered?.length === 0 && <div className={styles.status}>No results</div>}
      </div>
    </div>
  );
}