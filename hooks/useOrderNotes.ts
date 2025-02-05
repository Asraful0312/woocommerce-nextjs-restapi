import { useQuery } from "@tanstack/react-query";
import { OrderNoteType } from "@/lib/order-types";

const fetchOrderNote = async (id: string): Promise<OrderNoteType[]> => {
  const res = await fetch(`/api/order/notes/${id}`);
  if (!res.ok) throw new Error("Failed to fetch order notes");
  return res.json();
};

export const useOrderNotes = (id?: string) => {
  return useQuery<OrderNoteType[]>({
    queryKey: ["orderNotes", id],
    queryFn: () => fetchOrderNote(id!),
    enabled: !!id, // Only fetch when slug is available
  });
};
