export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import { ProductType } from "@/lib/types";

const api = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL!,
  consumerKey: process.env.WC_CUSTOMER_KEY!,
  consumerSecret: process.env.WC_CUSTOMER_SECRET!,
  version: "wc/v3",
});

export async function GET(req: NextRequest) {
  const responseData: {
    success: boolean;
    products: ProductType[];
    error: string;
  } = {  
    success: false,
    products: [],
    error: "",
  };

  const { searchParams } = new URL(req.url);
  const perPage = searchParams.get("per_page") || "10";
  const page = searchParams.get("page") || "1";
  const featured = searchParams.get("feature");
  const recent = searchParams.get("recent");
  const onSale = searchParams.get("on_sale");
  const category = searchParams.get("category");

  try {
    const params: Record<string, any> = {
      per_page: parseInt(perPage),
      page: parseInt(page),
      status: "publish",
    };

    if (featured) params.featured = featured === "true";
    if (onSale) params.on_sale = onSale === "true";
    if (recent) params.orderby = "date"; // Fetch most recent products
    if (category) params.category = category;

    const { data: products } = await api.get("products", params);

    // Fetch variations if product type is "variable"
    const productsWithVariations = await Promise.all(
      products.map(async (product: ProductType) => {
        if (product.type === "variable") {
          const { data: variations } = await api.get(
            `products/${product.id}/variations`
          );
          return { ...product, variations };
        }
        return product;
      })
    );

    responseData.success = true;
    responseData.products = productsWithVariations;
    return NextResponse.json(responseData);
  } catch (error) {
    responseData.error =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(responseData, { status: 500 });
  }
}
