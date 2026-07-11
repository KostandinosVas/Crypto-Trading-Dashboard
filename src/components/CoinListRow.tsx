import { usePriceStream } from '@/hooks/usePriceStream';
import { getCoinIconUrl, FALLBACK_ICON } from '@/lib/coinIcon';
import type { Ticker } from '@/lib/types';
import styles from './CoinListRow.module.css';

interface CoinListRowProps {
  ticker: Ticker;
  isSelected: boolean;
  onSelect: (symbol: string) => void;
}

export function CoinListRow({ ticker, isSelected, onSelect }: CoinListRowProps) {
  const { price, changePercent } = usePriceStream(ticker.symbol);

  const displayPrice = price ?? ticker.lastPrice;
  const displayChange = changePercent ?? ticker.priceChangePercent;
  const isUp = displayChange >= 0;

  return (
    <button
      className={`${styles.row} ${isSelected ? styles.selected : ''}`}
      onClick={() => onSelect(ticker.symbol)}
    >
      <span className={styles.symbolGroup}>
        <img
          src={getCoinIconUrl(ticker.symbol)}
          alt=""
          className={styles.icon}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = FALLBACK_ICON;
          }}
        />
        <span className={styles.symbol}>{ticker.symbol}</span>
      </span>
      <span className={styles.price}>{displayPrice.toFixed(displayPrice < 10 ? 4 : 2)}</span>
      <span className={isUp ? styles.up : styles.down}>
        {isUp ? '+' : ''}{displayChange.toFixed(2)}%
      </span>
    </button>
  );
}