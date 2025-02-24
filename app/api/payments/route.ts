import { NextResponse } from "next/server";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const api = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL!,
  consumerKey: process.env.WC_CUSTOMER_KEY!,
  consumerSecret: process.env.WC_CUSTOMER_SECRET!,
  version: "wc/v3",
});

export async function GET() {
  try {
    const { data } = await api.get("payment_gateways");

    console.log("payment data", data);

    // Filter only enabled payment gateways
    const enabledGateways = Object.values(data).filter(
      (gateway: any) => gateway.enabled
    );

    return NextResponse.json({
      success: true,
      paymentMethods: enabledGateways,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
