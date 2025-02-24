import { ProductType } from "@/lib/types";
import api from "@/lib/woocommerce";

const getProducts = async () => {
  try {
    const { data: products } = await api.get("products", {
      status: "publish",
    });

    return products;
  } catch (error) {
    console.log(error);

    throw new Error("There was an error");
  }
};
export default async function sitemap() {
  const products = await getProducts();
  const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;

  const productSiteMap = products?.map((product: ProductType) => {
    return {
      url: `${baseUrl}/product/${product?.slug}`,
      lastModified: product?.date_created,
    };
  });
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    ...productSiteMap,
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/orders`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
    },
  ];
}
