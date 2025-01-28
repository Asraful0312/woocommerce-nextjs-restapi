import { Button } from "./ui/button";
import { ProductVariation } from "@/lib/types";
import useCurrencyStore from "@/stores/useCurrencyStore";
import useVariationStore from "@/stores/useVariationStore";

type Props = {
  variations: ProductVariation[];
  isGrid?: boolean;
};

const Variation = ({ variations, isGrid }: Props) => {
  const { currency } = useCurrencyStore();
  const { selectedVariation, setSelectedVariation } = useVariationStore();
  return (
    <div className="pt-5">
      <h2 className="font-semibold">Variations:</h2>
      <div
        className={` gap-4 text-sm text-muted-foreground mt-2 ${
          isGrid ? "grid grid-cols-2" : "flex items-center"
        }`}
      >
        {variations?.map((variation) => (
          <Button
            className={`flex items-center justify-between ${
              isGrid ? "w-full" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              setSelectedVariation(variation);
            }}
            variant={
              selectedVariation?.name === variation?.name
                ? "default"
                : "outline"
            }
            key={variation.id}
          >
            {variation?.name}
            <p>-</p>
            <p>
              {variation.price} {currency}
            </p>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Variation;
