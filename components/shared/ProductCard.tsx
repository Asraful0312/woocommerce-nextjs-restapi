import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";
import { ProductType } from "@/lib/types";
import { Badge } from "../ui/badge";
import { extractPrice } from "@/lib/utils";
import DOMPurify from "dompurify";
import OrderForm from "../order/OrderForm";
import { buttonVariants, EnhancedButton } from "../ui/enhancedButton";
import placeholderImg from "@/app/assets/images/placeholder.png";

type Props = {
  product: ProductType;
};

const ProductCard = ({ product }: Props) => {
  const {
    type,
    images,
    name,
    slug,
    price_html,
    on_sale,
    button_text,
    external_url,
    variations,
    id,
    sale_price,
    regular_price,
  } = product || {};
  const [open, setOpen] = useState<number | null>(null);

  // Function to calculate discount percentage
  const getDiscountPercentage = (regularPrice: number, salePrice: number) => {
    if (!regularPrice || !salePrice || regularPrice <= salePrice) return 0;
    return Math.round(((regularPrice - salePrice) / regularPrice) * 100);
  };

  // Determine the discount, considering variations
  let discount = getDiscountPercentage(
    Number(regular_price),
    Number(sale_price)
  );
  if (!discount && variations?.length) {
    variations.forEach((variation) => {
      const variationDiscount = getDiscountPercentage(
        Number(variation.regular_price),
        Number(variation.sale_price)
      );
      if (variationDiscount > discount) {
        discount = variationDiscount;
      }
    });
  }

  return (
    <div className="w-full border rounded overflow-hidden h-full flex flex-col justify-between shadow-sm relative p-3">
      {on_sale && (
        <Badge className="absolute bg-red-600 hover:bg-red-600 right-2 top-2 z-20">
          {discount > 0 ? `- ${discount}%` : `- ${0}%`} OFF
        </Badge>
      )}

      <Link href={`/product/${slug}`}>
        <Image
          className="w-full h-[200px] mx-auto object-cover hover:scale-110 transition-all duration-500 rounded"
          src={images[0]?.src || placeholderImg}
          width={300}
          height={200}
          alt={images[0]?.alt || "product image"}
        />

        <div className="pt-3">
          <h2 className="font-medium block text-center hover:underline hover:text-primary transition-all spin-out-3 line-clamp-2">
            {name.substring(0, 40)}...
          </h2>

          {/* Price extracted from price_html */}
          <p className="text-center text-sm">
            <span
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(extractPrice(price_html as string)),
              }}
            />
          </p>

          {type === "variable" && variations?.length > 0 && (
            <p className="text-center text-sm">
              {variations.length} variations
            </p>
          )}
        </div>
      </Link>

      {type !== "external" ? (
        <EnhancedButton
          effect="shine"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            setOpen(id);
          }}
          className="w-full mt-3"
        >
          Buy Now
        </EnhancedButton>
      ) : (
        <a
        target="_blank"
          href={external_url || ""}
          className={buttonVariants({
            className: "w-full mt-3 text-wrap",
            effect: "shine",
            size: "sm"
          })}
        >
          {button_text || "Buy Now"}
        </a>
      )}

      <OrderForm product={product} open={open} setOpen={setOpen} />
    </div>
  );
};

export default ProductCard;
