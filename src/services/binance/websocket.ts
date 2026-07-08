import { usePriceStore } from '@/store/usePriceStore';

const WS_BASE_URL = 'wss://stream.binance.com:9443/stream';

class BinanceWebSocketManager {
  private static instance: BinanceWebSocketManager | null = null;
  private ws: WebSocket | null = null;
  private subscribedSymbols = new Set<string>();

  private constructor() {}

  static getInstance(): BinanceWebSocketManager {
    if (!BinanceWebSocketManager.instance) {
      BinanceWebSocketManager.instance = new BinanceWebSocketManager();
    }
    return BinanceWebSocketManager.instance;
  }

  subscribe(symbol: string) {
    this.subscribedSymbols.add(symbol.toLowerCase());
    this.connect();
  }

  unsubscribe(symbol: string) {
    this.subscribedSymbols.delete(symbol.toLowerCase());
    this.connect();
  }

  private connect() {
    this.ws?.close();

    const streams = Array.from(this.subscribedSymbols)
      .map((s) => `${s}@miniTicker`)
      .join('/');

    if (!streams) return;

    this.ws = new WebSocket(`${WS_BASE_URL}?streams=${streams}`);

    this.ws.onopen = () => {
      usePriceStore.getState().setConnected(true);
    };

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const ticker = message.data;
      usePriceStore.getState().setPrice(ticker.s, Number(ticker.c));
    };

    this.ws.onclose = () => {
      usePriceStore.getState().setConnected(false);
    };
  }
}

export const binanceWS = BinanceWebSocketManager.getInstance();

/*
 Εξήγηση γραμμή-γραμμή:

private static instance + private constructor() + static getInstance() → αυτό είναι ακριβώς το Singleton pattern που περιέγραψα πριν. 
Το private constructor() σημαίνει ότι κανείς δεν μπορεί να γράψει new BinanceWebSocketManager() απ' έξω — το μόνο σημείο δημιουργίας
 είναι μέσα στο getInstance().

export const binanceWS = BinanceWebSocketManager.getInstance() → αυτή η γραμμή τρέχει μία φορά, 
όταν το module πρωτο-φορτώνεται. Από εκεί και πέρα, κάθε αρχείο που κάνει import { binanceWS } παίρνει την ίδια instance.

subscribedSymbols = new Set<string>() → Set αντί για array, γιατί δεν θέλουμε duplicate symbols 
(αν 2 components κάνουν subscribe στο ίδιο BTC, το Set αγνοεί το δεύτερο automatically).

usePriceStore.getState().setPrice(...) → πρόσεξε εδώ, δεν χρησιμοποιούμε το hook usePriceStore(...) (αυτό είναι μόνο για μέσα σε React components).
 Το getState() είναι το πώς διαβάζεις/γράφεις στο store από κώδικα εκτός React — ακριβώς η περίπτωσή μας, αφού το services/ δεν ξέρει τίποτα για React.

ticker.c → στο miniTicker payload του Binance, το c είναι το current/close price. Το ticker.s είναι το symbol (π.χ. "BTCUSDT").

Ένα honest tradeoff που αξίζει να ξέρεις: Κάθε φορά που καλείται subscribe()/unsubscribe(), 
κλείνουμε και ξανανοίγουμε ολόκληρο το socket για να ενημερώσουμε τη λίστα streams.
 Είναι απλό και δουλεύει καλά για 4 σταθερά coins όπως τα δικά μας, αλλά αν αργότερα θες πιο δυναμικό add/remove χωρίς διακοπή, 
 το Binance υποστηρίζει JSON SUBSCRIBE/UNSUBSCRIBE μηνύματα πάνω σε ανοιχτό socket — το κρατάμε σαν πιθανή βελτίωση αργότερα, όχι τώρα.

 
Key takeaways

Singleton = private constructor + static instance + static access method
getState() είναι το πώς το Zustand store μιλάει με μη-React κώδικα
Ένα socket, πολλά symbols, μέσω combined streams
*/ 