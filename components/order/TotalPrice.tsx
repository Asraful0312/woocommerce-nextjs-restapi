import { useCurrency } from "@/hooks/useCurrency";
import { ShippingMethod } from "@/lib/types";
import useVariationStore from "@/stores/useVariationStore";
import { Loader2 } from "lucide-react";
import React from "react";

type Props = {
  price: string;
  quantity: number;
  selectedShipping: ShippingMethod | null;
};

const TotalPrice = ({ price, quantity, selectedShipping }: Props) => {
  const { data, isLoading } = useCurrency();
  const { currency } = data || {};
  const { selectedVariation } = useVariationStore();

  const calculateTotalPrice = () => {
    const basePrice = selectedVariation?.price
      ? Number(selectedVariation.price)
      : Number(price);

    const quantityValue = Number(quantity) || 1; // Ensure quantity is a valid number, default to 1
    const shippingCost = Number(selectedShipping?.settings?.cost?.value);

    const totalPrice =
      basePrice * quantityValue + (isNaN(shippingCost) ? 0 : shippingCost);

    return totalPrice;
  };
  return (
    <p className="flex items-center gap-3">
      Total Price:
      <p className="flex items-center gap-2">
        {calculateTotalPrice()}{" "}
        {isLoading ? <Loader2 className="shrink-0 size-4 animate-spin" /> : currency}
      </p>
    </p>
  );
};

export default TotalPrice;
