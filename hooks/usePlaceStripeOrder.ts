import { useMutation } from "@tanstack/react-query";

export const usePlaceStripeOrder = () => {
  return useMutation({
    mutationFn: async (orderData: any) => {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error("Failed to place order");
      }

      if (data.url) {
        window.location.href = data.url;
      }
      return res.json();
    },

    onError: (error) => {
      console.error("Error placing order:", error);
    },
  });
};
