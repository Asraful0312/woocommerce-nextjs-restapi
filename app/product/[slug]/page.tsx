import React from "react";
import ProductDetails from "./ProductDetails";
import { Metadata } from "next";
import { BASE_URL } from "@/lib/utils";
// import { ProductType } from "@/lib/types";

// export async function generateStaticParams() {
//   const {products} = await fetch(`${BASE_URL}/products`).then((res) =>
//     res.json()
//   );
//   return products?.map((product: ProductType) => ({
//     params: { slug: product?.slug },
//   }));
// }

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
    const response = await fetch(`${BASE_URL}/products/${params.slug}`);
    if (!response.ok) throw new Error("Failed to fetch product");
    product = await response.json();
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return defaultMetadata;
  }

  const yoast = product?.yoast_head_json;

  return {
    title: yoast?.title || defaultMetadata.title,
    description: yoast?.og_description || defaultMetadata.description,
    openGraph: {
      title: yoast?.og_title || defaultMetadata.title,
      description: yoast?.og_description || defaultMetadata.description,
      url: yoast?.og_url || `${BASE_URL}/products/${params.slug}`,
      images:
        yoast?.og_image?.map((image: any) => ({
          url: image.url,
          width: image.width,
          height: image.height,
        })) || [],
      type: yoast?.og_type || "website",
    },
    twitter: {
      card: yoast?.twitter_card || "summary_large_image",
    },
  };
}

const Page = ({ params }: { params: { slug: string } }) => {
  return <ProductDetails params={params?.slug} />;
};

export default Page;
