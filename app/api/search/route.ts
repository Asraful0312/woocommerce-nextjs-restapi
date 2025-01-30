import { NextRequest, NextResponse } from "next/server";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

// Initialize WooCommerce API
const api = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL!,
  consumerKey: process.env.WC_CUSTOMER_KEY!,
  consumerSecret: process.env.WC_CUSTOMER_SECRET!,
  version: "wc/v3",
});

export async function GET(request: NextRequest) {
  try {
    // Get the search query from the URL
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get("query");

    if (!searchQuery) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    // Fetch products matching the search query
    const { data } = await api.get("products", {
      search: searchQuery,
      per_page: 10, // Limit results to 10
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error(
      "WooCommerce Product Search Error:",
      error.response?.data || error.message
    );
    return NextResponse.json(
      { error: error.response?.data || "Unknown error" },
      { status: 500 }
    );
  }
}
