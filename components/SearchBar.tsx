"use client";

import React, { useState } from "react";

import { useDebouncedValue } from "@mantine/hooks";
import { PackageSearch, SearchIcon, X } from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { ProductType } from "@/lib/types";
import ProductCard from "./shared/ProductCard";
import ProductCardSkeleton from "./skeletons/ProductCardSkeleton";

type Props = {
  isSearchBar: boolean;
  setIsSearchBar: (value: boolean) => void;
};

const fetchProducts = async (query: string): Promise<ProductType[] | null> => {
  if (!query) return [];
  const res = await fetch(`/api/search?query=${query}&per_page=4&page=1`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
};

const SearchBar = ({ isSearchBar, setIsSearchBar }: Props) => {
  const [value, setValue] = useState("");
  const [debounced] = useDebouncedValue(value, 300);

  // Fetch search results when debounced value changes
  const {
    data: products = [],
    isFetching,
    error,
  } = useQuery({
    queryKey: ["search", debounced],
    queryFn: () => fetchProducts(debounced),
    enabled: !!debounced, // Only fetch when there is a query
  });

  return (
    <div
      className={`bg-white h-screen fixed inset-0 z-50 transition-all duration-300 border-b w-full
           ${
             isSearchBar
               ? "opacity-100 visible translate-y-0"
               : "opacity-0 invisible -translate-y-10"
           }`}
    >
      <div
        className={`w-full px-5 max-w-[1000px] h-full overflow-y-scroll mx-auto`}
      >
        <div className="flex justify-end py-8">
          <X
            className="size-8 border border-gray-700 p-2 rounded-full text-gray-500 shrink-0 hover:rotate-90 transition-all duration-300"
            onClick={() => setIsSearchBar(false)}
          />
        </div>

        {/* search items */}
        <div className="w-full px-5 max-w-[900px] mx-auto">
          <form
            className="flex items-start gap-3 border-b border-gray-800 "
            action=""
            onSubmit={(e) => e.preventDefault()} // Prevent form submission
          >
            <input
              className="outline-none w-full pb-6 text-lg lg:text-xl font-medium"
              type="text"
              placeholder="Product Search"
              value={value}
              onChange={(e) => setValue(e.target.value)} // Update search term
            />

            <button type="submit">
              <SearchIcon className="size-5 text-gray-400" />
            </button>
          </form>

          {isFetching ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-10">
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </div>
          ) : products && products?.length > 0 ? (
            <div className="mb-12">
              <h2 className="font-medium py-6 text-sm text-gray-500">
                Search Result
              </h2>

              <div
                className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-10`}
              >
                {products.map((product) => (
                  <ProductCard
                    key={`${product.id}-${product.name}`}
                    setIsSearchBar={setIsSearchBar}
                    product={product}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2 items-center justify-center mt-20">
              <PackageSearch className="size-20 text-gray-300" />
              {value && (
                <p className="text-center text-muted-foreground">
                  No Products found!
                </p>
              )}
            </div>
          )}
          {error && <p className="py-12 text-red-500">{error.message}</p>}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
