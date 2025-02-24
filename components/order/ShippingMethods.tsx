"use client";
import React from "react";
import { EnhancedButton } from "@/components/ui/enhancedButton";
import { ShippingMethod } from "@/lib/types";
import { useShippingMethods } from "@/hooks/useShippingMethods";
import { Loader2 } from "lucide-react";
import { useCurrency } from "@/hooks/useCurrency";

type Props = {
  selectedShipping: ShippingMethod;
  setSelectedShipping: (shippingMethod: ShippingMethod) => void;

};

const ShippingMethods = ({
  selectedShipping,
  setSelectedShipping,
}: Props) => {
   const { data, isLoading: isCurrencyLoading } = useCurrency();
  const { currency } = data || {};
  const { data: shippingMethods, isLoading, error } = useShippingMethods();
  return (
    <div>
      <h2>
        Shipping Methods <span className="text-red-500 text-lg">*</span>
      </h2>
      {isLoading && (
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="shrink-0 size-4 animate-spin text-gray-400" />
          <p className="text-gray-400">Getting Shipping Methods...</p>
        </div>
      )}
      {error && <p className="text-center text-red-500">{error.message}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {!isLoading && !error && shippingMethods &&
          shippingMethods?.map((data) => (
            <EnhancedButton
              onClick={(e) => {
                e.preventDefault();
                setSelectedShipping(data);
              }}
              size="sm"
              className="flex items-center justify-center gap-2"
              variant={
                selectedShipping?.id === data?.id ? "default" : "outline"
              }
              key={data.id}
            >
              <span>{data?.title}:</span> <span>{data?.settings?.cost?.value}</span>
              <span>{isCurrencyLoading ? <Loader2 className="shrink-0 size-4 animate-spin"/> : currency}</span>
            </EnhancedButton>
          ))}
      </div>
    </div>
  );
};

export default ShippingMethods;
