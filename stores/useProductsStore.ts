import { ProductType } from "@/lib/types";
import { BASE_URL } from "@/lib/utils";
import { create } from "zustand";

interface VariationStore {
  products: ProductType[];
  loading: boolean;
  error: string | null;
  fetchProducts: (params?: {
    featured?: boolean;
    recent?: boolean;
    per_page?: number;
  }) => Promise<void>;
}

const useProductsStore = create<VariationStore>((set) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async (params = {}) => {
    set({ loading: true, error: null });

    try {
      const query = new URLSearchParams();

      console.log("query", query);

      if (params.featured) query.append("feature", "true");
      if (params.recent) query.append("recent", "true");
      if (params.per_page) query.append("per_page", params.per_page.toString());

      const res = await fetch(`${BASE_URL}/products?${query.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch products");

      const data = await res.json();
      set({ products: data.products, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Unknown error occurred",
        loading: false,
      });
    }
  },
}));

export default useProductsStore;
