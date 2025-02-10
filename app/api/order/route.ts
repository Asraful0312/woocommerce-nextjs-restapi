import { NextRequest, NextResponse } from "next/server";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const api = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL!,
  consumerKey: process.env.WC_CUSTOMER_KEY!,
  consumerSecret: process.env.WC_CUSTOMER_SECRET!,
  version: "wc/v3",
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.line_items || body.line_items.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create the order in WooCommerce
    const { data } = await api.post("orders", body);

    console.log("order data", data);

    return NextResponse.json(
      { order_id: data.id, status: data.status },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(
      "WooCommerce Order Error:",
      error.response?.data || error.message
    );
    return NextResponse.json(
      { error: error.response?.data || "Unknown error occurred" },
      { status: 500 }
    );
  }
}
