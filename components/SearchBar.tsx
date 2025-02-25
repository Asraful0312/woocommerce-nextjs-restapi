"use client";

import React, { useState } from "react";

import { useDebouncedValue } from "@mantine/hooks";
import { Loader2, Search, X } from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { ProductType } from "@/lib/types";

import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";
import { extractPrice, sanitize } from "@/lib/utils";
import { useClickOutside } from "@mantine/hooks";

const fetchProducts = async (query: string): Promise<ProductType[] | null> => {
  if (!query) return [];
  const res = await fetch(`/api/search?query=${query}&per_page=4&page=1`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
};

const SearchBar = () => {
  const [value, setValue] = useState("");
  const [debounced] = useDebouncedValue(value, 300);
  const ref = useClickOutside(() => setValue(""));

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

  //highlight product name
  const getHighlightedText = (text: string, highlight = "") => {
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));

    return (
      <h2>
        {parts.map((part, index) => {
          return part.toLowerCase() === highlight.toLowerCase() ? (
            <b className="text-primary text-bold" key={index}>
              {part}
            </b>
          ) : (
            part
          );
        })}
      </h2>
    );
  };

  let content;
  if (isFetching) {
    content = (
      <div className="flex items-start gap-3 py-3 px-4 animate-pulse">
        <div className="w-10 h-10 bg-gray-300 rounded shrink-0"></div>
        <div className="flex flex-col gap-2">
          <div className="w-32 h-4 bg-gray-300 rounded"></div>
          <div className="w-16 h-4 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  } else if (!isFetching && error) {
    content = <p className="py-3 text-center text-red-500">{error.message}</p>;
  } else if (!isFetching && !error && products && products.length === 0) {
    content = (
      <p className="py-3 text-center text-gray-500">No products found!</p>
    );
  } else if (!isFetching && !error && products && products.length > 0) {
    content = products?.map((product) => (
      <Link
        href={`/product/${product?.slug}`}
        key={product?.id}
        className="flex items-start gap-3 py-3 hover:bg-gray-100 transition-all duration-300 px-4 w-full"
      >
        <Image
          src={
            (product?.images && product?.images[0]?.src) || "/placeholder.png"
          }
          width={40}
          height={40}
          alt="product image"
          className="shrink-0"
        />
        <div>
          <h2 className="line-clamp-2">
            {getHighlightedText(product?.name, debounced)}
          </h2>
          <p className="text-sm">
            <span
              dangerouslySetInnerHTML={{
                __html: sanitize(
                  extractPrice(
                    product?.price_html || "<span>Price Unavailable</span>"
                  )
                ),
              }}
            />
          </p>
        </div>
      </Link>
    ));
  }

  return (
    <div
      ref={ref}
      className="w-full flex items-center gap-2 pl-3 rounded-md border border-primary relative"
    >
      <input
        type="text"
        placeholder="Search..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="border-none w-full outline-none bg-transparent"
      />
      <Button
        onClick={() => {
          if (!isFetching && debounced.length > 0) {
            setValue("");
          }
        }}
        disabled={isFetching}
        className="shrink-0 h-10 py-1 rounded-l-none rounded-r-md"
        size="icon"
      >
        {isFetching && <Loader2 className="size-4 shrink-0 animate-spin" />}
        {!isFetching && debounced.length === 0 && (
          <Search className="size-4 shrink-0" />
        )}
        {!isFetching && debounced.length > 0 && (
          <X className="shrink-0 size-4" />
        )}
      </Button>
      <div
        className={`bg-white divide-y-[1px] transition-all duration-300 absolute inset-x-0 top-11 rounded border w-full
           ${
             debounced.length > 0
               ? "opacity-100 visible translate-y-0"
               : "opacity-0 invisible translate-y-5"
           }`}
      >
        {content}
      </div>
    </div>
  );
};

export default SearchBar;
