'use client';

import styles from './IntervalSelector.module.css';

const INTERVALS = ['1h', '4h', '1d'] as const;

interface IntervalSelectorProps {
  selected: string;
  onSelect: (interval: string) => void;
}

export function IntervalSelector({ selected, onSelect }: IntervalSelectorProps) {
  return (
    <div className={styles.group}>
      {INTERVALS.map((interval) => (
        <button
          key={interval}
          className={`${styles.button} ${selected === interval ? styles.active : ''}`}
          onClick={() => onSelect(interval)}
        >
          {interval}
        </button>
      ))}
    </div>
  );
}