import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "@/lib/utils";
import { PaymentGateway } from "@/lib/types";

const fetchPaymentMethods = async (): Promise<PaymentGateway[]> => {
  const response = await fetch(`${BASE_URL}/payments`);
  const data = await response.json();
  return data.paymentMethods;
};

export const usePaymentMethods = () => {
  return useQuery({
    queryKey: ["paymentMethods"],
    queryFn: fetchPaymentMethods,
  });
};
