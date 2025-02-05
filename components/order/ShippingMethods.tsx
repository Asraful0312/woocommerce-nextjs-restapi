"use client";
import React from "react";
import { EnhancedButton } from "@/components/ui/enhancedButton";
import { ShippingMethod } from "@/lib/types";

type Props = {
  selectedShipping: ShippingMethod;
  shippingMethods: ShippingMethod[];
  setSelectedShipping: (shippingMethod: ShippingMethod) => void;
  currency: string;
};

const ShippingMethods = ({
  currency,
  shippingMethods,
  selectedShipping,
  setSelectedShipping,
}: Props) => {
  return (
    <div>
      <h2>
        Shipping Methods <span className="text-red-500 text-lg">*</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {shippingMethods &&
          shippingMethods?.map((data) => (
            <EnhancedButton
              onClick={(e) => {
                e.preventDefault();
                setSelectedShipping(data);
              }}
              size="sm"
              variant={
                selectedShipping?.id === data?.id ? "default" : "outline"
              }
              key={data.id}
            >
              {data?.title}: {data?.settings?.cost?.value}
              {` ${currency}`}
            </EnhancedButton>
          ))}
      </div>
    </div>
  );
};

export default ShippingMethods;
