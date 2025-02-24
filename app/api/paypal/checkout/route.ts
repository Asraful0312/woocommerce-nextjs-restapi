import { NextResponse, NextRequest } from "next/server";
import api from "@/lib/woocommerce";

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID!;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET!;
const PAYPAL_BASE_URL =
  process.env.NEXT_PUBLIC_PAYPAL_MODE === "live"
    ? "https://api.paypal.com"
    : "https://api.sandbox.paypal.com";

// Get PayPal access token
async function getPayPalAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString(
    "base64"
  );
  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  return data.access_token;
}

export async function POST(req: NextRequest) {
  try {
    const orderData = await req.json();

    // Step 1: Create WooCommerce Order
    const { data: order } = await api.post("orders", orderData);

    // Step 2: Get PayPal Access Token
    const accessToken = await getPayPalAccessToken();

    // Step 3: Create PayPal Order
    const paypalOrderRes = await fetch(
      `${PAYPAL_BASE_URL}/v2/checkout/orders`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              reference_id: order.id.toString(),
              amount: {
                currency_code: "USD",
                value: order?.total,
              },
            },
          ],
          application_context: {
            return_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/paypal/capture?wooOrderID=${order.id}`,
            cancel_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/paypal/cancel?wooOrderID=${order.id}`,
          },
        }),
      }
    );

    const paypalOrderData = await paypalOrderRes.json();

    console.log("paypal order data", paypalOrderData);

    if (!paypalOrderData.id) {
      return NextResponse.json(
        { error: "Failed to create PayPal order" },
        { status: 500 }
      );
    }

    const approvalUrl = paypalOrderData.links.find(
      (link: any) => link.rel === "approve"
    )?.href;

    return NextResponse.json({ url: approvalUrl });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: (error as any).message },
      { status: 500 }
    );
  }
}
