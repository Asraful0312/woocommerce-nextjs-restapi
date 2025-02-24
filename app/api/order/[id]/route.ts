export const dynamic = "force-dynamic";
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
    const { searchParams } = new URL(request.url);
    const isLoggedIn = searchParams.get("isLoggedIn");

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    const { data } = await api.get(`orders/${orderId}`);

    if (isLoggedIn && data.customer_id.toString() !== "0") {
      return NextResponse.json({
        error: "You cannot access this order",
        status: 401,
      });
    }

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

//update order
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const orderId = params?.id;
  try {
    const body = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }
    if (!body) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const { data } = await api.put(`orders/${orderId}`, body);
    return NextResponse.json(
      { order_id: data.id, status: data.status, order: data },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(
      "WooCommerce Order Update Error:",
      error.response?.data || error.message
    );
    return NextResponse.json(
      { error: error.response?.data || "Unknown error occurred" },
      { status: 500 }
    );
  }
}
