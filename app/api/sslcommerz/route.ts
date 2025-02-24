import { OrderType } from "@/lib/order-types";
import api from "@/lib/woocommerce";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const order = await req.json();

    const orderResponse = await api.post("orders", order);

    const orderData: OrderType = await orderResponse.data;
    const order_id = orderData.id; // Get order ID from WooCommerce

    const productNames = orderData.line_items
      .map((item) => item.name)
      .join(", ");
    const productQuantities = orderData.line_items
      .map((item) => item.quantity)
      .join(", ");

    const sslcz = {
      store_id: process.env.SSLC_STORE_ID,
      store_passwd: process.env.SSLC_STORE_PASSWORD,
      total_amount: orderData?.total,
      currency: orderData?.currency || "BDT",
      tran_id: `txn_${Date.now()}`,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/sslcommerz/success`,
      fail_url: `${process.env.NEXT_PUBLIC_SITE_URL}/sslcommerz/fail`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/sslcommerz/cancel`,
      ipn_url: `${process.env.NEXT_PUBLIC_SITE_URL}/sslcommerz/ipn`,
      shipping_method: "Courier",
      product_name: productNames, // Extracted product names
      product_category: "General",
      product_profile: "general",
      cus_name: orderData?.billing?.first_name,
      cus_email: orderData?.billing?.email,
      cus_add1: orderData?.billing?.address_1,
      cus_city: orderData?.billing?.city || "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: orderData?.billing?.postcode || "1000",
      cus_country: orderData?.billing?.country || "Bangladesh",
      cus_phone: orderData?.billing?.phone,
      ship_name: orderData?.billing?.first_name,
      ship_add1: orderData?.billing?.address_1,
      ship_city: orderData?.billing?.city || "Dhaka",
      ship_state: "Dhaka",
      ship_postcode: orderData?.billing?.postcode || "1000",
      ship_country: orderData?.billing?.country || "Bangladesh",
      value_a: order_id,
      product_quantity: productQuantities, // Include product quantities
    };

    // Convert all values to strings, handling undefined
    const formBody = new URLSearchParams(
      Object.entries(sslcz).map(([key, value]) => [key, String(value)])
    );

    const sslCommerzResponse = await fetch(
      "https://sandbox.sslcommerz.com/gwprocess/v3/api.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formBody,
      }
    );

    const responseJson = await sslCommerzResponse.json();

    return NextResponse.json(responseJson);
  } catch (error) {
    console.log("sslc error", error);
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
}
