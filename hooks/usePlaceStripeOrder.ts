import { useState, useCallback } from "react";

export const usePlaceStripeOrder = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const placeStripeOrder = useCallback(
    async (orderData: any, userId: string) => {
      setIsLoading(true);
      setError(null);
      try {
        // Send order data to checkout API
        const response = await fetch(`/api/checkout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        });

        if (!response.ok) throw new Error("Failed to create order");

        // Extract checkout URL and order ID
        const { checkoutUrl, orderId } = await response.json();

        // Redirect to Stripe checkout
        window.open(checkoutUrl, "_blank");

        // Update order in backend
        await fetch(`/api/update-order`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, orderId }),
        });
      } catch (err) {
        setError((err as Error).message);
        console.error("Error placing order:", err);
        alert("Failed to place order");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { placeStripeOrder, isLoading, error };
};
