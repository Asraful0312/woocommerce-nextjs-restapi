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
  { params }: { params: { customerId: string } }
) {
  try {
    const customerId = params?.customerId;

    if (!customerId) {
      NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const { data } = await api.get(`customers/${customerId}/downloads`);

    console.log("downloads", data);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error(
      "WooCommerce Fetch Order Error:",
      error.response?.data || error.message
    );
    return NextResponse.json(
      { error: error.response?.data || "Unknown error" },
      { status: 500 }
    );
  }
}
