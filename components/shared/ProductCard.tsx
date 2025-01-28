import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";
import { ProductType } from "@/lib/types";
import { Badge } from "../ui/badge";
import { extractPrice } from "@/lib/utils";
import DOMPurify from "dompurify";
import OrderForm from "../order/OrderForm";
import { EnhancedButton } from "../ui/enhancedButton";
import placeholderImg from "@/app/assets/images/placeholder.png";

type Props = {
  product: ProductType;
};

const ProductCard = ({ product }: Props) => {
  const { images, name, slug, price_html, on_sale, type, variations, id } =
    product || {};
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="w-full border rounded overflow-hidden h-full flex flex-col justify-between shadow-sm relative p-3">
      {on_sale && <Badge className="absolute right-2 top-2 z-20">Sale</Badge>}
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
            {name}
          </h2>

          {/* Price extracted from price_html */}
          <p className="text-center  text-sm">
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

      <div onClick={(e) => e.preventDefault()}></div>
      <OrderForm product={product} open={open} setOpen={setOpen} />
    </div>
  );
};

export default ProductCard;
