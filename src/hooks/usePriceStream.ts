import { useEffect } from 'react';
import { usePriceStore } from '@/store/usePriceStore';
import { binanceWS } from '@/services/binance/websocket';

export function usePriceStream(symbol: string) {
  const price = usePriceStore((state) => state.prices[symbol]);
  const isConnected = usePriceStore((state) => state.isConnected);

  useEffect(() => {
    binanceWS.subscribe(symbol);

    return () => {
      binanceWS.unsubscribe(symbol);
    };
  }, [symbol]);

  return { price, isConnected };
}



/*
 Εξήγηση γραμμή-γραμμή:

usePriceStore((state) => state.prices[symbol]) → αυτό είναι selector (το θυμάσαι από το mini-counter παράδειγμα;). 
Το component που θα καλέσει αυτό το hook ξανα-ρεντεράρει μόνο όταν αλλάξει 
η τιμή αυτού του συγκεκριμένου symbol — όχι όταν αλλάξει π.χ. το ETH price ενώ εσύ δείχνεις BTC.

useEffect(() => {...}, [symbol]) → τρέχει όταν το component mount-άρει (πρώτη φορά) ή όταν αλλάξει το symbol.

binanceWS.subscribe(symbol) → μέσα στο effect, λέμε στον Singleton "ξεκίνα να ακούς για αυτό το symbol".
return () => { binanceWS.unsubscribe(symbol); } → το cleanup function — ξαναείδαμε αυτό το pattern στο CandlestickChart με το chart.remove().
 Εδώ σημαίνει: όταν το component unmount-άρει (π.χ. αν αφαιρέσεις ένα coin από το grid),
  λέμε στον Singleton "σταμάτα να ακούς για αυτό το symbol". Χωρίς αυτό, 
  θα συνέχιζες να λαμβάνεις (και να αποθηκεύεις στο store) δεδομένα για coins που δεν δείχνεις πια — memory/network waste.

Γιατί αυτό είναι Facade, ξανά: Το component που θα το χρησιμοποιήσει (θα το δούμε αμέσως μετά) δεν ξέρει τίποτα για Zustand selectors, Singleton, subscribe/unsubscribe lifecycle. Καλεί usePriceStream('BTCUSDT'), παίρνει { price, isConnected }, τέλος.
Key takeaways

Cleanup function στο useEffect = "τι κάνω όταν το component φεύγει" — κρίσιμο για οτιδήποτε subscribe/connect
Selectors στο Zustand = fine-grained re-renders, όχι "ξύπνα σε κάθε αλλαγή του store"
Το hook είναι το μόνο σημείο επαφής — components δεν αγγίζουν ποτέ binanceWS ή usePriceStore απευθείας
*/