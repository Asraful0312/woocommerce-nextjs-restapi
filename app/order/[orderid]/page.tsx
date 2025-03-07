"use client";

import ErrorMessage from "@/components/shared/ErrorMessage";
import Wrapper from "@/components/shared/Wrapper";
import SingleOrderSkeleton from "@/components/skeletons/SingleOrderSkeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useSingleOrder } from "@/hooks/useSingleOrder";
import { CreditCard, Info, Package, Truck } from "lucide-react";
import Image from "next/image";
import placeholderImg from "@/app/assets/images/placeholder.png";
import OrderTracking from "@/components/order-tracking";
import Link from "next/link";
import { getAuthToken } from "@/stores/useAuthStore";
import { buttonVariants } from "@/components/ui/enhancedButton";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRef } from "react";

type Props = {
  params: {
    orderid: string;
  };
};

const SingleOrder = ({ params }: Props) => {
  const { data: order, isLoading, error } = useSingleOrder(params.orderid);
  const authToken = getAuthToken();
  const invoiceRef = useRef<HTMLDivElement>(null);

  if (isLoading) {
    return <SingleOrderSkeleton />;
  } else if (!isLoading && error) {
    return <ErrorMessage message={error.message} />;
  } else if (!isLoading && !error && !order?.id) {
    return <ErrorMessage className="text-black" message="Order not Found!" />;
  }

  console.log("Order", order);

  // Function to generate and download PDF
  const downloadInvoice = async () => {
    if (!invoiceRef.current) return;

    // Temporarily apply a fixed width for consistent rendering
    const originalStyle = invoiceRef.current.style.cssText;
    invoiceRef.current.style.width = "994px"; // A4 width in pixels at 96 DPI
    invoiceRef.current.style.padding = "20px"; // Ensure proper spacing

    const canvas = await html2canvas(invoiceRef.current, { scale: 2 });

    // Restore the original styles
    invoiceRef.current.style.cssText = originalStyle;

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`invoice_${order?.id}.pdf`);
  };

  return (
    <Wrapper className="p-4">
      {!authToken && (
        <div className="py-2 px-4 rounded bg-blue-100 flex items-center gap-2">
          <Info className="size-4 shrink-0 text-blue-500" />
          <p className="text-blue-500">
            Your are currently not logged in to track your order please copy the
            order ID, check your order{" "}
            <Link href={`/find-order`} className="underline">
              here
            </Link>
          </p>
        </div>
      )}

      <OrderTracking currentStatus={order?.status || "pending"} />

      <div className="flex flex-wrap justify-between gap-2">
        <h1 className="text-3xl font-bold mb-6">Order Details #{order?.id}</h1>
        <div className="flex space-x-4">
          <button
            className={buttonVariants({ variant: "default" })}
            onClick={downloadInvoice}
          >
            Download Invoice
          </button>
          {authToken && (
            <Link
              className={buttonVariants({
                variant: "link",
                effect: "hoverUnderline",
              })}
              href={`/orders`}
            >
              Your Orders
            </Link>
          )}
        </div>
      </div>
      <div ref={invoiceRef}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p>
                    {new Date(
                      order?.date_created as string
                    ).toLocaleDateString()}
                  </p>
                  <p className="text-sm">Order ID: #{order?.id}</p>
                </div>
                <Badge
                  variant={
                    order?.status === "pending"
                      ? "secondary"
                      : order?.status === "failed"
                      ? "destructive"
                      : "default"
                  }
                >
                  {order?.status.toUpperCase()}
                </Badge>
              </div>
              <Separator className="my-4" />
              <div className="space-y-4">
                {order?.line_items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="relative w-16 h-16">
                      <Image
                        src={item.image.src || placeholderImg}
                        alt={item.name}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Product ID: {item.sku}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {order?.currency_symbol}
                        {item.total}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <p>Subtotal</p>
                  <p>
                    {order?.currency_symbol}
                    {order?.line_items[0].total}
                  </p>
                </div>
                {order?.shipping && order?.shipping_lines.length > 0 && (
                  <div className="flex justify-between">
                    <p>Shipping</p>
                    <p>
                      {order?.currency_symbol}
                      {order?.shipping_lines && order?.shipping_lines[0].total}
                    </p>
                  </div>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold">
                  <p>Total</p>
                  <p>
                    {order?.currency_symbol}
                    {order?.total}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-4 w-4" /> Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">{order?.payment_method_title}</p>
                <p className="text-sm text-muted-foreground">Payment pending</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="mr-2 h-4 w-4" /> Billing Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{order?.billing.first_name}</p>
                <p>{order?.billing.address_1}</p>
                <p>{order?.billing.email}</p>
                <p>{order?.billing.phone}</p>
              </CardContent>
            </Card>
            {order?.shipping && order?.shipping_lines.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Truck className="mr-2 h-4 w-4" /> Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{order?.shipping.first_name}</p>
                  <p>{order?.shipping.address_1}</p>
                  <p>{order?.shipping.phone}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Method: {order?.shipping_lines[0].method_title}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default SingleOrder;
