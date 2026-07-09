import { fetchSingleTicker, fetchTopTickers } from '@/services/binance/rest';

export async function executeGetPrice(args: { symbol: string }) {
  const ticker = await fetchSingleTicker(args.symbol.toUpperCase());
  return {
    symbol: ticker.symbol,
    price: ticker.lastPrice,
    changePercent: ticker.priceChangePercent,
  };
}

interface TopMoversArgs {
  direction: 'gainers' | 'losers';
  limit?: number;
}

export async function executeGetTopMovers(args: TopMoversArgs) {
  const tickers = await fetchTopTickers(100);

  const sorted = [...tickers].sort((a, b) =>
    args.direction === 'gainers'
      ? b.priceChangePercent - a.priceChangePercent
      : a.priceChangePercent - b.priceChangePercent
  );

  return sorted.slice(0, args.limit ?? 3).map((t) => ({
    symbol: t.symbol,
    changePercent: t.priceChangePercent,
  }));
}



/*
executeGetPrice → καλεί το νέο fetchSingleTicker, επιστρέφει μόνο τα πεδία που χρειάζεται το LLM 
(όχι ολόκληρο το raw response — λιγότερα tokens, καθαρότερο context)

executeGetTopMovers → ξαναχρησιμοποιεί το ήδη υπάρχον fetchTopTickers (sorted by volume), 
και ξανά-ταξινομεί by priceChangePercent — δεν χρειάζεται νέο API call, απλά διαφορετικό sort πάνω στα ίδια δεδομένα

Και οι δύο επιστρέφουν plain objects (όχι React state, όχι JSX) — αυτό είναι 
το "αποτέλεσμα" που θα στείλουμε πίσω στο Gemini για να διατυπώσει την τελική απάντηση
*/