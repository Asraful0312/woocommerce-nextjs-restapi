import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const deleteOrder = async (orderId: string) => {
  const response = await fetch(`/api/delete-order/${orderId}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to delete order");
  }

  return data;
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userOrders"] });
      toast.success("Oder deleted successfully");
    },
    onError: (error: any) => {
      console.error("Delete order error:", error.message);
    },
  });
};
