import { NextRequest, NextResponse } from "next/server";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const api = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL!,
  consumerKey: process.env.WC_CUSTOMER_KEY!,
  consumerSecret: process.env.WC_CUSTOMER_SECRET!,
  version: "wc/v3",
});

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  try {
    // Fetch product by slug
    const { data: products } = await api.get("products", { slug });

    if (!products.length) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const product = products[0];

    // Fetch variations if the product has variations
    let variations = [];
    if (product.type === "variable") {
      const { data: variationsData } = await api.get(
        `products/${product.id}/variations`
      );
      variations = variationsData;
    }

    return NextResponse.json({ ...product, variations });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
