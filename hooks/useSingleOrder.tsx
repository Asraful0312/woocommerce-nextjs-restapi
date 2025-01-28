import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "@/lib/utils";
import { OrderType } from "@/lib/order-types";

const fetchSingleOrder = async (id: string): Promise<OrderType> => {
  const res = await fetch(`${BASE_URL}/order/${id}`);
  if (!res.ok) throw new Error("Failed to fetch order");
  return res.json();
};

export const useSingleOrder = (id?: string) => {
  return useQuery<OrderType>({
    queryKey: ["singleOrder", id],
    queryFn: () => fetchSingleOrder(id!),
    enabled: !!id, // Only fetch when slug is available
  });
};
