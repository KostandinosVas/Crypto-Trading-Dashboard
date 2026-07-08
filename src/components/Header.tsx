'use client';

import { usePriceStore } from '@/store/usePriceStore';
import styles from './Header.module.css';

export function Header() {
  const isConnected = usePriceStore((state) => state.isConnected);

  return (
    <header className={styles.header}>
      <span className={styles.wordmark}>CRYPTO/</span>
      <span className={isConnected ? styles.live : styles.offline}>
        <span className={styles.dot} />
        {isConnected ? 'live' : 'connecting'}
      </span>
    </header>
  );
}