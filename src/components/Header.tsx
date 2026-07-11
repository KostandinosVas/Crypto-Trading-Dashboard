'use client';

import { TrendingUp, ExternalLink } from 'lucide-react';
import { usePriceStore } from '@/store/usePriceStore';
import styles from './Header.module.css';

export function Header() {
  const isConnected = usePriceStore((state) => state.isConnected);

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <div className={styles.logoMark}>
          <TrendingUp size={16} strokeWidth={2.5} />
        </div>
        <span className={styles.wordmark}>CRYPTO/</span>
      </div>

      <div className={styles.right}>
        
         <a href="https://github.com/KostandinosVas/Crypto-Trading-Dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.repoLink}
        >
          <span>GitHub</span>
          <ExternalLink size={14} />
        </a>

        <span className={isConnected ? styles.live : styles.offline}>
          <span className={styles.dot} />
          {isConnected ? 'live' : 'connecting'}
        </span>
      </div>
    </header>
  );
}