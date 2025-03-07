"use client";
import Wrapper from "@/components/shared/Wrapper";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { extractPrice, sanitize } from "@/lib/utils";
import Variation from "@/components/Variation";
import OrderForm from "@/components/order/OrderForm";
import { ProductType } from "@/lib/types";
import { useSingleProduct } from "@/hooks/useSingleProduct";
import { useState } from "react";
import { buttonVariants, EnhancedButton } from "@/components/ui/enhancedButton";
import ProductDetailsSkeleton from "@/components/skeletons/ProductDetailsSkeleton";
import AttributeSelector from "@/components/Attributes";
import useVariationStore from "@/stores/useVariationStore";
import ErrorMessage from "@/components/shared/ErrorMessage";

type Props = {
  params: string;
};

const ProductDetails = ({ params }: Props) => {
  const { data: product, isLoading, error } = useSingleProduct(params);
  const [open, setOpen] = useState<number | null>(null);
  const { selectedVariation } = useVariationStore();

  const {
    slug,
    id,
    name,
    images,
    type,
    description,
    stock_quantity,
    stock_status,
    variations,
    dimensions,
    price_html,
    short_description,
    weight,
    sku,
    categories,
    tags,
    attributes,
    external_url,
    button_text,
  } = product || {};

  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }
  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  return (
    <>
      <Wrapper className="mt-14">
        <div className="flex flex-col md:flex-row gap-10">
          {type !== "variable" &&
          !selectedVariation?.image?.src &&
          images &&
          images?.length > 1 ? (
            <Carousel
              opts={{ loop: true }}
              className="w-full h-[400px] md:basis-[40%] border rounded-md"
            >
              <CarouselContent>
                {images?.map((img, index) => (
                  <CarouselItem className="pl-0 h-full" key={index}>
                    <Image
                      width={400}
                      height={300}
                      className="w-full object-contain h-[400px] rounded-md"
                      src={
                        (type === "variable" && selectedVariation?.image.src) ||
                        img?.src ||
                        ""
                      }
                      alt={img?.alt || ""}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          ) : (
            <div className="w-[400px]">
              <Image
                width={400}
                height={300}
                className="object-contain h-[300px] rounded-md w-full"
                src={
                  (type === "variable" && selectedVariation?.image.src) ||
                  (images && images[0]?.src) ||
                  ""
                }
                alt={slug || "product image"}
              />
            </div>
          )}

          <div className="w-full md:basis-[60%]">
            <h2 className="font-semibold text-xl">{name}</h2>

            <div
              className="mt-2 pb-5 border-b"
              dangerouslySetInnerHTML={{
                __html: sanitize(extractPrice(price_html as string)),
              }}
            />

            {short_description && (
              <div
                className="pt-5"
                dangerouslySetInnerHTML={{
                  __html: sanitize(short_description),
                }}
              />
            )}

            {weight && (
              <div className="pt-5">
                <h2 className="font-semibold">
                  Weight (kg):{" "}
                  <span className=" font-normal text-muted-foreground">
                    {weight}kg
                  </span>
                </h2>
              </div>
            )}

            {sku && (
              <div className="pt-5">
                <h2 className="font-semibold">
                  Product Code:{" "}
                  <span className=" font-normal text-muted-foreground">
                    {sku}
                  </span>
                </h2>
              </div>
            )}

            {dimensions?.length && dimensions?.height && dimensions?.width && (
              <div className="pt-5">
                <h2 className="font-semibold">Dimensions (cm):</h2>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Length: {dimensions?.length}</p>
                  <p>Width: {dimensions?.width}</p>
                  <p>Height: {dimensions?.height}</p>
                </div>
              </div>
            )}

            {/* variations */}
            {type === "variable" && variations && variations?.length > 0 && (
              <Variation variations={variations} />
            )}

            {/* stock */}
            <div className="pt-5">
              <h2 className="font-semibold">
                Stock:{" "}
                <span
                  className={` font-normal ${
                    stock_quantity && stock_quantity === 0
                      ? "bg-red-500"
                      : stock_status === "outofstock"
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {stock_quantity
                    ? stock_quantity + " in stock"
                    : stock_status === "outofstock"
                    ? "Out Of Stock"
                    : stock_status}
                </span>
              </h2>
            </div>

            {type !== "variable" && attributes && attributes.length > 0 && (
              <AttributeSelector attributes={attributes} />
            )}

            {/* buy button */}
            {type !== "external" ? (
              <EnhancedButton
                effect="shine"
                size="sm"
                disabled={stock_status === "outofstock" || stock_quantity === 0}
                onClick={() => {
                  if (!id) return;
                  setOpen(id);
                }}
                className="mt-4 disabled:cursor-not-allowed"
              >
                Buy Now
              </EnhancedButton>
            ) : (
              <a
                href={external_url || ""}
                target="_blank"
                className={buttonVariants({
                  className: "mt-4",
                  size: "sm",
                  effect: "shine",
                })}
              >
                {button_text || "Buy Now"}
              </a>
            )}
            <OrderForm
              open={open}
              setOpen={setOpen}
              product={product as ProductType}
            />

            {categories && categories.length > 0 && (
              <div className="mt-5">
                <h2 className="text-start font-semibold ">Categories</h2>
                <div className=" flex items-center gap-2">
                  {categories?.map((category, index) => (
                    <p
                      className="text-sm text-muted-foreground"
                      key={category?.id}
                    >
                      {category?.name}
                      {index === categories.length - 1 ? "" : ","}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {tags && tags.length > 0 && (
              <div className="mt-5">
                <h2 className="text-start font-semibold ">Tags</h2>
                <div className=" flex items-center gap-2">
                  {tags?.map((tag, index) => (
                    <p className="text-sm text-muted-foreground" key={tag?.id}>
                      {tag?.name}
                      {index === tags.length - 1 ? "" : ","}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {description && (
          <div className="my-5">
            <h2 className="text-start font-semibold text-xl ">Description</h2>
            <div
              dangerouslySetInnerHTML={{
                __html: sanitize(description as string),
              }}
            />
          </div>
        )}
      </Wrapper>
    </>
  );
};

export default ProductDetails;
