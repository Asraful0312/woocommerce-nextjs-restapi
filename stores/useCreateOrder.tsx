import {
  OrderType,
  ProductType,
  ProductVariation,
  ShippingMethod,
} from "@/lib/types";
import { BASE_URL } from "@/lib/utils";
import { create } from "zustand";

interface FormDataType {
  name: string;
  address: string;
  phone: string;
  email: string;
  account_number: string;
  transaction_id: string;
}

type ArgType = {
  formData: FormDataType;
  userId: string;
  selectedPaymentMethod: { id: string; title: string };
  product: ProductType;
  selectedVariation: string;
  selectedShipping: ShippingMethod;
};

interface StoreType {
  data: OrderType | null;
  loading: boolean;
  error: string | null;
  placeOrder: (e: React.FormEvent, data: ArgType) => Promise<void>;
}

const useSingleProductStore = create<StoreType>((set) => ({
  data: null,
  loading: false,
  error: null,

  placeOrder: async (
    e: React.FormEvent,
    {
      formData,
      userId,
      selectedPaymentMethod,
      product,
      selectedVariation,
      selectedShipping,
    }
  ) => {
    e.preventDefault();
    set({ loading: true, error: null });

    const orderData = {
      customer_id: userId || 0,
      payment_method: selectedPaymentMethod?.id,
      payment_method_title: selectedPaymentMethod?.title,
      set_paid: false,
      billing: {
        first_name: formData.name,
        address_1: formData.address,
        phone: formData.phone,
        email: formData.email,
      },
      line_items: [
        {
          product_id: product.id,
          variation_id:
            product.type === "variable"
              ? typeof product.variations !== "number" &&
                product.variations?.find(
                  (v: ProductVariation) => v?.name === selectedVariation
                )?.id // Corrected line
              : undefined,
          quantity: 1,
        },
      ],
      shipping: {
        first_name: formData.name,
        address_1: formData.address,
        phone: formData.phone,
        email: formData.email,
      },

      meta_data: [
        ...(selectedPaymentMethod?.id === "woo_bkash" ||
        selectedPaymentMethod?.id === "woo_nagad"
          ? [
              { key: "account_number", value: formData.account_number },
              { key: "transaction_id", value: formData.transaction_id },
            ]
          : []),
      ],

      shipping_lines: [
        {
          method_id: selectedShipping?.method_id,
          method_title: selectedShipping?.title,
          total: selectedShipping?.settings?.cost?.value || "0",
        },
      ],
    };

    try {
      const response = await fetch(`${BASE_URL}/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();
      set({ data, loading: false });

      if (response.ok) {
        alert("Order placed successfully!");
      } else {
        alert("Failed to place order");
      }
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        loading: false,
      });

      console.error("Error placing order:", error);
    }
  },
}));

export default useSingleProductStore;
