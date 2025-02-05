import { create } from "zustand";

interface StoreType {
  currency: string | null;
  symbol: string | null;
  loading: boolean;
  error: string | null;
  fetchCurrency: () => Promise<void>;
}

const useCurrencyStore = create<StoreType>((set) => ({
  currency: null,
  symbol: null,
  loading: false,
  error: null,

  fetchCurrency: async () => {
    set({ loading: true, error: null });

    try {
      const res = await fetch(`/api/settings`);
      if (!res.ok) throw new Error("Failed to fetch currency");

      const data = await res.json();
      set({ currency: data.currency, symbol: data.symbol, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Unknown error",
        loading: false,
      });
    }
  },
}));

export default useCurrencyStore;
