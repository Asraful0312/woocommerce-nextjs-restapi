"use client";
import { OrderType } from "@/lib/order-types";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { buttonVariants } from "../ui/enhancedButton";
import { Badge } from "../ui/badge";

const OrderRow = ({ order }: { order: OrderType }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "processing":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
        case "failed":
          return "bg-red-500"
      default:
        return "bg-gray-500";
    }
  };

  return (
    <>
      <TableRow>
        <TableCell>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </TableCell>
        <TableCell>#{order.id}</TableCell>
        <TableCell>
          <Badge className={`${getStatusColor(order.status)} text-white`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </TableCell>
        <TableCell>{format(new Date(order.date_created), "PPP")}</TableCell>

        <TableCell>{`${order.billing.first_name} ${order.billing.last_name}`}</TableCell>
        <TableCell>{order.payment_method_title}</TableCell>
        <TableCell className="font-medium">
          {order.currency_symbol}
          {order.total}
        </TableCell>
        <TableCell className="flex items-center gap-2">
          <Link
            href={`/order/${order?.id}`}
            className={buttonVariants({
              size: "sm",
              className: "",
            })}
          >
            Details
          </Link>
        </TableCell>
      </TableRow>
      {isExpanded && (
        <TableRow>
          <TableCell colSpan={8}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Customer ID</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.line_items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{order?.customer_id}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      {order.currency_symbol}
                      {item.total}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

export default OrderRow;
