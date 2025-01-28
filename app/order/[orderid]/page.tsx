"use client";

import { InvoiceGenerator } from "@/components/InvoiceGenerator";
import Wrapper from "@/components/shared/Wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSingleOrder } from "@/hooks/useSingleOrder";

type Props = {
  params: {
    orderid: string;
  };
};

const SingleOrder = ({ params }: Props) => {
  const { data: order, isLoading, error } = useSingleOrder(params.orderid);

  console.log(order, error);

  if (isLoading) {
    return;
  }

  const generateInvoice = InvoiceGenerator({ order });

  return (
    <Wrapper className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Order #{order?.order_id}</h1>
        {order && <Button onClick={generateInvoice}>Download Invoice</Button>}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p>
                <strong>Customer Name:</strong> {order?.name}
              </p>
              <p>
                <strong>Customer ID:</strong> {order?.customer_id}
              </p>
              <p>
                <strong>Status:</strong> {order?.status}
              </p>
            </div>
            <div>
              <p>
                <strong>Currency:</strong> {order?.currency}
              </p>
              <p>
                <strong>Total:</strong> {order?.price}
                {order?.currency_symbol}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Name:</strong> {order?.billing.first_name}
          </p>
          <p>
            <strong>Address:</strong> {order?.billing.address_1}
          </p>
          <p>
            <strong>Email:</strong> {order?.billing.email}
          </p>
          <p>
            <strong>Phone:</strong> {order?.billing.phone}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>
              {order?.price}
              {order?.currency_symbol}
            </span>
          </div>
        </CardContent>
      </Card>
    </Wrapper>
  );
};

export default SingleOrder;
