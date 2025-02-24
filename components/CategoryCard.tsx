import { ProductCategory } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  category: ProductCategory;
};

const CategoryCard = ({ category }: Props) => {
  return (
    <Link
      href={`/shop?category=${category?.id}&category_name=${category?.name}`}
      key={category?.id}
      className="group bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 relative flex items-center justify-center flex-col gap-2 py-4 px-2 border hover:border-primary"
    >
      <Image
        src={category?.image?.src || "/placeholder.png"}
        alt={category?.slug}
        width={150}
        height={150}
        className="object-cover size-20 group-hover:scale-110 transition-all duration-500"
      />

      <div className="flex flex-wrap gap-1 items-center justify-center w-full ">
        <p className="text-black text-center text-xs md:text-base line-clamp-1 p-1">
          {category?.name || "No name found"}
        </p>
        <span className="bg-gray-300 rounded-full shrink-0 size-4 text-xs text-gray-600 flex itecms-center justify-center">
          {category?.count || "0"}
        </span>
      </div>
    </Link>
  );
};

export default CategoryCard;
