export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import jwt from "jsonwebtoken";

const api = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL!,
  consumerKey: process.env.WC_CUSTOMER_KEY!,
  consumerSecret: process.env.WC_CUSTOMER_SECRET!,
  version: "wc/v3",
});

export async function GET(request: NextRequest) {
  try {
    // Extract the Authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Decode the JWT to extract the customer ID
    const decoded = jwt.decode(token) as { data?: { user?: { id: string } } };
    const customerId = decoded?.data?.user?.id;

    if (!customerId) {
      return NextResponse.json(
        { error: "User ID not found in token" },
        { status: 400 }
      );
    }

    // Fetch all orders for the user
    const { data } = await api.get(`orders`, {
      customer: customerId, // Filter by customer ID
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error(
      "WooCommerce Fetch Orders Error:",
      error.response?.data || error.message
    );
    return NextResponse.json(
      { error: error.response?.data || "Unknown error" },
      { status: 500 }
    );
  }
}
