import { BASE_URL } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const usePlaceOrder = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (orderData: any) => {
      const response = await fetch(`${BASE_URL}/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Failed to place order");
      }

      return response.json();
    },
    onSuccess: (data) => {
      alert("Order placed successfully!");
      router.push(`/order/${data?.order_id}`);
    },
    onError: (error) => {
      console.error("Error placing order:", error);
      alert("Failed to place order");
    },
  });
};
