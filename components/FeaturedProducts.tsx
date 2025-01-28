"use client";
import Wrapper from "./shared/Wrapper";
import Heading from "./shared/Heading";
import ProductCard from "./shared/ProductCard";
import ProductCardSkeleton from "./skeletons/ProductCardSkeleton";
import { BASE_URL } from "@/lib/utils";
import { ProductType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

const fetchProducts = async (): Promise<ProductType[]> => {
  const res = await fetch(`${BASE_URL}/products?feature=true&&limit=10`);
  if (!res.ok) throw new Error("Failed to fetch products");
  const { products } = await res.json();
  return products;
};

const FeaturedProducts = () => {
  const {
    data: products,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["featureProducts"],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
  let content;
  if (isLoading) {
    content = (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <ProductCardSkeleton />
        <ProductCardSkeleton />
        <ProductCardSkeleton />
        <ProductCardSkeleton />
      </div>
    );
  } else if (!isLoading && error) {
    content = <p className="text-center">An error occurred: {error.message}</p>;
  } else if (!isLoading && !error && products?.length === 0) {
    content = <p className="text-center">No featured products found.</p>;
  } else if (!isLoading && !error && products && products?.length > 0) {
    content = (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products?.map((product) => (
          <div key={product?.id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <Wrapper className="">
      <Heading text="Featured Products" />

      {/* render product */}
      {content}
    </Wrapper>
  );
};

export default FeaturedProducts;
