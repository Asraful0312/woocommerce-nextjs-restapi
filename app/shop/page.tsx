"use client";
import ProductCard from "@/components/shared/ProductCard";
import Wrapper from "@/components/shared/Wrapper";
import ProductCardSkeleton from "@/components/skeletons/ProductCardSkeleton";
import { ProductType } from "@/lib/types";
import { BASE_URL } from "@/lib/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import React from "react";

const fetchProducts = async ({
  pageParam = 1,
  queryParams,
}: {
  pageParam: number;
  queryParams: string;
}): Promise<ProductType[]> => {
  const res = await fetch(
    `${BASE_URL}/products?per_page=8&page=${pageParam}${queryParams}`
  );
  if (!res.ok) throw new Error("Failed to fetch products");
  const { products } = await res.json();
  return products;
};

const Shop = () => {
  const searchParams = useSearchParams();
  const feature = searchParams.get("feature");
  const recent = searchParams.get("recent");
  const onSale = searchParams.get("on_sale");

  // Build query string dynamically
  let queryParams = "";
  if (feature) queryParams += `&feature=true`;
  if (recent) queryParams += `&recent=true`;
  if (onSale) queryParams += `&on_sale=true`;

  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["shopProducts", queryParams], // Ensure query updates when params change
    queryFn: ({ pageParam }) => fetchProducts({ pageParam, queryParams }),
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length === 8 ? pages.length + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000,
    initialPageParam: 1,
  });

  const products = data?.pages.flat() || [];

  let content;
  if (isLoading) {
    content = (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <ProductCardSkeleton />
        <ProductCardSkeleton />
        <ProductCardSkeleton />
        <ProductCardSkeleton />
      </div>
    );
  } else if (error) {
    content = <p className="text-center">An error occurred: {error.message}</p>;
  } else if (products.length === 0) {
    content = <p className="text-center">No products found.</p>;
  } else {
    content = (
      <>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        {hasNextPage && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => fetchNextPage()}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </>
    );
  }

  return (
    <Wrapper className="mt-14">
      <h1 className="text-xl font-semibold mb-4">
        {feature
          ? "Featured Products"
          : recent
          ? "Recent Products"
          : onSale
          ? "On Sale Products"
          : "All Products"}
      </h1>
      {content}
    </Wrapper>
  );
};

export default Shop;
