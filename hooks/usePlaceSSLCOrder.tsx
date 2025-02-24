import { useMutation } from "@tanstack/react-query";

export const usePlaceSSLCOrder = () => {
  return useMutation({
    mutationFn: async (orderData: any) => {
      const res = await fetch("/api/sslcommerz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error("Failed to place order");
      }

      if (data.GatewayPageURL) {
        await new Promise((resolve) => setTimeout(resolve, 50));
        window.location.href = data.GatewayPageURL;
      }
      return data;
    },

    onError: (error) => {
      console.error("Error placing order:", error);
    },
  });
};
