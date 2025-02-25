export const dynamic = "force-dynamic";
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

export async function GET(req: NextRequest) {
  try {
    console.log("Capture Request URL:", req.url);

    const { searchParams } = new URL(req.url);
    const orderID = searchParams.get("token"); // PayPal sends "token" instead of "orderID"
    const wooOrderID = searchParams.get("wooOrderID");

    console.log("Extracted orderID (PayPal token):", orderID);
    console.log("Extracted wooOrderID:", wooOrderID);

    if (!orderID || !wooOrderID) {
      return NextResponse.json(
        { error: "Invalid request - Missing orderID or wooOrderID" },
        { status: 400 }
      );
    }

    // Get PayPal Access Token
    const accessToken = await getPayPalAccessToken();

    // Capture the payment
    const captureRes = await fetch(
      `${PAYPAL_BASE_URL}/v2/checkout/orders/${orderID}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const captureData = await captureRes.json();
    console.log("Capture Data:", captureData);

    if (captureData.status === "COMPLETED") {
      const transactionID =
        captureData?.purchase_units?.[0]?.payments?.captures?.[0]?.id || null;

      console.log("transaction id", transactionID);
      // Update WooCommerce order to "processing"
      await api.put(`orders/${wooOrderID}`, {
        status: "processing",
        transaction_id: transactionID,
      });

      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_FRONTEND_URL}/success?order_id=${wooOrderID}`
      );
    } else {
      // If payment fails, update WooCommerce to "failed"
      await api.put(`orders/${wooOrderID}`, { status: "failed" });

      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_FRONTEND_URL}/fail`
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: (error as any).message },
      { status: 500 }
    );
  }
}
