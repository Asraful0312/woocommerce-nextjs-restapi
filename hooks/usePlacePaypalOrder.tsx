import { useMutation } from "@tanstack/react-query";

export const usePlacePaypalOrder = () => {
  return useMutation({
    mutationFn: async (orderData: any) => {
      const res = await fetch("/api/paypal/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url; // Redirect to PayPal
      } else {
        console.error("Error starting PayPal checkout:", data.error);
      }
      return data;
    },

    onError: (error) => {
      console.error("Error placing order:", error);
    },
  });
};
