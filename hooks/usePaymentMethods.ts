import { useQuery } from "@tanstack/react-query";
import { PaymentGateway } from "@/lib/types";

const fetchPaymentMethods = async (): Promise<PaymentGateway[]> => {
  const response = await fetch(`/api/payments`);
  const data = await response.json();
  return data.paymentMethods;
};

export const usePaymentMethods = () => {
  return useQuery({
    queryKey: ["paymentMethods"],
    queryFn: fetchPaymentMethods,
  });
};
