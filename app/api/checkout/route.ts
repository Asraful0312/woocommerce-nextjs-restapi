import { NextResponse } from "next/server";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const api = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL!,
  consumerKey: process.env.WC_CUSTOMER_KEY!,
  consumerSecret: process.env.WC_CUSTOMER_SECRET!,
  version: "wc/v3",
});

export async function POST(req: Request) {
  try {
    const {
      line_items,
      billing,
      shipping,
      meta_data,
      shipping_lines,
      id,
      token,
    } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: "Authentication token missing" },
        { status: 401 }
      );
    }

    // 1️⃣ Validate the User Token Before Creating an Order
    const authResponse = await fetch(
      `${process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/wp-json/wp/v2/users/me`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!authResponse.ok) {
      return NextResponse.json(
        { error: "User authentication failed" },
        { status: 401 }
      );
    }

    const user = await authResponse.json();
    console.log("Authenticated User:", user);

    // 2️⃣ Ensure the User Role is "customer"
    await api.put(`customers/${user.id}`, {
      role: "customer",
    });

    // 3️⃣ Create WooCommerce Order (Pending Payment)
    const orderResponse = await api.post("orders", {
      customer_id: id ? "1" : "0",
      payment_method: "stripe",
      payment_method_title: "Credit Card",
      set_paid: false,
      billing,
      shipping,
      line_items,
      shipping_lines,
      meta_data,
    });

    const order = orderResponse.data;

    console.log("Order Created:", order);

    // 4️⃣ Generate WooCommerce Payment URL
    const paymentUrl = `${order.payment_url}`;

    return NextResponse.json(
      { checkoutUrl: paymentUrl, orderId: order?.id },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(
      "Error processing checkout:",
      error.response?.data || error.message
    );
    return NextResponse.json(
      { error: "Failed to process checkout" },
      { status: 500 }
    );
  }
}
