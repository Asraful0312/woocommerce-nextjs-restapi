"use client";

import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import ProductCardSkeleton from "./skeletons/ProductCardSkeleton";
import ProductCard from "./shared/ProductCard";
import Wrapper from "./shared/Wrapper";
import Heading from "./shared/Heading";
import { ProductType } from "@/lib/types";
import { BASE_URL } from "@/lib/utils";

const fetchProducts = async ({
  pageParam = 1,
}: {
  pageParam: number;
}): Promise<ProductType[]> => {
  const res = await fetch(`${BASE_URL}/products?per_page=4&page=${pageParam}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  const { products } = await res.json();
  return products;
};

const RecentProducts = () => {
  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<
    ProductType[],
    Error,
    InfiniteData<ProductType[]>,
    number
  >({
    queryKey: ["recentProducts"],
    queryFn: fetchProducts,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length === 4 ? pages.length + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
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
    content = <p className="text-center">No featured products found.</p>;
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
    <Wrapper>
      <Heading text="Recent Products" />
      {content}
    </Wrapper>
  );
};

export default RecentProducts;
