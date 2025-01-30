import { BASE_URL } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";

type Props = {
  showSuccessPopup: boolean;
  setShowSuccessPopup: (show: boolean) => void;
};

export const usePlaceOrder = ({
  setShowSuccessPopup,
}: Props) => {

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
    onSuccess: () => {
      setShowSuccessPopup(true);
    },
    onError: (error) => {
      console.error("Error placing order:", error);
      alert("Failed to place order");
    },
  });
};
