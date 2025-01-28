"use client";

import { useQuery } from "@tanstack/react-query";
import ProductCardSkeleton from "./skeletons/ProductCardSkeleton";
import ProductCard from "./shared/ProductCard";
import Wrapper from "./shared/Wrapper";
import Heading from "./shared/Heading";
import { ProductType } from "@/lib/types";
import { BASE_URL } from "@/lib/utils";
import { EnhancedButton } from "./ui/enhancedButton";

const fetchProducts = async (): Promise<ProductType[]> => {
  const res = await fetch(`${BASE_URL}/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  const { products } = await res.json();
  return products;
};

const RecentProducts = () => {
  const {
    data: products,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["recentProducts"],
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
  } else if (error) {
    content = <p className="text-center">An error occurred: {error.message}</p>;
  } else if (products?.length === 0) {
    content = <p className="text-center">No featured products found.</p>;
  } else {
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
    <Wrapper>
      <Heading text="Recent Products" />
      {content}

      <div className="flex justify-center mt-8">
        <EnhancedButton size="sm" variant="secondary" effect="ringHover">
          See More
        </EnhancedButton>
      </div>
    </Wrapper>
  );
};

export default RecentProducts;
