"use client";

import { Button } from "@/components/ui/button";
import { TextShimmer } from "@/components/ui/text-shimmer";
import Wrapper from "@/components/shared/Wrapper";
import { ProductCategory } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import CategoryCard from "@/components/CategoryCard";
import CategorySkeleton from "@/components/skeletons/CategorySkeleton";

const fetchCategories = async ({
  pageParam = 1,
  queryParams,
}: {
  pageParam: number;
  queryParams: string;
}): Promise<ProductCategory[]> => {
  try {
    const res = await fetch(
      `/api/categories?per_page=5&page=${pageParam}${queryParams}`
    );
    if (!res.ok) throw new Error("Failed to fetch categories");
    const categories = await res.json();
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

const CategoriesContent = () => {
  const searchParams = useSearchParams();
  const parent = searchParams.get("parent");

  let queryParams = "";
  if (parent) queryParams += `&parent=${parent}`;

  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["categories", queryParams],
    queryFn: ({ pageParam }) => fetchCategories({ pageParam, queryParams }),
    getNextPageParam: (lastPage, pages) =>
      lastPage.length === 5 ? pages.length + 1 : undefined,
    staleTime: 5 * 60 * 1000,
    initialPageParam: 1,
  });

  const categories = data?.pages.flat() || [];

  if (isLoading) {
    return <CategorySkeleton />;
  }

  if (error)
    return (
      <p className="text-center text-red-500 mt-5">
        An error occurred: {error.message}
      </p>
    );
  if (CategoriesContent.length === 0)
    return (
      <p className="text-center text-gray-500 mt-5">No categories found.</p>
    );

  return (
    <Wrapper className="mt-5">
      <h1 className="text-xl font-semibold mb-4">categories</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
        {categories.map((category) => (
          <CategoryCard key={category?.id} category={category} />
        ))}
      </div>

      {hasNextPage && !isFetchingNextPage && (
        <div className="flex justify-center mt-6">
          <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
      {isFetchingNextPage && (
        <div className="flex justify-center mt-6">
          <TextShimmer className="font-mono text-sm" duration={1}>
            Getting more...
          </TextShimmer>
        </div>
      )}
    </Wrapper>
  );
};

export default CategoriesContent;
