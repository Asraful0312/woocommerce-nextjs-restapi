"use client";

import React, { FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useClickOutside, useDebouncedValue } from "@mantine/hooks";
import { ArrowRight, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ProductType } from "@/lib/types";
import { BASE_URL } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";

type Props = {
  isSearchBar: boolean;
  setIsSearchBar: (value: boolean) => void;
};

const fetchProducts = async (query: string): Promise<ProductType[] | null> => {
  if (!query) return [];
  const res = await fetch(`${BASE_URL}/search?query=${query}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
};

const SearchBar = ({ isSearchBar, setIsSearchBar }: Props) => {
  const ref = useClickOutside(() => setIsSearchBar(false));
  const [value, setValue] = useState("");
  const [debounced] = useDebouncedValue(value, 300);
  const router = useRouter();

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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/shop?search=${debounced}`);
    setIsSearchBar(false);
  };

  return (
    <div
      ref={ref}
      className={`absolute right-10 mx-auto top-14 bg-white border w-[70%] py-3 rounded-md z-[80] transition-all duration-300 ${
        isSearchBar
          ? "opacity-100 translate-y-3 visible"
          : "opacity-0 translate-y-0 invisible"
      }`}
    >
      <form onSubmit={handleSubmit} className="px-3">
        <div className="relative">
          <Input
            onChange={(e) => setValue(e.target.value)}
            className="peer pe-9 ps-9"
            placeholder="Search..."
            type="search"
            value={value}
          />
          <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
            <Search size={16} strokeWidth={2} />
          </div>
          <button
            className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Submit search"
            type="submit"
          >
            <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
      </form>

      {/* Search Results */}
      {debounced && (
        <ul className="w-full mt-4">
          <li className="text-lg font-medium px-3 border-b">Search Results</li>
          {error && (
            <li className="text-red-500 px-3 py-2">{error?.message}</li>
          )}
          {isFetching ? (
            <li className="px-3 py-2 text-gray-500 space-y-2">
              <Skeleton className="bg-gray-300 h-4 w-full" />
              <Skeleton className="bg-gray-300 h-4 w-full" />
              <Skeleton className="bg-gray-300 h-4 w-full" />
              <Skeleton className="bg-gray-300 h-4 w-full" />
            </li>
          ) : products && products?.length > 0 ? (
            products?.map((product: any) => (
              <li key={product?.id} className="w-full">
                <Link
                  className="py-2 px-3 w-full block hover:bg-muted text-sm hover:text-primary trnasition-all duration-300"
                  href={`/product/${product?.slug}`}
                  onClick={()=> setIsSearchBar(false)}
                >
                  {product?.name}
                </Link>
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-gray-500">No products found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
