import { useQuery } from "@tanstack/react-query";

import { ShippingMethod } from "@/lib/types";

const fetchShippingMethods = async (): Promise<ShippingMethod[]> => {
  const response = await fetch(`/api/shipping-methods?id=0`);
  const data = await response.json();
  return data.shippingMethods;
};

export const useShippingMethods = () => {
  return useQuery({
    queryKey: ["shippingMethods"],
    queryFn: fetchShippingMethods,
  });
};
