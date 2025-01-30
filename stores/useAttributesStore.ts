import { create } from "zustand";

type AttributeStore = {
  selectedAttributes: Record<string, string>;
  setAttribute: (name: string, value: string) => void;
  resetAttributes: () => void;
};

export const useAttributeStore = create<AttributeStore>((set) => ({
  selectedAttributes: {}, // Default empty object
  setAttribute: (name, value) =>
    set((state) => ({
      selectedAttributes: { ...state.selectedAttributes, [name]: value },
    })),
  resetAttributes: () => set({ selectedAttributes: {} }), // Reset function
}));
