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
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params?.id;

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    const { data } = await api.get(`orders/${orderId}`);

    const orderData = {
      name: data.billing.first_name,
      customer_id: data.customer_id,
      order_id: data.id,
      status: data.status,
      currency: data.currency,
      price: data.total,
      currency_symbol: data.currency_symbol,
      billing: data.billing,
    };

    return NextResponse.json(orderData);
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
