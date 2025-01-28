import { ProductVariation } from "@/lib/types";
import { create } from "zustand";

type VariationState = {
  selectedVariation: ProductVariation | null;
  setSelectedVariation: (variation: ProductVariation) => void;
};

const useVariationStore = create<VariationState>((set) => ({
  selectedVariation: null,
  setSelectedVariation: (variation) => set({ selectedVariation: variation }),
}));

export default useVariationStore;
