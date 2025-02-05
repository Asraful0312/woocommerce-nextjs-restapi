import { cn } from "./utils";

const extractPrices = (html: string) => {
  const regex =
    /(\d+(\.\d{1,2})?)(?=<span class="woocommerce-Price-currencySymbol">)/g;
  const matches = html && html?.match(regex);
  return matches ? matches : [];
};

export const ProductPrice = ({ priceHtml = "", className = "" }) => {
  const prices = extractPrices(priceHtml);

  const originalPrice = prices && prices[0]; // First price (original)
  const currentPrice = prices && prices[1]; // Second price (current)

  return (
    <div>
      {originalPrice && currentPrice && (
        <div className={cn("flex items-center justify-between", className)}>
          <ins className="font-semibold">{`${currentPrice}`}</ins>
          <span> &nbsp; </span>
          <del className="text-gray-400 text-sm">{`${originalPrice}`}</del>
        </div>
      )}
      {!originalPrice && !currentPrice && <span>Price not available</span>}
    </div>
  );
};
