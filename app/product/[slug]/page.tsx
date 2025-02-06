import React from "react";
import ProductDetails from "./ProductDetails";
import { Metadata } from "next";
import api from "@/lib/woocommerce";

const defaultMetadata: Metadata = {
  title: "Not Found",
  description: "This page in not found",
};

// Set Yoast metadata
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  let product;
  try {
    const response = await api.get("products", {
      slug: params.slug,
    });

    if (!response.data.length) throw new Error("Product not found");

    product = response.data[0]; // WooCommerce returns an array for slug-based queries
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return defaultMetadata;
  }

  const yoast = product?.yoast_head_json;

  return {
    title: yoast?.title || product.name || defaultMetadata.title,
    description:
      yoast?.og_description ||
      product.short_description ||
      defaultMetadata.description,
    openGraph: {
      title: yoast?.og_title || product.name || defaultMetadata.title,
      description:
        yoast?.og_description ||
        product.short_description ||
        defaultMetadata.description,
      url: `${process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/product/${params.slug}`,
      images:
        product?.images?.map((image: any) => ({
          url: image.src,
          width: image.width,
          height: image.height,
        })) || [],
      type: "article", // Changed from "product" to "article"
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

const Page = ({ params }: { params: { slug: string } }) => {
  return <ProductDetails params={params?.slug} />;
};

export default Page;
