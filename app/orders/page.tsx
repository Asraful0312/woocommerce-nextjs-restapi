"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/useAuthStore";
import { OrderType } from "@/lib/order-types";
import Wrapper from "@/components/shared/Wrapper";
import OrderRow from "@/components/order/OrderRow";
import OrderRowSkeleton from "@/components/skeletons/OrderRowSkeleton";
import AuthGuard from "@/components/AuthGuard";

// Fetch Orders with React Query
const fetchUserOrders = async (token: string) => {
  const response = await fetch("/api/orders", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error fetching user orders");
  }

  return response.json();
};

const OrderList = () => {
  const { token } = useAuthStore();

  const {
    data: orders,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userOrders"],
    queryFn: () => fetchUserOrders(token as string),
    enabled: !!token, // Only run the query if the token exists
  });

  if (isLoading) {
    return (
      <Wrapper className="mt-12">
        <OrderRowSkeleton />
      </Wrapper>
    );
  }

  if (error) {
    return <p className="text-red-500">Failed to fetch orders.</p>;
  }

  if (!isLoading && !error && orders && orders?.length === 0) {
    return <p className="text-center mt-12">No orders found!</p>;
  }

  return (
    <AuthGuard>
      <Wrapper className="py-6">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((order: OrderType) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </TableBody>
        </Table>
      </Wrapper>
    </AuthGuard>
  );
};

export default OrderList;
