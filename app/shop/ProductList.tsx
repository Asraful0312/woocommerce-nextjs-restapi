"use client";
import ProductCard from "@/components/shared/ProductCard";
import ProductCardSkeleton from "@/components/skeletons/ProductCardSkeleton";
import { Button } from "@/components/ui/button";
import { ProductType } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

const fetchProducts = async ({
  pageParam = 1,
  queryParams,
}: {
  pageParam: number;
  queryParams: string;
}): Promise<ProductType[]> => {
  try {
    const res = await fetch(
      `/api/products?per_page=8&page=${pageParam}${queryParams}`
    );
    if (!res.ok) throw new Error("Failed to fetch products");
    const { products } = await res.json();
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

const ProductList = () => {
  const searchParams = useSearchParams();
  const feature = searchParams.get("feature");
  const recent = searchParams.get("recent");
  const onSale = searchParams.get("on_sale");

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
    queryKey: ["shopProducts", queryParams],
    queryFn: ({ pageParam }) => fetchProducts({ pageParam, queryParams }),
    getNextPageParam: (lastPage, pages) =>
      lastPage.length === 8 ? pages.length + 1 : undefined,
    staleTime: 5 * 60 * 1000,
    initialPageParam: 1,
  });

  const products = data?.pages.flat() || [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <ProductCardSkeleton />
        <ProductCardSkeleton />
        <ProductCardSkeleton />
        <ProductCardSkeleton />
      </div>
    );
  }

  if (error)
    return <p className="text-center">An error occurred: {error.message}</p>;
  if (products.length === 0)
    return <p className="text-center">No products found.</p>;

  return (
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
          <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </>
  );
};

export default ProductList;
