import { create } from 'zustand';

interface PriceState {
  prices: Record<string, number>;
  isConnected: boolean;
  setPrice: (symbol: string, price: number) => void;
  setConnected: (connected: boolean) => void;
}

export const usePriceStore = create<PriceState>((set) => ({
  prices: {},
  isConnected: false,
  setPrice: (symbol, price) =>
    set((state) => ({
      prices: { ...state.prices, [symbol]: price },
    })),
  setConnected: (connected) => set({ isConnected: connected }),
}));



/* 
 Record<string, number> → TypeScript type για "object με string keys, number values". 

 Στην πράξη: { BTCUSDT: 63142.74, ETHUSDT: 3400.12 }.

 set((state) => ({ prices: { ...state.prices, [symbol]: price } })) → σημαντικό: δεν κάνουμε state.prices[symbol] = price (mutation).

 Φτιάχνουμε νέο object με spread (...state.prices) και προσθέτουμε/αντικαθιστούμε το ένα key. 

 Αυτό είναι immutability — το Zustand (όπως και το React) βασίζεται στο να ξέρει "άλλαξε το reference" για να αποφασίσει πότε να ξανα-ρεντεράρει.
 
 setConnected → απλό flag update, δεν χρειάζεται spread γιατί δεν είναι nested object.


Key takeaways

create() φτιάχνει hook, όχι απλό object
Selectors (useStore((state) => state.x)) = re-render μόνο όταν αλλάζει το x, όχι όλο το store
Ποτέ mutation μέσα σε set() — πάντα νέο object
*/